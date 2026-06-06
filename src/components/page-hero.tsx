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
    <section className="page-shell pt-12 sm:pt-16">
      <Badge className="border-primary/20 bg-primary/10 text-primary">{eyebrow}</Badge>
      <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
        {description}
      </p>
    </section>
  );
}
