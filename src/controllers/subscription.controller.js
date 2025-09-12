import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandlers } from "../utils/asyncHandlers.js";

const toggleSubscription = asyncHandlers(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }
  if (req.user._id.toString() === channelId) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }
  Subscription.findOne(
    { subscriber: req.user._id, channel: channelId },
    async (err, subscription) => {
      if (err) {
        throw new ApiError(500, "Internal server error");
      }
      if (subscription) {
        // If subscription exists, unsubscribe (delete the subscription)
        await Subscription.deleteOne({ _id: subscription._id });
        res
          .status(200)
          .json(new ApiResponse(200, "Unsubscribed successfully", null));
      } else {
        // If subscription does not exist, subscribe (create a new subscription)
        const newSubscription = new Subscription({
          subscriber: req.user._id,
          channel: channelId,
        });
        await newSubscription.save();
        res
          .status(200)
          .json(
            new ApiResponse(200, "Subscribed successfully", newSubscription),
          );
      }
    },
  );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandlers(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subscribers = await Subscription.find({ channel: channelId }).populate(
    "subscriber",
    "username fullName avatar",
  ); // first get all subscriptions for the channel and populate subscriber details

  const subscriberDetails = subscribers.map((sub) => sub.subscriber); // extract subscriber details from each subscription

  res
    .status(200)
    .json(
      new ApiResponse(200, "Channel subscribers fetched", subscriberDetails),
    ); // return list of user objects as subscribersn inthe form of { _id, username, fullName, avatar }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandlers(async (req, res) => {
  const { subscriberId } = req.params;
  if (subscriberId !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to view this user's subscriptions",
    );
  }
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid user ID");
  }
  const subscriptions = await Subscription.find({
    subscriber: subscriberId,
  }).populate("channel", "username fullName avatar");

  // Extract channel details from subscriptions here sub = { subscriber: ..., channel: {...} } ans sub.channel = { _id, username, fullName, avatar }
  const channels = subscriptions.map((sub) => sub.channel);
  res
    .status(200)
    .json(new ApiResponse(200, "Subscribed channels fetched", channels));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
