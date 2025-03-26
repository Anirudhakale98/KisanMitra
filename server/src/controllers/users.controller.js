import User from "../models/users.models.js";
import { users } from "@clerk/clerk-sdk-node";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createUser = asyncHandler(async (req, res, next) => {
    const { auth } = req;
    if (!auth || !auth.userId) {
        return next(new ApiError(401, "Unauthorized"));
    }

    // Fetch user details from Clerk
    const clerkUser = await users.getUser(auth.userId);

    // Check if user already exists
    let user = await User.findOne({ clerkId: clerkUser.id });
    if (user) {
        return res.status(200).json(new ApiResponse(200, user, "User already exists"));
    }

    // Create a new user in MongoDB
    user = new User({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName} ${clerkUser.lastName || ""}`,
        role: clerkUser.publicMetadata?.role || "user",
    });

    await user.save();
    res.status(201).json(new ApiResponse(201, user, "User created successfully"));
});

export const getUserProfile = asyncHandler(async (req, res, next) => {
    const { auth } = req;
    if (!auth || !auth.userId) {
        return next(new ApiError(401, "Unauthorized"));
    }

    const user = await User.findOne({ clerkId: auth.userId });
    if (!user) {
        return next(new ApiError(404, "User not found"));
    }

    res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
});
