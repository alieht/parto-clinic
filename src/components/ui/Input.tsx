import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2 text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full h-12 rounded-xl border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground transition-all",
              "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
              icon && "ps-10",
              error && "border-danger focus:border-danger focus:ring-danger/20",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium mb-2">{label}</label>}
        <textarea
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground transition-all min-h-[120px] resize-y",
            "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
            error && "border-danger",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }>(
  ({ className, label, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium mb-2">{label}</label>}
        <select
          ref={ref}
          className={cn(
            "w-full h-12 rounded-xl border border-border bg-card px-4 text-foreground transition-all appearance-none",
            "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
            error && "border-danger",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
