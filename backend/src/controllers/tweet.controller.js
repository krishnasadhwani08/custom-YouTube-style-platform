import mongoose, { isValidObjectId } from "mongoose";

import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {

    const { content } = req.body;

    if (!content) {
        throw new ApiError(
            400,
            "Content is required"
        );
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                tweet,
                "Tweet created successfully"
            )
        );
});

const getUserTweets = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(
            400,
            "Valid user ID required"
        );
    }

    const userTweets = await Tweet.find({
        owner: userId
    })
        .populate(
            "owner",
            "fullName userName avatar"
        )
        .sort({
            createdAt: -1
        });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                userTweets,
                "User tweets fetched successfully"
            )
        );
});

const updateTweet = asyncHandler(async (req, res) => {

    const { tweetId } = req.params;

    const { updatedTweet } = req.body;

    if (!tweetId || !isValidObjectId(tweetId)) {
        throw new ApiError(
            400,
            "Valid tweet ID required"
        );
    }

    if (!updatedTweet) {
        throw new ApiError(
            400,
            "Updated content required"
        );
    }

    const tweet = await Tweet.findOneAndUpdate(
        {
            _id: tweetId,
            owner: req.user?._id
        },
        {
            $set: {
                content: updatedTweet
            }
        },
        {
            new: true
        }
    );

    if (!tweet) {
        throw new ApiError(
            404,
            "Tweet not found or unauthorized"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweet,
                "Tweet updated successfully"
            )
        );
});

const deleteTweet = asyncHandler(async (req, res) => {

    const { tweetId } = req.params;

    if (!tweetId || !isValidObjectId(tweetId)) {
        throw new ApiError(
            400,
            "Valid tweet ID required"
        );
    }

    const tweet = await Tweet.findOneAndDelete({
        _id: tweetId,
        owner: req.user?._id
    });

    if (!tweet) {
        throw new ApiError(
            404,
            "Tweet not found"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweet,
                "Tweet deleted successfully"
            )
        );
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
};