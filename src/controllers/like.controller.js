import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandlers } from "../utils/asyncHandlers.js";

const toggleVideoLike = asyncHandlers(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  if (videoId && !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }
  const userId = req.user._id;
  const existingLike = await Like.findOne({ user: userId, video: videoId });
  if (existingLike) {
    await existingLike.remove();
    return res
      .status(200)
      .json(new ApiResponse(true, "Video unliked successfully"));
  } else {
    const newLike = new Like({ user: userId, video: videoId });
    await newLike.save();
    return res
      .status(200)
      .json(new ApiResponse(true, "Video liked successfully"));
  }
});

const toggleCommentLike = asyncHandlers(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  if (commentId && !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid commentId");
  }
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }
  const existingLike = await Like.findOne({ user: userId, comment: commentId });
  if (existingLike) {
    await existingLike.remove(); // remove like document from collection in mongodb database
    return res
      .status(200)
      .json(new ApiResponse(true, "Comment unliked successfully"));
  } else {
    const newLike = new Like({ user: userId, comment: commentId });
    await newLike.save();
    return res
      .status(200)
      .json(new ApiResponse(true, "Comment liked successfully"));
  }
});

const toggleTweetLike = asyncHandlers(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  if (tweetId && !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId");
  }
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }
  const existingLike = await Like.findOne({ user: userId, tweet: tweetId });
  if (existingLike) {
    await existingLike.remove(); // remove like document from collection in mongodb database
    return res
      .status(200)
      .json(new ApiResponse(true, "Tweet unliked successfully"));
  } else {
    const newLike = new Like({ user: userId, tweet: tweetId });
    await newLike.save();
    return res
      .status(200)
      .json(new ApiResponse(true, "Tweet liked successfully"));
  }
});

const getLikedVideos = asyncHandlers(async (req, res) => {
  //TODO: get all liked videos
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }
  const videos = await Like.find({ user: userId, video: { $ne: null } })
    .populate("video")
    .select("video -_id")
    .exec(); // only return video field and exclude _id field
  return res
    .status(200)
    .json(new ApiResponse(true, "Liked videos fetched successfully", videos));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
