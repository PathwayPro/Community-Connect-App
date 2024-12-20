import { type ReactNode } from 'react';

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export function Display({
  size = 'lg',
  children,
  className
}: TypographyProps & { size?: 'lg' | 'sm' }) {
  return (
    <h1
      className={`font-bold tracking-tight ${size === 'lg' ? 'text-display-lg' : 'text-display-sm'} ${className ?? ''}`}
    >
      {children}
    </h1>
  );
}

export function HeadingH1({ children, className }: TypographyProps) {
  return (
    <h1
      className={`scroll-m-20 text-heading-h1 font-bold tracking-tight ${className ?? ''}`}
    >
      {children}
    </h1>
  );
}

export function HeadingH2({ children, className }: TypographyProps) {
  return (
    <h2
      className={`scroll-m-20 text-heading-h2 font-bold tracking-tight ${className ?? ''}`}
    >
      {children}
    </h2>
  );
}

export function HeadingH3({ children, className }: TypographyProps) {
  return (
    <h3
      className={`scroll-m-20 text-heading-h3 font-bold tracking-tight ${className ?? ''}`}
    >
      {children}
    </h3>
  );
}

export function HeadingH4({ children, className }: TypographyProps) {
  return (
    <h4
      className={`scroll-m-20 text-heading-h4 font-bold tracking-tight ${className ?? ''}`}
    >
      {children}
    </h4>
  );
}

export function HeadingH5({ children, className }: TypographyProps) {
  return (
    <h5
      className={`scroll-m-20 text-heading-h5 font-bold tracking-tight ${className ?? ''}`}
    >
      {children}
    </h5>
  );
}

export function HeadingH6({ children, className }: TypographyProps) {
  return (
    <h6
      className={`scroll-m-20 text-heading-h6 font-bold tracking-tight ${className ?? ''}`}
    >
      {children}
    </h6>
  );
}

export function Paragraph({
  size = 'base',
  children,
  className
}: TypographyProps & {
  size?: 'lg' | 'base' | 'sm' | 'xs' | '2xs';
}) {
  return (
    <p className={`text-paragraph-${size} ${className ?? ''}`}>{children}</p>
  );
}

export function Lead({ children, className }: TypographyProps) {
  return (
    <p className={`text-paragraph-lg text-muted-foreground ${className ?? ''}`}>
      {children}
    </p>
  );
}

export function Large({ children, className }: TypographyProps) {
  return (
    <div className={`text-paragraph-lg font-semibold ${className ?? ''}`}>
      {children}
    </div>
  );
}

export function Small({ children, className }: TypographyProps) {
  return (
    <small
      className={`text-paragraph-sm font-medium leading-none ${className ?? ''}`}
    >
      {children}
    </small>
  );
}

export function Muted({ children, className }: TypographyProps) {
  return (
    <p className={`text-paragraph-sm text-muted-foreground ${className ?? ''}`}>
      {children}
    </p>
  );
}
