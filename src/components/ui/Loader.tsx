"use client"
import { cn } from "@/utils/cn"
import React from "react"

export interface LoaderProps {
  variant?: "circular"|"classic"|"pulse"|"pulse-dot"|"dots"|"typing"|"wave"|"bars"|"terminal"|"text-blink"|"text-shimmer"|"loading-dots"
  size?: "sm"|"md"|"lg"
  text?: string
  className?: string
}

export function CircularLoader({ className, size = "md" }: { className?: string; size?: "sm"|"md"|"lg" }) {
  const sizeClasses = { sm: "size-4", md: "size-5", lg: "size-6" };
  return <div className={cn("border-[var(--accent)] animate-spin rounded-full border-2 border-t-transparent", sizeClasses[size], className)}><span className="sr-only">Loading</span></div>;
}

export function DotsLoader({ className, size = "md" }: { className?: string; size?: "sm"|"md"|"lg" }) {
  const dotSizes = { sm: "h-1.5 w-1.5", md: "h-2 w-2", lg: "h-2.5 w-2.5" };
  const containerSizes = { sm: "h-4", md: "h-5", lg: "h-6" };
  return (
    <div className={cn("flex items-center space-x-1", containerSizes[size], className)}>
      {[...Array(3)].map((_, i) => <div key={i} className={cn("bg-[var(--accent)] animate-[bounce-dots_1.4s_ease-in-out_infinite] rounded-full", dotSizes[size])} style={{ animationDelay: `${i * 160}ms` }} />)}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function TypingLoader({ className, size = "md" }: { className?: string; size?: "sm"|"md"|"lg" }) {
  const dotSizes = { sm: "h-1 w-1", md: "h-1.5 w-1.5", lg: "h-2 w-2" };
  const containerSizes = { sm: "h-4", md: "h-5", lg: "h-6" };
  return (
    <div className={cn("flex items-center space-x-1", containerSizes[size], className)}>
      {[...Array(3)].map((_, i) => <div key={i} className={cn("bg-[var(--text-secondary)] animate-[typing_1s_infinite] rounded-full", dotSizes[size])} style={{ animationDelay: `${i * 250}ms` }} />)}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function WaveLoader({ className, size = "md" }: { className?: string; size?: "sm"|"md"|"lg" }) {
  const barWidths = { sm: "w-0.5", md: "w-0.5", lg: "w-1" };
  const containerSizes = { sm: "h-4", md: "h-5", lg: "h-6" };
  const heights = { sm: ["6px","9px","12px","9px","6px"], md: ["8px","12px","16px","12px","8px"], lg: ["10px","15px","20px","15px","10px"] };
  return (
    <div className={cn("flex items-center gap-0.5", containerSizes[size], className)}>
      {[...Array(5)].map((_, i) => <div key={i} className={cn("bg-[var(--accent)] animate-[wave_1s_ease-in-out_infinite] rounded-full", barWidths[size])} style={{ animationDelay: `${i * 100}ms`, height: heights[size][i] }} />)}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function TextShimmerLoader({ text = "Geode is thinking", className, size = "md" }: { text?: string; className?: string; size?: "sm"|"md"|"lg" }) {
  const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };
  return (
    <div className={cn("bg-[linear-gradient(to_right,var(--text-secondary)_40%,var(--text-primary)_60%,var(--text-secondary)_80%)] bg-[length:200%_auto] bg-clip-text font-medium text-transparent animate-[shimmer_4s_infinite_linear]", textSizes[size], className)}>{text}</div>
  );
}

export function TextDotsLoader({ className, text = "Thinking", size = "md" }: { className?: string; text?: string; size?: "sm"|"md"|"lg" }) {
  const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };
  return (
    <div className={cn("inline-flex items-center", className)}>
      <span className={cn("text-[var(--text-secondary)] font-medium", textSizes[size])}>{text}</span>
      <span className="inline-flex">
        <span className="text-[var(--accent)] animate-[loading-dots_1.4s_infinite_0.2s]">.</span>
        <span className="text-[var(--accent)] animate-[loading-dots_1.4s_infinite_0.4s]">.</span>
        <span className="text-[var(--accent)] animate-[loading-dots_1.4s_infinite_0.6s]">.</span>
      </span>
    </div>
  );
}

export function TerminalLoader({ className, size = "md" }: { className?: string; size?: "sm"|"md"|"lg" }) {
  const cursorSizes = { sm: "h-3 w-1.5", md: "h-4 w-2", lg: "h-5 w-2.5" };
  const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };
  const containerSizes = { sm: "h-4", md: "h-5", lg: "h-6" };
  return (
    <div className={cn("flex items-center space-x-1", containerSizes[size], className)}>
      <span className={cn("text-[var(--accent)] font-mono", textSizes[size])}>{">"}</span>
      <div className={cn("bg-[var(--accent)] animate-[blink_1s_step-end_infinite]", cursorSizes[size])} />
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function Loader({ variant = "circular", size = "md", text, className }: LoaderProps) {
  switch (variant) {
    case "dots": return <DotsLoader size={size} className={className} />;
    case "typing": return <TypingLoader size={size} className={className} />;
    case "wave": return <WaveLoader size={size} className={className} />;
    case "terminal": return <TerminalLoader size={size} className={className} />;
    case "text-shimmer": return <TextShimmerLoader text={text} size={size} className={className} />;
    case "loading-dots": return <TextDotsLoader text={text} size={size} className={className} />;
    default: return <CircularLoader size={size} className={className} />;
  }
}
