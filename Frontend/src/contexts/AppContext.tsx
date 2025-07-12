import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppContextType, User, SwapRequest, Feedback } from '../types';
import { mockUsers, mockSwapRequests, mockFeedback } from '../data/mockData';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>(mockSwapRequests);
  const [feedback, setFeedback] = useState<Feedback[]>(mockFeedback);

  const createSwapRequest = (request: Omit<SwapRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRequest: SwapRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSwapRequests(prev => [...prev, newRequest]);
  };

  const updateSwapRequest = (id: string, status: SwapRequest['status']) => {
    setSwapRequests(prev => 
      prev.map(request => 
        request.id === id 
          ? { ...request, status, updatedAt: new Date().toISOString() }
          : request
      )
    );
  };

  const addFeedback = (feedbackData: Omit<Feedback, 'id' | 'createdAt'>) => {
    const newFeedback: Feedback = {
      ...feedbackData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setFeedback(prev => [...prev, newFeedback]);

    // Update user rating
    const targetUser = users.find(u => u.id === feedbackData.toUserId);
    if (targetUser) {
      const userFeedbacks = [...feedback, newFeedback].filter(f => f.toUserId === feedbackData.toUserId);
      const avgRating = userFeedbacks.reduce((sum, f) => sum + f.rating, 0) / userFeedbacks.length;
      
      setUsers(prev => 
        prev.map(user => 
          user.id === feedbackData.toUserId 
            ? { ...user, rating: Math.round(avgRating * 10) / 10, reviewCount: userFeedbacks.length }
            : user
        )
      );
    }
  };

  const banUser = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, isBanned: true } : user
      )
    );
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    setSwapRequests(prev => prev.filter(req => req.fromUserId !== userId && req.toUserId !== userId));
    setFeedback(prev => prev.filter(f => f.fromUserId !== userId && f.toUserId !== userId));
  };

  return (
    <AppContext.Provider value={{
      users,
      swapRequests,
      feedback,
      createSwapRequest,
      updateSwapRequest,
      addFeedback,
      banUser,
      deleteUser,
    }}>
      {children}
    </AppContext.Provider>
  );
};