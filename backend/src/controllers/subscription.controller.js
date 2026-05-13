import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user?._id;

    if (!channelId || !isValidObjectId(channelId)) {
        throw new ApiError(400, "Valid channel ID is required");
    }

    if (channelId.toString() === userId.toString()) {
        throw new ApiError(400, "Cannot subscribe to your own channel");
    }

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    });

    if (existingSubscription) {
        await Subscription.deleteOne({
            subscriber: userId,
            channel: channelId
        });

        return res.status(200).json(
            new ApiResponse(200, { subscribed: false }, "Unsubscribed")
        );
    }

    await Subscription.create({
        subscriber: userId,
        channel: channelId
    });

    return res.status(200).json(
        new ApiResponse(200, { subscribed: true }, "Subscribed")
    );
});


const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId || !isValidObjectId(channelId)) {
        throw new ApiError(400, "Valid channel ID is required");
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "fullName userName avatar");

    return res.status(200).json(
        new ApiResponse(
            200,
            subscribers,
            subscribers.length ? "Subscribers fetched" : "0 subscribers"
        )
    );
});


const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!subscriberId || !isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Valid subscriber ID is required");
    }

    const channels = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "fullName userName avatar");

    return res.status(200).json(
        new ApiResponse(
            200,
            channels,
            channels.length ? "Subscribed channels fetched" : "0 subscriptions"
        )
    );
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
};
