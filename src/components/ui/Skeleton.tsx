import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'rounded';
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-slate-100",
        variant === 'circular' && "rounded-full",
        variant === 'rounded' && "rounded-2xl",
        className
      )}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-12">
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-64" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-12 w-40 rounded-2xl" />
          <Skeleton className="h-12 w-40 rounded-2xl" />
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <Skeleton className="h-[200px] rounded-[3rem]" />
          <div className="grid grid-cols-2 gap-8">
            <Skeleton className="h-[300px] rounded-[3.5rem]" />
            <Skeleton className="h-[300px] rounded-[3.5rem]" />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <Skeleton className="h-full min-h-[600px] rounded-[3.5rem]" />
        </div>
      </div>
    </div>
  );
}
