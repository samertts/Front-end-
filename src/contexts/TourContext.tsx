import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GuidedTour, TourStep } from '../components/ui/GuidedTour';

interface TourContextType {
  startTour: (steps: TourStep[]) => void;
  isTourOpen: boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: ReactNode }) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentSteps, setCurrentSteps] = useState<TourStep[]>([]);

  const startTour = (steps: TourStep[]) => {
    setCurrentSteps(steps);
    setIsTourOpen(true);
  };

  return (
    <TourContext.Provider value={{ startTour, isTourOpen }}>
      {children}
      <GuidedTour 
        isOpen={isTourOpen} 
        steps={currentSteps} 
        onComplete={() => setIsTourOpen(false)} 
      />
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}
