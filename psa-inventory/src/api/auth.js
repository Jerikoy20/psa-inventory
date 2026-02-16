import { base44 } from "./base44Client";

export const auth = {
    me: async () => {
        try {
            const response = await base44.get("/auth/me");
            return response.data;
        } catch (error) {
            console.warn("Auth check failed:", error);
            return null;
        }
    },
    logout: async (redirectUrl) => {
        try {
            await base44.post("/auth/logout");
        } catch (error) {
            console.warn("Logout failed", error);
        }
        if (redirectUrl) {
            window.location.href = "/login"; // Adjust login route as needed
        }
    },
    redirectToLogin: (redirectUrl) => {
        window.location.href = `/login?redirect=${encodeURIComponent(redirectUrl || window.location.href)}`;
    }
};
