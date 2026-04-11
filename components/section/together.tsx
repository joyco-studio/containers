import { Container } from "@/app/container";

type TogetherItem = {
  title: string;
  description: string;
  linkLabel: string;
  linkHref: string;
};

const ITEMS: TogetherItem[] = [
  {
    title: "Share primitives across every service.",
    description:
      "Publish packages, configs, and deploy targets to a shared registry so every team builds on the same foundation instead of reinventing it.",
    linkLabel: "Explore shared packages",
    linkHref: "#",
  },
  {
    title: "Spin up new projects in seconds.",
    description:
      "Start from battle-tested starters that wire up CI, observability, and staging environments out of the box — so new teams ship on day one.",
    linkLabel: "Browse starters",
    linkHref: "#",
  },
];

export function Together() {
  return (
    <section className="border-b border-dashed border-zinc-300 py-16 dark:border-zinc-800">
      <Container>
        <h2 className="max-w-2xl text-d-3xl font-semibold tracking-tight sm:text-d-4xl">
          One platform, every team, zero drift
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
          {ITEMS.map((item) => (
            <TogetherCard key={item.title} {...item} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function TogetherCard({
  title,
  description,
  linkLabel,
  linkHref,
}: TogetherItem) {
  return (
    <div className="flex flex-col">
      <div className="aspect-[16/10] w-full rounded-xl border border-border bg-muted" />
      <div className="mt-6">
        <p className="text-d-base leading-relaxed text-zinc-900 dark:text-zinc-100">
          <span className="font-semibold">{title}</span>{" "}
          <span className="text-zinc-600 dark:text-zinc-400">
            {description}
          </span>
        </p>
        <a
          href={linkHref}
          className="mt-6 inline-flex items-center gap-1 text-d-sm font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
        >
          {linkLabel}
        </a>
      </div>
    </div>
  );
}
