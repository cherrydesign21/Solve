export function GlowBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[140px]" />
    </div>
  );
}
