import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// Define the user schema
const userSchema = new mongoose.Schema(
    {
        // Username field
        userName: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        // Email field
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },
        // Full Name field
        fullName: {
            type: String,
            required: [true, "Full Name is required"],
            trim: true,
            index: true
        },
        // Avatar URL field (expected to store Cloudinary URL)
        avatar: {
            type: String,
            required: [true, "Avatar URL is required"]
        },
        // Cover Image field
        coverImage: {
            type: String
        },
        // Watch History field (array of references to Video documents)
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        // Password field (hashed using bcrypt before saving)
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        // Refresh Token field
        refreshToken: {
            type: String
        }
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
})


userSchema.methods.isPasswordCorrect = async function (password) {

    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAcessToken = async function () {

    return await jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )


}



userSchema.methods.generateRefreshToken = async function () {
    return await jwt.sign(
        {
            _id: this._id,
            email: this.email

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User = mongoose.model("User", userSchema)