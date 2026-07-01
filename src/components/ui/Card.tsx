import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        "relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-sm",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
