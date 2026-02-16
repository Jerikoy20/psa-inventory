import { base44 } from "@/api/base44Client";

export const BorrowRequest = {
    getAll: async (params = {}) => {
        const response = await base44.get("/entities/BorrowRequest", { params });
        return response.data;
    },
    get: async (id) => {
        const response = await base44.get(`/entities/BorrowRequest/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await base44.post("/entities/BorrowRequest", data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await base44.patch(`/entities/BorrowRequest/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await base44.delete(`/entities/BorrowRequest/${id}`);
        return response.data;
    }
};
