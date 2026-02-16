import { base44 } from "@/api/base44Client";

export const TransactionLog = {
    getAll: async (params = {}) => {
        const response = await base44.get("/entities/TransactionLog", { params });
        return response.data;
    },
    get: async (id) => {
        const response = await base44.get(`/entities/TransactionLog/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await base44.post("/entities/TransactionLog", data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await base44.patch(`/entities/TransactionLog/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await base44.delete(`/entities/TransactionLog/${id}`);
        return response.data;
    }
};
