import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/Cloudinary.js"

const registerUser = asyncHandler( async(req, res) => {
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
    const {username, email, fullName, password} = req.body ;


// Step: 2
{

    if (!fullName || fullName.trim() === "") { throw new ApiError(400, "Full name is required.");}
    if (!username || username.trim() === "") {throw new ApiError(400, "Username is required.");}
    if (!email || email.trim() === "") {throw new ApiError(400, "Email is required.");}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { throw new ApiError(400, "Invalid email format.");}
    if (!password || password.trim() === "") { throw new ApiError(400, "Password is required.");}
    if (password.length < 4) { throw new ApiError(400, "Password must be at least 4 characters long.");}
}
 

// Step: 3
    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
 
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;


// Step: 4
    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

// Step: 5
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

// Step: 6
    if(!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }

// Step: 7
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    ) ;

    if(!createdUser) {
        throw new ApiError(500, `Something went wrong while registering the user`);
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})


export {registerUser} ;