import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function CountUp({
  value,
  duration = 1.5,
  formatter = (v: number) => v.toString(),
  className
}: {
  value: number;
  duration?: number;
  formatter?: (v: number) => string;
  className?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    let animationFrame: number;
    const startTime = performance.now();

    const update = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutExpo
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      setCount(value * easeProgress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(update);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span className={cn("num", className)}>{formatter(count)}</span>;
}

export function InfoTooltip({ content, label, children }: { content: string, label?: string, children?: React.ReactNode }) {
  return (
    <div className="group relative inline-flex items-center cursor-help">
      {children || <span className="underline decoration-muted-foreground/50 decoration-dashed underline-offset-4">{label}</span>}
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-2 w-64 opacity-0 transition-opacity group-hover:opacity-100 z-50">
        <div className="bg-popover text-popover-foreground text-xs p-3 rounded-md border shadow-md font-sans font-normal text-left">
          <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground mb-1">Signal Source</div>
          {content}
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover-border border-t-[5px]"></div>
      </div>
    </div>
  );
}
