import { cn } from "@/lib/utils";

export function CourtVisual({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-3xl border border-white/10 bg-[#161b16]", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(186,255,39,.18),transparent_45%)]" />
      <div className="absolute inset-x-[12%] bottom-[10%] top-[18%] border-2 border-primary/60 bg-[#947348] shadow-[0_0_40px_rgba(186,255,39,.12)] [transform:perspective(500px)_rotateX(58deg)]">
        <div className="absolute inset-y-0 left-1/2 border-l-2 border-white/70" />
        <div className="absolute inset-x-0 top-1/2 border-t-2 border-white/70" />
        <div className="absolute inset-y-[20%] left-1/2 w-[2px] bg-primary shadow-[0_0_12px_#baff27]" />
      </div>
      <div className="absolute left-[8%] top-[8%] size-32 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute bottom-5 left-5 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
        5 quadras disponíveis
      </div>
    </div>
  );
}
