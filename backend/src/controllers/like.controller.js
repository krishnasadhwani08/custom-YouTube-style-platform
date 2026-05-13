import mongoose, { isValidObjectId }
from "mongoose";

import { Like }
from "../models/like.model.js";

import { ApiError }
from "../utils/ApiError.js";

import { ApiResponse }
from "../utils/ApiResponse.js";

import { asyncHandler }
from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(
async (req, res) => {

    const { videoId } = req.params;

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(
            401,
            "Unauthorized"
        );
    }

    if (
        !videoId ||
        !isValidObjectId(videoId)
    ) {
        throw new ApiError(
            400,
            "Valid video ID required"
        );
    }

    const existingLike =
        await Like.findOne({
            video: videoId,
            likedBy: userId
        });

    if (existingLike) {

        await Like.deleteOne({
            _id: existingLike._id
        });

        const likeCount =
            await Like.countDocuments({
                video: videoId
            });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    liked: false,
                    likeCount
                },
                "Video unliked"
            )
        );
    }

    await Like.create({
        video: videoId,
        likedBy: userId
    });

    const likeCount =
        await Like.countDocuments({
            video: videoId
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                liked: true,
                likeCount
            },
            "Video liked"
        )
    );
});

const toggleCommentLike = asyncHandler(
async (req, res) => {

    const { commentId } = req.params;

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(
            401,
            "Unauthorized"
        );
    }

    if (
        !commentId ||
        !isValidObjectId(commentId)
    ) {
        throw new ApiError(
            400,
            "Valid comment ID required"
        );
    }

    const existingLike =
        await Like.findOne({
            comment: commentId,
            likedBy: userId
        });

    if (existingLike) {

        await Like.deleteOne({
            _id: existingLike._id
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    liked: false
                },
                "Comment unliked"
            )
        );
    }

    await Like.create({
        comment: commentId,
        likedBy: userId
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                liked: true
            },
            "Comment liked"
        )
    );
});

const toggleTweetLike = asyncHandler(
async (req, res) => {

    const { tweetId } = req.params;

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(
            401,
            "Unauthorized"
        );
    }

    if (
        !tweetId ||
        !isValidObjectId(tweetId)
    ) {
        throw new ApiError(
            400,
            "Valid tweet ID required"
        );
    }

    const existingLike =
        await Like.findOne({
            tweet: tweetId,
            likedBy: userId
        });

    if (existingLike) {

        await Like.deleteOne({
            _id: existingLike._id
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    liked: false
                },
                "Tweet unliked"
            )
        );
    }

    await Like.create({
        tweet: tweetId,
        likedBy: userId
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                liked: true
            },
            "Tweet liked"
        )
    );
});

const getLikedVideos = asyncHandler(
async (req, res) => {

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(
            401,
            "Unauthorized"
        );
    }

    const likes = await Like.find({
        likedBy: userId,
        video: {
            $exists: true
        }
    })
    .populate({
        path: "video",
        populate: {
            path: "owner",
            select:
              "fullName userName avatar"
        }
    });

    const videos = likes
        .map((like) => like.video)
        .filter(Boolean);

    return res.status(200).json(
        new ApiResponse(
            200,
            videos,
            "Liked videos fetched successfully"
        )
    );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};