import { Container } from "@/app/container";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-16">
      <Container>
        <div className="bg-background text-secondary-foreground border-border grid grid-cols-1 items-center border md:grid-cols-2">
          <div className="px-8 text-center max-md:py-14 md:text-left">
            <h2 className="text-d-2xl font-semibold">Ready to ship?</h2>
            <p className="text-muted-foreground mt-2 text-balance">
              Swap the container above and watch this block re-flow.
            </p>
            <Button className="mt-4">Get started</Button>
          </div>
          <div className="bg-muted h-100" />
        </div>
      </Container>
    </section>
  );
}
