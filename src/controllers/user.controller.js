import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
 

const generateAccessAndRefreshTokens = async(userId) => {
    try{
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false}) ;

        return {accessToken, refreshToken};
    }
    catch(error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // 1. Get user details
    // 2. Do validation
    // 3. Check if user already exists: username, email
    // 4. Check for images and avatar(Compulsory)
    // 5. Upload images and avatar in Cloudinary
    // 6. Check avatar is successfully uploaded at cloudinary or not
    // 7. Create user object - create entry in db
    // 8. Remove password and refresh token field from response
    // 9. Check for user creation
    // 10. return response

    // Step: 1
    const { username, email, fullName, password } = req.body;

    // Step: 2
    {
        if (!fullName || fullName.trim() === "") {
            throw new ApiError(400, "Full name is required.");
        }
        if (!username || username.trim() === "") {
            throw new ApiError(400, "Username is required.");
        }
        if (!email || email.trim() === "") {
            throw new ApiError(400, "Email is required.");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ApiError(400, "Invalid email format.");
        }
        if (!password || password.trim() === "") {
            throw new ApiError(400, "Password is required.");
        }
        if (password.length < 4) {
            throw new ApiError(
                400,
                "Password must be at least 4 characters long."
            );
        }
    }
/* OR
    if([username, email, fullName, password].some((field) => field.trim() === "")) {
        throw new ApiError(400, "All fields are required") ;
    }
*/


    // Step: 3
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let avatarLocalPath = "" ;
    if(req.files && Array.isArray(req.files.avatar)) {
        avatarLocalPath = req.files.avatar[0].path ;
    }

    let coverImageLocalPath = "" ;
    if(req.files && Array.isArray(req.files.coverImage)) {
        coverImageLocalPath = req.files.coverImage[0].path ;
    }


    // Step: 4
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required --> Multer");
    }

    // Step: 5
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // Step: 6
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required --> Cloudinary");
    }

    // Step: 7
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    // Step: 8
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // Step: 9
    if (!createdUser) {
        throw new ApiError(
            500,
            `Something went wrong while registering the user`
        );
    }

    // Step: 10
    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User registered Successfully")
        );
});


const loginUser = asyncHandler(async (req, res) => {
    // Get User Details
    // Validation (username or email)
    // Find the user
    // Password check
    // access and refresh token
    // send cookie

    const {email, username, password} = req.body ;

    if(!username || !email) {
        throw new ApiError(400, "Username or email is required") ;
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    }) 

    if(!user) {
        throw new ApiError(404, "User does not exists!");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials!");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = { // Only Server can able to modify cookies, if we use this options
        httpOnly: true,
        secure: true,
    }

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, 
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged In successfully"
            )
        )
});


const logoutUser = asyncHandler(async(req, res) => {
    const id = req.user._id ;
    await User.findByIdAndUpdate(
        id,
        {
            $set: {
                refreshToken: undefined
            }       
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))
})

export { registerUser, loginUser, logoutUser };