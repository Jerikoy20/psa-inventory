import { base44 } from "./base44Client";

export const users = {
    inviteUser: async (email, role) => {
        try {
            const response = await base44.post("/users/invite", { email, role });
            return response.data;
        } catch (error) {
            console.error("Failed to invite user:", error);
            throw error;
        }
    }
};
