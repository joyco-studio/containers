"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TogetherCard, type TogetherItem } from "./together";
import { Container, useContainer } from "@/app/container";
import { cn } from "@/lib/utils";

const SLIDES: TogetherItem[] = [
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
  {
    title: "Catch regressions before they ship.",
    description:
      "Preview every pull request in an isolated environment with real data and real integrations, so review is never a guess about what production will do.",
    linkLabel: "See previews",
    linkHref: "#",
  },
  {
    title: "Observe what actually matters.",
    description:
      "Drop in instrumentation that already knows your stack — traces, logs, and metrics wired to the primitives you shipped, not a generic dashboard.",
    linkLabel: "Open observability",
    linkHref: "#",
  },
  {
    title: "Roll back without a war room.",
    description:
      "Every deploy is addressable and reversible. Point traffic at the previous build in one click while you investigate — no incident, no downtime.",
    linkLabel: "How rollbacks work",
    linkHref: "#",
  },
  {
    title: "Govern without slowing down.",
    description:
      "Policies as code apply the same guardrails to every team without hand-crafted reviews. Ship fast, stay compliant, audit later.",
    linkLabel: "Read policies",
    linkHref: "#",
  },
];

export function Slider() {
  const { variant } = useContainer();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  return (
    <section className="border-b border-dashed border-zinc-300 py-16 dark:border-zinc-800">
      <Container className="overflow-hidden">
        <div className="flex items-end justify-between gap-6 pb-10">
          <h2 className="max-w-2xl text-d-3xl font-semibold tracking-tight sm:text-d-4xl">
            Built together, shipped together
          </h2>
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              aria-label="Previous slide"
              onClick={scrollPrev}
              disabled={!canPrev}
            >
              <ChevronLeft />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              aria-label="Next slide"
              onClick={scrollNext}
              disabled={!canNext}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>

        <div className={cn({"overflow-hidden": variant !== "container-padded-max-w"})} ref={emblaRef}>
          <div className="flex gap-y-6 gap-x-(--grid-gap)">
            {SLIDES.map((slide) => (
              <div
                key={slide.title}
                /* 3 columns of cards perfectly fitting in the container */
                className="shrink-0 grow-0 basis-[calc((100%-2*var(--grid-gap))/3)]"
              >
                <TogetherCard {...slide} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
