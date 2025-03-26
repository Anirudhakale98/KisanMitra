import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        clerkId: { type: String, required: true, unique: true }, // Clerk User ID
        email: { type: String, required: true, unique: true },
        name: { type: String },
        role: { type: String, enum: ["admin", "farmer", "user"], default: "user" },
    },
    { timestamps: true }
);

export default mongoose.model("User", UserSchema);
