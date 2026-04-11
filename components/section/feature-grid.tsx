import { Container } from "@/app/container";

const FEATURES = [
  {
    title: "Predictable performance everywhere",
    description:
      "Consistent load times across regions, devices, and network conditions, with sensible defaults out of the box.",
  },
  {
    title: "First-class developer ergonomics",
    description:
      "An API designed for the day-to-day, with clear errors and escape hatches when you need them.",
  },
  {
    title: "Composable, reusable primitives",
    description:
      "Small building blocks that combine cleanly, so features grow without turning into a tangle.",
  },
  {
    title: "Built-in observability and tracing",
    description:
      "Spot regressions before users do, with metrics and traces wired in from the first deploy.",
  },
  {
    title: "Secure defaults you can trust",
    description:
      "Hardened configs and safe primitives so the easy path is also the secure one.",
  },
  {
    title: "Seamless integration with your stack",
    description:
      "Drops into existing systems without forcing a rewrite or a migration sprint.",
  },
];

export function FeatureGrid() {
  return (
    <section className="border-b border-dashed border-zinc-300 py-16 dark:border-zinc-800">
      <Container>
        <div className="grid grid-gap grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800"
            >
              <div className="mb-3 h-8 w-8 rounded bg-muted border" />
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-1 text-d-sm text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
