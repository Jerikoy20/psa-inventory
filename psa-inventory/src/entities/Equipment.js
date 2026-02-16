import { base44 } from "@/api/base44Client";

export const Equipment = {
    getAll: async (params = {}) => {
        const response = await base44.get("/entities/Equipment", { params });
        return response.data;
    },
    get: async (id) => {
        const response = await base44.get(`/entities/Equipment/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await base44.post("/entities/Equipment", data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await base44.patch(`/entities/Equipment/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await base44.delete(`/entities/Equipment/${id}`);
        return response.data;
    }
};
