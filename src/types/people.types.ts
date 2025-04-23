export interface People {
    _id: string;
    userId: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    studyGoals?: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface CreatePeopleRequest {
    userId: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    studyGoals?: string[];
  }
  
  export interface UpdatePeopleRequest {
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    studyGoals?: string[];
  }
  
  export interface StudyGoal {
    _id: string;
    name: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }