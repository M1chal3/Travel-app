export type BudgetLevel = 'free' | 'budget' | 'moderate' | 'any'

export interface UserPreferences {
  defaultBudgetEUR: number
  budgetLevel: BudgetLevel
  preferredLanguage: string
  avoidWalking: boolean
  accessibilityNeeds: boolean
}

export interface User {
  id: string
  email: string
  displayName: string
  homeCity?: string
  preferences: UserPreferences
  createdAt: string
  tripCount: number
}