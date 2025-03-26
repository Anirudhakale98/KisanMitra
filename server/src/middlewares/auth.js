import { ClerkExpressWithAuth, users } from "@clerk/clerk-sdk-node";

// Middleware for authentication
export const requireAuth = ClerkExpressWithAuth();

// Middleware for role-based authorization
export const requireRole = (role) => {
    return async (req, res, next) => {
        const { auth } = req;
        if (!auth || !auth.sessionId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            const user = await users.getUser(auth.userId);
            const userRole = user.publicMetadata?.role || "user"; // Default to "user"

            if (userRole !== role) {
                return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
            }

            next();
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch user role" });
        }
    };
};
