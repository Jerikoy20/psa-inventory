import { base44 } from "./base44Client";

export const appLogs = {
    logUserInApp: async (pageName) => {
        try {
            // Attempt to log to backend, but don't fail if endpoint doesn't exist
            await base44.post("/app-logs/visit", { page: pageName });
        } catch (error) {
            // Silently fail as logging is non-critical
            console.warn("Failed to log page visit", error);
        }
    }
};
