import { cn } from "@/lib/utils";

export function CourtVisual({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-[2rem] border border-black/[0.07] bg-gradient-to-br from-[#edf4ec] to-[#dce8dc] shadow-[0_25px_70px_rgba(48,72,53,.12)]", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(127,174,130,.22),transparent_48%)]" />
      <div className="absolute inset-x-[12%] bottom-[10%] top-[18%] border-2 border-white/80 bg-[#c9ad80] shadow-[0_25px_60px_rgba(81,93,72,.13)] [transform:perspective(500px)_rotateX(58deg)]">
        <div className="absolute inset-y-0 left-1/2 border-l-2 border-white/70" />
        <div className="absolute inset-x-0 top-1/2 border-t-2 border-white/70" />
        <div className="absolute inset-y-[20%] left-1/2 w-[2px] bg-[#617c63]" />
      </div>
      <div className="absolute left-[8%] top-[8%] size-32 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute bottom-5 left-5 rounded-full border border-black/[0.06] bg-white/80 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
        5 quadras disponíveis
      </div>
    </div>
  );
}
