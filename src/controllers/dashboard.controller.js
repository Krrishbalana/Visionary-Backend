import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandlers } from "../utils/asyncHandlers.js";

const getChannelStats = asyncHandlers(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const userId = req.user._id;
  console.log(userId);

  // total video uploaded by the channel
  const totalVideos = await Video.countDocuments({ owner: userId });

  //total views on all videos uploaded by the channel
  const totalViewsAggregate = await Video.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, totalViews: { $sum: "$views" } } },
  ]);

  // total likes on all videos uploaded by the channel
  const totalLikesAggregate = await Like.aggregate([
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    { $unwind: "$videoDetails" },
    {
      $match: { "videoDetails.owner": new mongoose.Types.ObjectId(userId) },
    },
    { $count: "totalLikes" },
  ]);

  // total subscribers of the channel
  const totalSubscribers = await Subscription.countDocuments({
    channel: userId,
  });

  return res.status(200).json(
    new ApiResponse(true, "Channel stats fetched successfully", {
      totalVideos,
      totalViews:
        totalViewsAggregate.length > 0 ? totalViewsAggregate[0].totalViews : 0,
      totalLikes:
        totalLikesAggregate.length > 0 ? totalLikesAggregate[0].totalLikes : 0,
      totalSubscribers,
    }),
  );
});

const getChannelVideos = asyncHandlers(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const userId = req.user._id;
  const videos = await Video.find({ owner: userId }).sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(true, "Channel videos fetched successfully", videos));
});

export { getChannelStats, getChannelVideos };
