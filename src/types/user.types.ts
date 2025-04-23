export interface User {
    _id: string;
    email: string;
    lastLogin?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface UpdateUserRequest {
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
  }