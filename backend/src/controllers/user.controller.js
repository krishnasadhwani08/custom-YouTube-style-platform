import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";

/* ─────────────────────────────────────────────
   Cookie Options
───────────────────────────────────────────── */

const cookieOptions = {

    httpOnly: true,

    secure:
        process.env.NODE_ENV ===
        "production",

    sameSite:
        process.env.NODE_ENV ===
        "production"
            ? "none"
            : "lax",

    path: "/"
};

/* ─────────────────────────────────────────────
   Generate Tokens
───────────────────────────────────────────── */

const generateAccessAndRefreshToken =
async (userId) => {

    const user =
        await User.findById(userId);

    if (!user) {

        throw new ApiError(
            404,
            "User not found"
        );
    }

    const accessToken =
        user.generateAccessToken();

    const refreshToken =
        user.generateRefreshToken();

    user.refreshToken =
        refreshToken;

    await user.save({
        validateBeforeSave: false
    });

    return {
        accessToken,
        refreshToken
    };
};

/* ─────────────────────────────────────────────
   Register User
───────────────────────────────────────────── */

const registerUser =
asyncHandler(async (req, res) => {

    const {

        email,
        password,
        fullName,
        userName

    } = req.body;

    if (

        [

            email,
            password,
            fullName,
            userName

        ].some(

            (field) =>

                !field ||

                field.trim() === ""
        )
    ) {

        throw new ApiError(

            400,

            "All fields are required"
        );
    }

    const existedUser =
        await User.findOne({

            $or: [

                { email },

                { userName }
            ]
        });

    if (existedUser) {

        throw new ApiError(

            409,

            "User already exists"
        );
    }

    const avatarLocalPath =
        req.files?.avatar?.[0]?.path;

    const coverImageLocalPath =
        req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {

        throw new ApiError(

            400,

            "Avatar is required"
        );
    }

    const avatar =
        await uploadOnCloudinary(
            avatarLocalPath
        );

    const coverImage =
        coverImageLocalPath

            ? await uploadOnCloudinary(
                coverImageLocalPath
              )

            : null;

    if (!avatar?.url) {

        throw new ApiError(

            400,

            "Avatar upload failed"
        );
    }

    const user =
        await User.create({

            fullName,

            avatar: avatar.url,

            coverImage:
                coverImage?.url || "",

            email,

            password,

            userName:
                userName.toLowerCase(),

            isVerified: false
        });

    /* Verify Token */

    const verifyToken =
        jwt.sign(

            {

                _id: user._id
            },

            process.env
                .ACCESS_TOKEN_SECRET,

            {

                expiresIn: "1d"
            }
        );

    /* Frontend URL */

    const frontendUrl =
        process.env.CORS_ORIGIN;

    if (!frontendUrl) {

        throw new ApiError(
            500,
            "CORS_ORIGIN missing"
        );
    }

    /* Verify Link */

    const verifyLink =
`${frontendUrl}/verify/${verifyToken}`;

    console.log(
        "Verify Link:",
        verifyLink
    );

    /* Send Email */

    await sendEmail(

        user.email,

        "Verify Your GenZTube Account",

        `
        <div style="font-family:sans-serif;padding:30px;background:#0f0f0f;color:white;">

            <h1 style="color:#00e5ff;">
                Welcome to GenZTube
            </h1>

            <p>
                Verify your account to continue
            </p>

            <a
                href="${verifyLink}"
                style="
                    display:inline-block;
                    margin-top:20px;
                    padding:14px 24px;
                    background:linear-gradient(90deg,#00e5ff,#ff00aa);
                    color:white;
                    text-decoration:none;
                    border-radius:12px;
                    font-weight:bold;
                "
            >
                Verify Account
            </a>

            <p style="margin-top:30px;color:#888;">
                This link expires in 24 hours
            </p>

        </div>
        `
    );

    const createdUser =
        await User.findById(
            user._id
        ).select(

            "-password -refreshToken"
        );

    return res
        .status(201)
        .json(

            new ApiResponse(

                201,

                createdUser,

                "User registered successfully. Verification email sent."
            )
        );
});

/* ─────────────────────────────────────────────
   Verify Email
───────────────────────────────────────────── */

const verifyEmail =
asyncHandler(async (req, res) => {

    const { token } =
        req.params;

    if (!token) {

        throw new ApiError(
            400,
            "Verification token missing"
        );
    }

    let decoded;

    try {

        decoded =
            jwt.verify(

                token,

                process.env
                    .ACCESS_TOKEN_SECRET
            );

    } catch (error) {

        console.log(error);

        throw new ApiError(
            401,
            "Invalid or expired token"
        );
    }

    const user =
        await User.findById(
            decoded?._id
        );

    if (!user) {

        throw new ApiError(
            404,
            "User not found"
        );
    }

    if (user.isVerified) {

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Email already verified"
                )
            );
    }

    user.isVerified = true;

    await user.save({

        validateBeforeSave: false
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Email verified successfully"
            )
        );
});

/* ─────────────────────────────────────────────
   Login User
───────────────────────────────────────────── */

const loginUser =
asyncHandler(async (req, res) => {

    const {
        email,
        userName,
        password
    } = req.body;

    if (!email && !userName) {

        throw new ApiError(
            400,
            "Email or username required"
        );
    }

    const user =
        await User.findOne({

            $or: [

                { email },

                { userName }
            ]
        });

    if (!user) {

        throw new ApiError(
            404,
            "User not found"
        );
    }

    if (!user.isVerified) {

        throw new ApiError(
            401,
            "Please verify your email first"
        );
    }

    const isPasswordValid =
        await user.isPasswordCorrect(
            password
        );

    if (!isPasswordValid) {

        throw new ApiError(
            401,
            "Invalid credentials"
        );
    }

    const {

        accessToken,
        refreshToken

    } =
        await generateAccessAndRefreshToken(
            user._id
        );

    const loggedInUser =
        await User.findById(
            user._id
        ).select(
            "-password -refreshToken"
        );

    return res

        .status(200)

        .cookie(
            "accessToken",
            accessToken,
            cookieOptions
        )

        .cookie(
            "refreshToken",
            refreshToken,
            cookieOptions
        )

        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken
                },
                "User logged in successfully"
            )
        );
});

/* ─────────────────────────────────────────────
   Logout User
───────────────────────────────────────────── */

const logoutUser =
asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(

        req.user._id,

        {
            $unset: {
                refreshToken: 1
            }
        },

        {
            new: true
        }
    );

    return res

        .status(200)

        .clearCookie(
            "accessToken",
            cookieOptions
        )

        .clearCookie(
            "refreshToken",
            cookieOptions
        )

        .json(
            new ApiResponse(
                200,
                {},
                "Logged out successfully"
            )
        );
});

/* ─────────────────────────────────────────────
   Exports
───────────────────────────────────────────── */

export {

    registerUser,

    verifyEmail,

    loginUser,

    logoutUser
};