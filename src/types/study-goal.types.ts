// src/types/study-goal.types.ts
export interface StudyGoal {
    _id: string;
    name: string;
    description?: string;
    categoryId?: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    category?: {
      _id: string;
      name: string;
    };
  }
  
  export interface CreateStudyGoalRequest {
    name: string;
    description?: string;
    categoryId?: string;
  }
  
  export interface UpdateStudyGoalRequest {
    name?: string;
    description?: string;
    categoryId?: string;
    isActive?: boolean;
  }