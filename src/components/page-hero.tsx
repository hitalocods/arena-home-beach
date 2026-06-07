import { Badge } from "@/components/ui/badge";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-shell pt-12 sm:pt-20">
      <Badge className="rounded-full border-primary/15 bg-white/70 px-3 py-2 text-[#527257] shadow-sm backdrop-blur">{eyebrow}</Badge>
      <h1 className="mt-6 max-w-3xl text-[2.65rem] font-black leading-[1.02] tracking-[-0.055em] text-foreground sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
        {description}
      </p>
    </section>
  );
}
