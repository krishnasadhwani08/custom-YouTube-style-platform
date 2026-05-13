import mongoose from "mongoose";

import { Video }
from "../models/video.model.js";

import { Subscription }
from "../models/subscription.model.js";

import { Like }
from "../models/like.model.js";

import { ApiError }
from "../utils/ApiError.js";

import { ApiResponse }
from "../utils/ApiResponse.js";

import { asyncHandler }
from "../utils/asyncHandler.js";

const getChannelStats =
asyncHandler(async (req, res) => {

    const { channelId } = req.params;

    if (!channelId) {

        throw new ApiError(
            400,
            "Channel ID is required"
        );
    }

    const videos = await Video.find({
        owner: channelId
    });

    const videoIds = videos.map(
        (video) => video._id
    );

    const totalViews = videos.reduce(
        (acc, video) =>
            acc + (video.views || 0),
        0
    );

    const totalVideos =
        videos.length;

    const totalLikes =
        await Like.countDocuments({
            video: {
                $in: videoIds
            }
        });

    const totalSubscribers =
        await Subscription.countDocuments({
            channel: channelId
        });

    const stats = {
        totalViews,
        totalVideos,
        totalLikes,
        totalSubscribers
    };

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                stats,
                "Channel stats fetched successfully"
            )
        );
});

const getChannelVideos =
asyncHandler(async (req, res) => {

    const { channelId } = req.params;

    if (!channelId) {

        throw new ApiError(
            400,
            "Channel ID is required"
        );
    }

    const videos = await Video.find({
        owner: channelId
    })
    .sort({
        createdAt: -1
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videos,
                "Videos fetched successfully"
            )
        );
});

export {
    getChannelStats,
    getChannelVideos
};