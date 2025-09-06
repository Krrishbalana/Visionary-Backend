import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const content = req.body.content;
  if (!content) {
    throw new ApiError(400, "Content is required");
  }
  const owner = req.user?.id;

  const tweet = await Tweet.create({ content, owner });
  return res
    .status(201)
    .json(new ApiResponse(201, "Tweet created successfully", tweet));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const userId = req.params.userId;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 }); // Sort by newest first
  if (tweets.length === 0) {
    return res
      .status(204)
      .json(new ApiResponse(204, "No tweets found for this user", []));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "User tweets fetched successfully", tweets));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const tweetId = req.params.tweetId;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }
  const content = req.body.content;
  if (!content) {
    throw new ApiError(400, "Content is required");
  }
  await Tweet.findByIdAndUpdate(tweetId, { content }, { new: true });
  return res
    .status(200)
    .json(new ApiResponse(200, "Tweet updated successfully", null));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const tweetId = req.params.tweetId;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }
  await Tweet.findByIdAndDelete(tweetId);
  return res
    .status(200)
    .json(new ApiResponse(200, "Tweet deleted successfully", null));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
