import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "gradient" | "elevated";
  hover?: boolean;
}

export function Card({ className, variant = "default", hover, children, ...props }: CardProps) {
  const variants = {
    default: "bg-card border border-border",
    glass: "glass",
    gradient: "bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-primary/20",
    elevated: "bg-card shadow-xl shadow-black/5 border border-border/50",
  };
  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-300",
        variants[variant],
        hover && "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-3", className)} {...props} />;
}
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-xl font-bold", className)} {...props} />;
}
export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-muted-foreground text-sm", className)} {...props} />;
}
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-3", className)} {...props} />;
}
export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0 flex items-center gap-3", className)} {...props} />;
}
