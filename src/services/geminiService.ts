import { GoogleGenAI, Type } from "@google/genai";
import { TravelPreferences, TravelPlanResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateTravelPlan(preferences: TravelPreferences): Promise<TravelPlanResponse> {
  const prompt = `
    You are an expert Sri Lanka travel assistant.
    Generate a detailed travel plan based on these user preferences:
    - Travel Days: ${preferences.days}
    - Budget: ${preferences.budget}
    - Interests: ${preferences.interests.join(', ')}
    - Preferred Destinations: ${preferences.preferredDestinations || 'None specified'}

    Task 1: Recommend top 5 destinations matching interests.
    Task 2: Generate a realistic day-by-day itinerary (don't exceed travel capabilities per day). Include a contextually relevant Unsplash source URL (e.g., https://picsum.photos/seed/[keyword]/800/400) for each destination and each day's main location in an 'imageUrl' field.
    Task 3: Provide a budget summary for the entire trip.
    Task 4: Provide essential Sri Lanka travel tips.

    The response MUST be in JSON format matching the schema provided.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          destinations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                category: { type: Type.STRING },
                budgetLevel: { type: Type.STRING },
                imageUrl: { type: Type.STRING },
              },
              required: ["name", "description", "category", "budgetLevel", "imageUrl"],
            },
          },
          itinerary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.INTEGER },
                location: { type: Type.STRING },
                activities: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                estimatedCost: { type: Type.STRING },
                imageUrl: { type: Type.STRING },
              },
              required: ["day", "location", "activities", "estimatedCost", "imageUrl"],
            },
          },
          budgetSummary: {
            type: Type.OBJECT,
            properties: {
              total: { type: Type.STRING },
              transport: { type: Type.STRING },
              accommodation: { type: Type.STRING },
              food: { type: Type.STRING },
            },
            required: ["total", "transport", "accommodation", "food"],
          },
          travelTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["destinations", "itinerary", "budgetSummary", "travelTips"],
      },
    },
  });

  if (!response.text) {
    throw new Error("Empty response from AI");
  }

  return JSON.parse(response.text) as TravelPlanResponse;
}
