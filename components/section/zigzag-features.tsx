import { Container } from "@/app/container";
import { Button } from "@/components/ui/button";

type ZigzagItem = {
  title: string;
  description: string;
  direction: "ltr" | "rtl";
};

const ITEMS: ZigzagItem[] = [
  {
    direction: "ltr",
    title: "Ship faster with less complexity",
    description:
      "A single workflow for building, testing, and deploying — so your team spends less time on tooling and more time on what matters.",
  },
  {
    direction: "rtl",
    title: "Observe everything in real time",
    description:
      "Built-in tracing, metrics, and logs give you full visibility from the first deploy — no extra SDKs, no config files.",
  },
  {
    direction: "ltr",
    title: "Scale without rewrites",
    description:
      "The same primitives that power a weekend prototype hold up under production traffic, real teams, and tight deadlines.",
  },
];

export function ZigzagFeatures() {
  return (
    <>
      {ITEMS.map((item) => (
        <ZigzagRow key={item.title} {...item} />
      ))}
    </>
  );
}

function ZigzagRow({ direction, title, description }: ZigzagItem) {
  return (
    <section className="border-b border-dashed border-zinc-300 py-16 dark:border-zinc-800">
      <Container>
        <div
          className={`flex flex-col items-center gap-10 lg:flex-row lg:gap-16 ${
            direction === "rtl" ? "lg:flex-row-reverse" : ""
          }`}
        >
          <ZigzagContent title={title} description={description} />
          <div className="aspect-square lg:aspect-[7/8] w-full rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 lg:w-1/2 lg:shrink-0" />
        </div>
      </Container>
    </section>
  );
}

function ZigzagContent({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="w-full lg:w-1/2">
      <h2 className="text-d-3xl font-semibold tracking-tight sm:text-d-4xl">
        {title}
      </h2>
      <p className="mt-4 text-d-lg text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
      <div className="mt-6 flex gap-3">
        <Button size="lg">Get started</Button>
        <Button size="lg" variant="outline">
          Learn more
        </Button>
      </div>
    </div>
  );
}
