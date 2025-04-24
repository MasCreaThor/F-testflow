import React from 'react';
import Image from 'next/image';
import { People } from '@/types/people.types';

interface UserAvatarProps {
  profile: People | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * User avatar component that displays profile image or initials
 */
const UserAvatar: React.FC<UserAvatarProps> = ({ 
  profile, 
  size = 'md',
  className = ''
}) => {
  // Size mappings
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-lg',
  };
  
  // Get user's initials from name
  const getInitials = () => {
    if (!profile) return '?';
    
    const firstInitial = profile.firstName ? profile.firstName.charAt(0) : '';
    const lastInitial = profile.lastName ? profile.lastName.charAt(0) : '';
    
    return (firstInitial + lastInitial).toUpperCase();
  };
  
  // If user has a profile image
  if (profile?.profileImage) {
    return (
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
        {/* Using standard img tag to avoid Next.js Image domain restrictions */}
        <img 
          src={profile.profileImage}
          alt={`${profile.firstName} ${profile.lastName}`}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }
  
  // Default to initials avatar
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-medium ${className}`}>
      {getInitials()}
    </div>
  );
};

export default UserAvatar;