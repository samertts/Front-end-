import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, X, Sparkles, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';

export interface TourStep {
  target: string; // CSS selector
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface GuidedTourProps {
  steps: TourStep[];
  onComplete: () => void;
  isOpen: boolean;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ steps, onComplete, isOpen }) => {
  const { t, isRtl } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (isOpen) {
      const target = document.querySelector(steps[currentStep].target);
      if (target) {
        setTargetRect(target.getBoundingClientRect());
        // Scroll into view
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isOpen, currentStep, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!isOpen || !targetRect) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      {/* Spotlight Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] transition-all"
        style={{
          clipPath: `polygon(
            0% 0%, 
            0% 100%, 
            ${targetRect.left - 12}px 100%, 
            ${targetRect.left - 12}px ${targetRect.top - 12}px, 
            ${targetRect.right + 12}px ${targetRect.top - 12}px, 
            ${targetRect.right + 12}px ${targetRect.bottom + 12}px, 
            ${targetRect.left - 12}px ${targetRect.bottom + 12}px, 
            ${targetRect.left - 12}px 100%, 
            100% 100%, 
            100% 0%
          )`
        }}
      />

      {/* Content Card */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="absolute pointer-events-auto bg-white rounded-[2rem] p-8 shadow-2xl w-[320px] border border-slate-100"
        style={{
          left: isRtl ? 'auto' : targetRect.left,
          right: isRtl ? (window.innerWidth - targetRect.right) : 'auto',
          top: targetRect.bottom + 24,
          transform: isRtl ? 'translateX(50%)' : 'translateX(-50%)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Sparkles size={16} />
          </div>
          <button onClick={onComplete} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">
          {step.title}
        </h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
          {step.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  i === currentStep ? "w-4 bg-indigo-600" : "bg-slate-200"
                )} 
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button 
                onClick={handlePrev}
                className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
            )}
            <button 
              onClick={handleNext}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Finish' : (
                <>Next <ChevronRight size={14} /></>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
