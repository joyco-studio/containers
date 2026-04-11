import { Container } from "@/app/container";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="border-b border-dashed border-zinc-300 py-16 dark:border-zinc-800">
      <Container>
        <h1 className="max-w-2xl text-d-4xl font-semibold tracking-tight sm:text-d-5xl">
          Every container variant.
        </h1>
        <p className="mt-4 max-w-xl text-d-lg text-zinc-600 dark:text-zinc-400">
          Pick a container above to see how a typical page layout behaves under
          each option.
        </p>
        <div className="mt-6 flex gap-3">
          <Button size="lg">Get started</Button>
          <Button size="lg" variant="outline">
            Learn more
          </Button>
        </div>
      </Container>
    </section>
  );
}
