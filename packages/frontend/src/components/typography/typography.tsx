import { type ReactNode } from 'react';

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export function TextH1({ children, className }: TypographyProps) {
  return (
    <h1
      className={`scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl ${
        className ?? ''
      }`}
    >
      {children}
    </h1>
  );
}

export function TextH2({ children, className }: TypographyProps) {
  return (
    <h2
      className={`scroll-m-20 text-3xl font-semibold tracking-tight ${
        className ?? ''
      }`}
    >
      {children}
    </h2>
  );
}

export function TextH3({ children, className }: TypographyProps) {
  return (
    <h3
      className={`scroll-m-20 text-2xl font-semibold tracking-tight ${
        className ?? ''
      }`}
    >
      {children}
    </h3>
  );
}

export function TextH4({ children, className }: TypographyProps) {
  return (
    <h4
      className={`scroll-m-20 text-xl font-semibold tracking-tight ${
        className ?? ''
      }`}
    >
      {children}
    </h4>
  );
}

export function TextP({ children, className }: TypographyProps) {
  return (
    <p className={`leading-7 [&:not(:first-child)]:mt-6 ${className ?? ''}`}>
      {children}
    </p>
  );
}

export function TextLead({ children, className }: TypographyProps) {
  return (
    <p className={`text-xl text-muted-foreground ${className ?? ''}`}>
      {children}
    </p>
  );
}

export function TextLarge({ children, className }: TypographyProps) {
  return (
    <div className={`text-lg font-semibold ${className ?? ''}`}>{children}</div>
  );
}

export function TextSmall({ children, className }: TypographyProps) {
  return (
    <small className={`text-sm font-medium leading-none ${className ?? ''}`}>
      {children}
    </small>
  );
}

export function TextMuted({ children, className }: TypographyProps) {
  return (
    <p className={`text-sm text-muted-foreground ${className ?? ''}`}>
      {children}
    </p>
  );
}
