import apiClient from "@/lib/axios";
import { API_CONFIG } from "@/config/api";

export const aiService = {
  async askConcierge(message, conversationId = null) {
    if (API_CONFIG.useMockData) {
      return {
        data: {
          reply:
            "This is a placeholder concierge response — the real answer will come from the RAG-backed FastAPI endpoint once it's live.",
          conversationId: conversationId || `mock-convo-${Date.now()}`,
        },
      };
    }
    return apiClient.post("/ai/concierge", { message, conversationId });
  },

  async recommend(preferences) {
    if (API_CONFIG.useMockData) {
      return { data: [] };
    }
    return apiClient.post("/ai/recommend", preferences);
  },
};
