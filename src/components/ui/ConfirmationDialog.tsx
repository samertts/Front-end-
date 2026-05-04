import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, AlertCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'warning';
  icon?: React.ReactNode;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  variant = 'primary',
  icon
}) => {
  const { t } = useLanguage();

  const colors = {
    danger: "bg-red-50 text-red-600 shadow-red-100 ring-red-500/20",
    primary: "bg-indigo-50 text-indigo-600 shadow-indigo-100 ring-indigo-500/20",
    warning: "bg-amber-50 text-amber-600 shadow-amber-100 ring-amber-500/20"
  };

  const btnColors = {
    danger: "bg-red-600 shadow-red-200 hover:bg-red-700",
    primary: "bg-indigo-600 shadow-indigo-200 hover:bg-slate-900",
    warning: "bg-amber-600 shadow-amber-200 hover:bg-amber-700"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={onClose}
             className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div 
             initial={{ scale: 0.9, opacity: 0, y: 20 }}
             animate={{ scale: 1, opacity: 1, y: 0 }}
             exit={{ scale: 0.9, opacity: 0, y: 20 }}
             className="relative bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl overflow-hidden"
          >
             <button 
               onClick={onClose}
               className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 transition-colors"
             >
               <X size={20} />
             </button>

             <div className="text-center">
               <div className={cn(
                 "w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl",
                 colors[variant]
               )}>
                  {icon || <Shield size={48} />}
               </div>
               
               <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4 uppercase">
                  {title}
               </h3>
               
               <p className="text-slate-500 font-medium mb-10 text-sm leading-relaxed">
                  {description}
               </p>

               <div className="flex gap-4">
                  <button 
                     onClick={onClose}
                     className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                     {cancelText || "Cancel"}
                  </button>
                  <button 
                     onClick={() => {
                       onConfirm();
                       onClose();
                     }}
                     className={cn(
                       "flex-[1.5] py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-95",
                       btnColors[variant]
                     )}
                  >
                     {confirmText || "Confirm"}
                  </button>
               </div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
