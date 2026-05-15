import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
}

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
                userName.toLowerCase()
        });

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
                "User registered successfully"
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
   Refresh Token
───────────────────────────────────────────── */

const refreshAccessToken =
asyncHandler(async (req, res) => {

    const incomingRefreshToken =
        req.cookies?.refreshToken ||
        req.body?.refreshToken;

    if (!incomingRefreshToken) {

        throw new ApiError(
            401,
            "Unauthorized request"
        );
    }

    let decodedToken;

    try {

        decodedToken =
            jwt.verify(
                incomingRefreshToken,
                process.env
                    .REFRESH_TOKEN_SECRET
            );

    } catch {

        throw new ApiError(
            401,
            "Invalid refresh token"
        );
    }

    const user =
        await User.findById(
            decodedToken?._id
        );

    if (!user) {

        throw new ApiError(
            401,
            "Invalid refresh token"
        );
    }

    if (
        incomingRefreshToken !==
        user?.refreshToken
    ) {

        throw new ApiError(
            401,
            "Refresh token expired"
        );
    }

    const options = {
        ...cookieOptions
    };

    const {
        accessToken,
        refreshToken
    } =
        await generateAccessAndRefreshToken(
            user._id
        );

    return res

        .status(200)

        .cookie(
            "accessToken",
            accessToken,
            options
        )

        .cookie(
            "refreshToken",
            refreshToken,
            options
        )

        .json(
            new ApiResponse(
                200,
                {
                    accessToken
                },
                "Access token refreshed"
            )
        );
});

/* ─────────────────────────────────────────────
   Change Password
───────────────────────────────────────────── */

const changeCurrentPassword =
asyncHandler(async (req, res) => {

    const {
        oldPassword,
        newPassword
    } = req.body;

    const user =
        await User.findById(
            req.user?._id
        );

    const isPasswordCorrect =
        await user.isPasswordCorrect(
            oldPassword
        );

    if (!isPasswordCorrect) {

        throw new ApiError(
            400,
            "Invalid old password"
        );
    }

    user.password =
        newPassword;

    await user.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password changed successfully"
            )
        );
});

/* ─────────────────────────────────────────────
   Get Current User
───────────────────────────────────────────── */

const getCurrentUser =
asyncHandler(async (req, res) => {

    const user =
        await User.findById(
            req.user?._id
        ).select(
            "-password -refreshToken"
        );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Current user fetched"
            )
        );
});

/* ─────────────────────────────────────────────
   Update Account
───────────────────────────────────────────── */

const updateAccountDetails =
asyncHandler(async (req, res) => {

    const {
        fullName,
        email
    } = req.body;

    if (!fullName || !email) {

        throw new ApiError(
            400,
            "All fields required"
        );
    }

    const user =
        await User.findByIdAndUpdate(

            req.user?._id,

            {
                $set: {
                    fullName,
                    email
                }
            },

            {
                new: true
            }

        ).select(
            "-password -refreshToken"
        );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Account updated successfully"
            )
        );
});

/* ─────────────────────────────────────────────
   Update Avatar
───────────────────────────────────────────── */

const updateUserAvatar =
asyncHandler(async (req, res) => {

    const avatarLocalPath =
        req.file?.path;

    if (!avatarLocalPath) {

        throw new ApiError(
            400,
            "Avatar file missing"
        );
    }

    const avatar =
        await uploadOnCloudinary(
            avatarLocalPath
        );

    if (!avatar?.url) {

        throw new ApiError(
            400,
            "Avatar upload failed"
        );
    }

    const user =
        await User.findByIdAndUpdate(

            req.user?._id,

            {
                $set: {
                    avatar: avatar.url
                }
            },

            {
                new: true
            }

        ).select(
            "-password -refreshToken"
        );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Avatar updated successfully"
            )
        );
});

/* ─────────────────────────────────────────────
   Update Cover Image
───────────────────────────────────────────── */

const updateUserCoverImage =
asyncHandler(async (req, res) => {

    const coverImageLocalPath =
        req.file?.path;

    if (!coverImageLocalPath) {

        throw new ApiError(
            400,
            "Cover image missing"
        );
    }

    const coverImage =
        await uploadOnCloudinary(
            coverImageLocalPath
        );

    if (!coverImage?.url) {

        throw new ApiError(
            400,
            "Cover image upload failed"
        );
    }

    const user =
        await User.findByIdAndUpdate(

            req.user?._id,

            {
                $set: {
                    coverImage:
                        coverImage.url
                }
            },

            {
                new: true
            }

        ).select(
            "-password -refreshToken"
        );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Cover image updated"
            )
        );
});

/* ─────────────────────────────────────────────
   Channel Profile
───────────────────────────────────────────── */

const getUserChannelProfile =
asyncHandler(async (req, res) => {

    const { userName } =
        req.params;

    if (!userName?.trim()) {

        throw new ApiError(
            400,
            "Username missing"
        );
    }

    const channel =
        await User.aggregate([

            {
                $match: {
                    userName:
                        userName.toLowerCase()
                }
            },

            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribers"
                }
            },

            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribedTo"
                }
            },

            {
                $addFields: {

                    subscribersCount: {
                        $size: "$subscribers"
                    },

                    channelsSubscribedToCount: {
                        $size: "$subscribedTo"
                    },

                    isSubscribed: {
                        $cond: {

                            if: {
                                $in: [
                                    new mongoose.Types.ObjectId(
                                        req.user?._id
                                    ),
                                    "$subscribers.subscriber"
                                ]
                            },

                            then: true,

                            else: false
                        }
                    }
                }
            },

            {
                $project: {

                    fullName: 1,

                    userName: 1,

                    subscribersCount: 1,

                    channelsSubscribedToCount: 1,

                    isSubscribed: 1,

                    avatar: 1,

                    coverImage: 1,

                    email: 1
                }
            }
        ]);

    if (!channel?.length) {

        throw new ApiError(
            404,
            "Channel not found"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                channel[0],
                "Channel profile fetched"
            )
        );
});

/* ─────────────────────────────────────────────
   Watch History
───────────────────────────────────────────── */

const getWatchHistory =
asyncHandler(async (req, res) => {

    const user =
        await User.aggregate([

            {
                $match: {
                    _id:
                    new mongoose.Types.ObjectId(
                        req.user._id
                    )
                }
            },

            {
                $lookup: {

                    from: "videos",

                    localField:
                        "watchHistory",

                    foreignField: "_id",

                    as: "watchHistory",

                    pipeline: [

                        {
                            $lookup: {

                                from: "users",

                                localField:
                                    "owner",

                                foreignField:
                                    "_id",

                                as: "owner",

                                pipeline: [

                                    {
                                        $project: {

                                            fullName: 1,

                                            userName: 1,

                                            avatar: 1
                                        }
                                    }
                                ]
                            }
                        },

                        {
                            $addFields: {

                                owner: {
                                    $first:
                                        "$owner"
                                }
                            }
                        }
                    ]
                }
            }
        ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0]?.watchHistory,
                "Watch history fetched"
            )
        );
});

/* ─────────────────────────────────────────────
   Exports
───────────────────────────────────────────── */

export {

    registerUser,

    loginUser,

    logoutUser,

    refreshAccessToken,

    changeCurrentPassword,

    getCurrentUser,

    updateAccountDetails,

    updateUserAvatar,

    updateUserCoverImage,

    getUserChannelProfile,

    getWatchHistory
};