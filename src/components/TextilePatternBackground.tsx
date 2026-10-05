interface TextilePatternBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function TextilePatternBackground({ children, className = '' }: TextilePatternBackgroundProps) {
  return <section className={`motif-bg ${className}`}>{children}</section>;
}
