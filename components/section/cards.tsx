import { Container } from "@/app/container";

const CARDS = [
  {
    title: "Fast by default",
    description:
      "Ship pages that load instantly with zero configuration. Every route is optimized out of the box, with smart bundling, automatic code splitting, and edge caching baked in. Spend your time building features, not chasing performance regressions across a sprawling config file.",
  },
  {
    title: "Built to scale",
    description:
      "Take your project from a weekend prototype to a production system serving millions without rewriting a line. The same primitives that make a single page feel snappy hold up under real traffic, real teams, and real deadlines — no architectural rewrites required.",
  },
  {
    title: "Designed for developers",
    description:
      "An API that gets out of your way and lets you focus on the problem in front of you. Sensible defaults, predictable behavior, and escape hatches when you need them. Read the source, trust the abstractions, and ship something you're proud of.",
  },
];

export function Cards() {
  return (
    <section className="border-b border-dashed border-zinc-300 py-16 dark:border-zinc-800">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <article
              key={card.title}
              className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800"
            >
              <div className="aspect-[16/10] w-full bg-muted" />
              <div className="p-6">
                <h3 className="text-d-2xl font-semibold tracking-tight">
                  {card.title}
                </h3>
                <p className="mt-2 text-d-sm text-zinc-600 dark:text-zinc-400">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
