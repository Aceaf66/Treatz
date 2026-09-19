import React from 'react';
import { LucideIcon, PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  id?: string;
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  id = 'empty-state',
  icon: Icon = PackageOpen,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction
}) => {
  return (
    <div id={id} className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-white/70 border border-purple-100 shadow-xs max-w-lg mx-auto my-6">
      <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-[#4A154B] mb-4 shadow-inner">
        <Icon className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
      <p className="text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">{description}</p>
      
      {(actionText || secondaryActionText) && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {actionText && onAction && (
            <button
              id={`${id}-action-btn`}
              onClick={onAction}
              className="px-5 py-2.5 rounded-xl bg-[#4A154B] text-white text-sm font-semibold hover:bg-[#3B1443] transition-all shadow-sm hover:shadow active:scale-[0.98]"
            >
              {actionText}
            </button>
          )}
          {secondaryActionText && onSecondaryAction && (
            <button
              id={`${id}-secondary-btn`}
              onClick={onSecondaryAction}
              className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-all"
            >
              {secondaryActionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
