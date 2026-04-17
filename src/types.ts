export type BudgetLevel = 'Low' | 'Medium' | 'High';

export interface TravelPreferences {
  days: number;
  budget: BudgetLevel;
  interests: string[];
  preferredDestinations?: string;
}

export interface Destination {
  name: string;
  description: string;
  category: string;
  budgetLevel: string;
  imageUrl?: string;
}

export interface DayPlan {
  day: number;
  location: string;
  activities: string[];
  estimatedCost: string;
  imageUrl?: string;
}

export interface BudgetSummary {
  total: string;
  transport: string;
  accommodation: string;
  food: string;
}

export interface TravelPlanResponse {
  destinations: Destination[];
  itinerary: DayPlan[];
  budgetSummary: BudgetSummary;
  travelTips: string[];
}
