import mongoose, {Schema} from "mongoose"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
{
    username: { 
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar: {
        type: String, // Cloudinary URL
        required: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken: {
        type: String,
    }
}, 
{timestamps: true});
 

userSchema.pre("save", async function(next) {
    if(this.isModified("password"))
    {
        this.password = bcrypt.hash(this.password, 10);
        next(); 
    }
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function() {
    return jwt.sign(
        {
            _id: this._id, // From Mongodb
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function() {
    return jwt.sign(
        {
            _id: this._id, // From Mongodb
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPITY
        }
    )
}

export const User = mongoose.model("User", userSchema) ;