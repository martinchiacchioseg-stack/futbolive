import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showByline?: boolean;
}

export function Logo({ className, size = "md", showByline = true }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-5xl",
  };

  return (
    <div className={cn("inline-flex flex-col select-none", className)}>
      <div className={cn("font-bold tracking-tight font-display flex items-baseline leading-none", sizeClasses[size])}>
        <span className="text-[#F8FAFC]">Futbo</span>
        <span className="text-[#1FE07A] transition-all drop-shadow-[0_0_12px_rgba(31,224,122,0.45)]">
          L
        </span>
        <span className="text-[#F8FAFC]">ive</span>
      </div>
      {showByline && (
        <span className="text-[10px] tracking-wider font-sans font-medium text-[#64748B] self-end -mt-0.5 mr-0.5">
          by Rolφ
        </span>
      )}
    </div>
  );
}

export function AppIcon({ className, pulsing = false }: { className?: string; pulsing?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-2xl bg-[#11171F] border border-[rgba(255,255,255,0.08)] shadow-lg overflow-hidden",
        pulsing && "after:absolute after:inset-0 after:rounded-2xl after:border after:border-[#1FE07A] after:animate-ping after:opacity-20",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1FE07A]/10 to-transparent" />
      <span className="font-display font-black text-[#1FE07A] text-2xl drop-shadow-[0_0_14px_rgba(31,224,122,0.6)]">
        L
      </span>
    </div>
  );
}
