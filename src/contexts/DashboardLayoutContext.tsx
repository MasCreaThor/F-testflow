'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface DashboardLayoutContextProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const DashboardLayoutContext = createContext<DashboardLayoutContextProps>({
  isSidebarCollapsed: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
});

interface DashboardLayoutProviderProps {
  children: ReactNode;
}

/**
 * Provider component for dashboard layout context
 */
export const DashboardLayoutProvider: React.FC<DashboardLayoutProviderProps> = ({ children }) => {
  // State for sidebar collapse
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Check local storage for saved state on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === 'true');
    }
  }, []);

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  // Close sidebar (for mobile)
  const closeSidebar = () => {
    setIsSidebarCollapsed(true);
    localStorage.setItem('sidebarCollapsed', 'true');
  };

  return (
    <DashboardLayoutContext.Provider
      value={{
        isSidebarCollapsed,
        toggleSidebar,
        closeSidebar,
      }}
    >
      {children}
    </DashboardLayoutContext.Provider>
  );
};

/**
 * Hook to use dashboard layout context
 */
export const useDashboardLayout = () => useContext(DashboardLayoutContext);