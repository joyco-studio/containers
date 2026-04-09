"use client";

import { useEffect, useState } from "react";
import {
  Container,
  ContainerProvider,
  VARIANTS,
  useContainer,
  type ContainerVariant,
} from "./container";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type VariantPoint = string | { summary: string; detail: React.ReactNode };

const VARIANT_EXAMPLES: Record<
  ContainerVariant,
  {
    description: string;
    pros: VariantPoint[];
    cons: VariantPoint[];
    sites: { name: string; url: string; note: string }[];
  }
> = {
  "container-constrained": {
    description:
      "A single max-width column centered on the page. The classic content container.",
    pros: [
      {
        summary: "Caps line length so prose stays readable.",
        detail:
          "On big screens, text that stretches edge-to-edge forces your eyes to track too far per line and hurts readability. A max-width column keeps line length in the comfortable 60–80ch range no matter how wide the viewport is.",
      },
      "Trivial to implement and reason about — one width, one rule.",
      "Plays well with any internal grid or flow layout.",
      {
        summary: "Above the cap is 'not your problem'.",
        detail:
          "You only need to design and QA content flow at the max-width breakpoint and below — that's where the layout actually collapses. Anything above the cap is just empty gutter, so it can't introduce new bugs.",
      },
    ],
    cons: [
      "Wastes screen real-estate on ultrawide displays.",
      "Looks identical at 1280px and 2560px — no reward for big monitors.",
      {
        summary: "Full-bleed bg vs. capped content mismatch above 1280px.",
        detail:
          "Section backgrounds fill the viewport while inner content stays capped, so the gutter between content edge and section edge keeps growing as the screen widens. The bigger the display, the more obvious the inconsistency — content looks like a small island in a large sea of background color.",
      },
    ],
    sites: [
      {
        name: "Tailwind CSS",
        url: "https://tailwindcss.com/",
        note: "Marketing site uses a capped max-width column with responsive horizontal padding.",
      },
      {
        name: "Vercel",
        url: "https://vercel.com/home",
        note: "Homepage sections sit inside a constrained centered container.",
      },
      {
        name: "Shopify Design",
        url: "https://shopify.design/",
        note: "Editorial layout centered in a fixed max-width column.",
      },
    ],
  },
  "container-critical-breakpoint": {
    description:
      "A stepped max-width: the container snaps its cap to the current breakpoint (sm → md → lg → xl) and then stops growing above xl. Same 'capped above, fluid below' shape as Max Width, just with multiple stops on the way up.",
    pros: [
      "Caps out at xl (1280px) — like Max Width, anything above that is just gutter and not your problem.",
      "At each breakpoint the container width *equals* the breakpoint exactly, so layouts hit pixel-perfect alignment with sm/md/lg/xl Figma frames.",
      {
        summary: "Desktop QA collapses to 4 exact widths instead of a continuum.",
        detail:
          "Below sm the content collapses fluidly (handle it like any mobile layout). Above sm the container only ever takes one of four exact widths — sm, md, lg, or xl. So the entire desktop range collapses into just four states to design and QA, not an infinite range of viewport sizes.",
      },
    ],
    cons: [
      {
        summary: "Same full-bleed mismatch as Max Width, but at every breakpoint.",
        detail:
          "Between breakpoints the container width is frozen while the viewport keeps growing — so the side gutter expands until the next snap. You get the 'background fills the viewport, content sits in an island' problem from Max Width, except it repeats four times over instead of just once.",
      },
      "In-between widths are wasted — a 1200px viewport renders as if it were 1024px.",
    ],
    sites: [
      { name: "Example", url: "https://example.com", note: "Replace with a real reference." },
    ],
  },
  "container-grid": {
    description:
      "A real CSS grid container: the wrapper itself is `display: grid` with a 12-column track, so every direct child is a grid item that opts into a column span. Unlike Max Width or Critical Breakpoint, the grid *is* the layout — there's no inner cap separate from an outer background.",
    pros: [
      {
        summary: "No max-width cap, so no full-bleed mismatch.",
        detail:
          "The wrapper always fills the viewport. Unlike Max Width or Critical Breakpoint, the section background and the layout track are the same element — there's no 'background fills 2560px, content sits in a 1280px island' inconsistency.",
      },
      {
        summary: "Real 12-col CSS grid track is always there if you need it.",
        detail:
          "When you need a layout primitive that opts into specific spans — a hero image at cols 1–6, a sidebar at cols 8–12 — the grid track already exists on the wrapper. No extra scaffolding, just declare `col-start-X col-end-Y` on a child.",
      },
      "Mirrors a Figma 12-col system 1:1: `col 3–10` in design becomes `col-start-3 col-end-11` in code.",
      "Column count steps up with breakpoints (1 → 6 → 12), so small viewports get a single-column stack automatically.",
    ],
    cons: [
      {
        summary: "Wrapper pins all content into a single fixed cell (in this codebase).",
        detail: (
          <>
            <p>
              <code>&lt;Container&gt;</code> wraps all children in one grid
              item pinned to <code>col-start-3 col-end-11</code> at{" "}
              <code>lg</code>.
            </p>
            <p>
              So in practice content is plain block flow inside one fixed cell
              — none of the &ldquo;real grid&rdquo; flexibility from the pros
              is exposed unless you bypass <code>Container</code> and emit grid
              items yourself.
            </p>
          </>
        ),
      },
      {
        summary: "1/3 of the grid sits empty as gutter cells on wide displays.",
        detail:
          "Cols 1–2 and 11–12 are always empty cells separated by `gap`, not `padding`. As the viewport grows past 1024px those four 'gutter' columns grow with it, so a 2560px monitor still has a third of the grid sitting empty on the sides — just packaged as grid cells instead of `padding-inline`.",
      },
      {
        summary: "No line-length guarantee for long-form prose.",
        detail:
          "Without a max-width cap, anything that breaks out to the full 12 cols on a large display reproduces the unreadable wide-line problem Max Width was solving. The current wrapper (cols 3–11 of 12) softens this, but it's not enforced.",
      },
      {
        summary: "Two scaling models (fixed padding, fluid columns) coexist awkwardly.",
        detail:
          "Padding outside the grid is fixed per breakpoint (1 / 1.5 / 2rem), so the *outermost* gutter stops scaling at 1024px even though the columns inside keep stretching. Two different scaling rules in the same component.",
      },
      {
        summary: "Column count changes per breakpoint, so spans must be re-declared.",
        detail:
          "1 col below 640, 6 cols 640–1024, 12 cols above 1024. Any explicit span like `col-start-3 col-end-11` only makes sense at ≥1024px — at smaller breakpoints you have to re-declare it or fall back to auto-placement (which usually breaks the layout).",
      },
    ],
    sites: [
      { name: "Example", url: "https://example.com", note: "Replace with a real reference." },
    ],
  },
  "container-responsive": {
    description:
      "An *emulated* 12-column grid: instead of making the wrapper `display: grid`, it derives the side padding from the same column-and-gap math the grid would produce. Children stay normal block/flex elements — they just happen to sit inside gutters that match a 12-col grid as if it were there.",
    pros: [
      {
        summary: "Side padding derived from the 12-col math, no grid items required.",
        detail: (
          <>
            <p>
              The side <code>padding-inline</code> is computed from the same
              column + gap math the conceptual 12-col grid uses (specifically:{" "}
              <strong>1.5 columns + 1.5 gaps</strong> on each side). So the
              gutter you see at any viewport size is mathematically consistent
              with the grid the rest of the system follows.
            </p>
            <ColumnDiagram />
            <p>
              Above: the viewport laid out as a conceptual 12-col grid. Blue
              cells are columns, pink strips are gaps. The lime dashed overlay
              on each side marks the <code>padding-inline</code> region — it
              doesn&apos;t snap to a column boundary, it lands{" "}
              <strong>1.5 cols + 1.5 gaps</strong> in from the edge. What&apos;s
              left in the middle is the content area: <strong>9 inner cols</strong>
              {" "}of usable space.
            </p>
            <p>
              The win is that you get this consistency{" "}
              <strong>without making every child a grid item</strong>. Drop in
              a block, a flex container, anything — it just gets the same
              grid-derived padding as its parent. Children don&apos;t &ldquo;snap to
              grid lines&rdquo; (there are no grid lines, just padding), but
              they all live inside the same conceptually-aligned canvas.
            </p>
          </>
        ),
      },
      {
        summary: "Side padding flexes smoothly, no breakpoint snaps.",
        detail:
          "Padding scales as a continuous function of viewport width instead of jumping at breakpoints, so there's no Critical-Breakpoint-style 'frozen content while gutter grows' moment. The gutter and the content scale together.",
      },
      {
        summary: "Caps at 1920px — above the cap is gutter, not your problem.",
        detail:
          "Above 1920px the math switches to centering inside a fixed canvas, so ultrawide monitors don't keep stretching content. Same 'above the cap is gutter, not your problem' guarantee as Max Width, just at a much larger cap.",
      },
      {
        summary: "Emulated + real grid can cohabit — but use 9 columns, not 12.",
        detail: (
          <>
            <p>
              The padding formula <code>(W + gap) / 9</code> represents{" "}
              <strong>1.5 columns + 1.5 gaps</strong> on each side of a
              conceptual 12-col grid. That means the content area left over is
              exactly <strong>9 columns wide</strong> (with the same gap).
            </p>
            <p>
              So if you drop a <code>display: grid</code> child inside and give
              it <code>grid-cols-9</code> + <code>gap: var(--grid-gap)</code>,
              its column lines land exactly on the lines the conceptual 12-col
              grid implies (cols 2.5 → 10.5). Real grid where you need it; the
              rest of the page inherits the same rhythm via padding.
            </p>
            <p>
              <strong>The trap:</strong> the conceptual grid is 12 cols, so the
              obvious thing to write is <code>grid-cols-12</code> — and that{" "}
              <strong>does not line up</strong>, because it crams 12 columns
              into 9 columns of horizontal space.
            </p>
            <p>
              On a wide site this is a real footgun: reviewers see &ldquo;looks
              aligned-ish&rdquo; and ship it, then a designer flags that the
              inner grid is 25% off the global rhythm. Document the rule
              loudly:
            </p>
            <ul>
              <li>
                Inside <code>container-responsive</code>, use{" "}
                <strong>9 columns, not 12</strong>.
              </li>
              <li>
                Always pair the inner grid with{" "}
                <code>gap: var(--grid-gap)</code>.
              </li>
            </ul>
          </>
        ),
      },
    ],
    cons: [
      {
        summary: "Opaque padding formula — 'why divide by 9?'",
        detail:
          "`(min(100%, 1920px) + var(--grid-gap)) / 9` is unreadable at a glance. Readers have to reverse-engineer that '9' comes from 12 cols minus 1.5 cols + 1.5 gaps on each side. Without a comment explaining the derivation, this looks like a magic number.",
      },
      {
        summary: "One-way alignment: gutters match, interiors don't.",
        detail:
          "Because there's no actual grid, children that want to span specific columns have to redo the math themselves. The alignment guarantee is one-way — outer gutters always match the conceptual 12-col grid, but anything inside the content area is on its own.",
      },
      {
        summary: "1920 → 2320px range needs hand-tuned breakpoints.",
        detail:
          "The divisor changes from 8 to 12 between 1920px and 2320px, so it's not purely formulaic — there are still magic numbers, just fewer of them than a fully manual breakpoint system.",
      },
    ],
    sites: [
      {
        name: "Sazabi",
        url: "https://sazabi.com",
        note: "Side margins flex with viewport width using grid-derived padding.",
      },
    ],
  },
};

export default function Home() {
  return (
    <ContainerProvider>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
        {/* Sticky picker */}
        <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
          <VariantPicker />
        </div>

        {/* Header */}
        <header className="border-b border-dashed border-zinc-300 bg-white py-4 dark:border-zinc-800 dark:bg-zinc-950">
          <Container>
            <div className="flex items-center justify-between">
              <div className="text-d-lg font-semibold">Acme Inc.</div>
              <nav className="flex gap-6 text-d-sm text-zinc-600 dark:text-zinc-400">
                <a href="#">Product</a>
                <a href="#">Pricing</a>
                <a href="#">Docs</a>
                <a href="#">Sign in</a>
              </nav>
            </div>
          </Container>
        </header>

        {/* Hero */}
        <section className="border-b border-dashed border-zinc-300 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <Container>
            <div>
              <HeroCopy />
            </div>
          </Container>
        </section>

        {/* Feature grid — the section where the grid container actually shines */}
        <section className="border-b border-dashed border-zinc-300 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <Container>
            <div className="grid grid-gap grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
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
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800"
                >
                  <div className="mb-3 h-8 w-8 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-1 text-d-sm text-zinc-600 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Cards */}
        <section className="border-b border-dashed border-zinc-300 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <Container>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
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
              ].map((card) => (
                <article
                  key={card.title}
                  className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="aspect-[16/10] w-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="p-6">
                    <h3 className="text-d-2xl font-semibold tracking-tight">{card.title}</h3>
                    <p className="mt-2 text-d-sm text-zinc-600 dark:text-zinc-400">
                      {card.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="bg-white py-16 dark:bg-zinc-950">
          <Container>
            <div className="rounded-2xl bg-zinc-900 p-10 text-center text-white dark:bg-zinc-100 dark:text-zinc-900">
              <h2 className="text-d-2xl font-semibold">Ready to ship?</h2>
              <p className="mt-2 text-zinc-300 dark:text-zinc-600">
                Swap the container above and watch this block re-flow.
              </p>
            </div>
          </Container>
        </section>

        {/* Footer */}
        <footer className="border-t border-dashed border-zinc-300 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950">
          <Container>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div>
                <div className="text-d-sm font-semibold">Product</div>
                <ul className="mt-3 space-y-2 text-d-sm text-zinc-600 dark:text-zinc-400">
                  <li><a href="#">Features</a></li>
                  <li><a href="#">Pricing</a></li>
                  <li><a href="#">Changelog</a></li>
                </ul>
              </div>
              <div>
                <div className="text-d-sm font-semibold">Company</div>
                <ul className="mt-3 space-y-2 text-d-sm text-zinc-600 dark:text-zinc-400">
                  <li><a href="#">About</a></li>
                  <li><a href="#">Blog</a></li>
                  <li><a href="#">Careers</a></li>
                </ul>
              </div>
              <div>
                <div className="text-d-sm font-semibold">Resources</div>
                <ul className="mt-3 space-y-2 text-d-sm text-zinc-600 dark:text-zinc-400">
                  <li><a href="#">Docs</a></li>
                  <li><a href="#">Support</a></li>
                  <li><a href="#">Community</a></li>
                </ul>
              </div>
              <div>
                <div className="text-d-sm font-semibold">Legal</div>
                <ul className="mt-3 space-y-2 text-d-sm text-zinc-600 dark:text-zinc-400">
                  <li><a href="#">Privacy</a></li>
                  <li><a href="#">Terms</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-10 flex items-center justify-between border-t border-zinc-200 pt-6 text-d-xs text-zinc-500 dark:border-zinc-800">
              <div>© 2026 Acme Inc.</div>
              <div>Built with containers.</div>
            </div>
          </Container>
        </footer>
      </div>
    </ContainerProvider>
  );
}

function VariantPicker() {
  const { variant, setVariant } = useContainer();
  const [openInfo, setOpenInfo] = useState<ContainerVariant | null>(null);
  return (
    <div className="py-3 overflow-x-auto px-4">
      <div className="flex justify-center items-center gap-2 w-full min-w-max">
        <WindowSize />
        <span className="mx-2 h-5 w-px bg-zinc-700" />
        <BaseSizePicker />
        <span className="mx-2 h-5 w-px bg-zinc-700" />
        {VARIANTS.map((v) => {
          const active = variant === v.id;
          return (
            <ButtonGroup key={v.id}>
              <Button
                type="button"
                size="sm"
                variant={active ? "default" : "outline"}
                onClick={() => setVariant(v.id)}
              >
                {v.label}
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant={active ? "default" : "outline"}
                aria-label={`About ${v.label}`}
                onClick={() => setOpenInfo(v.id)}
              >
                i
              </Button>
            </ButtonGroup>
          );
        })}
        {VARIANTS.map((v) => {
          const info = VARIANT_EXAMPLES[v.id];
          return (
            <Sheet
              key={v.id}
              open={openInfo === v.id}
              onOpenChange={(o) => setOpenInfo(o ? v.id : null)}
            >
              <SheetContent className="w-full sm:!max-w-2xl">
                <SheetHeader>
                  <SheetTitle>{v.label}</SheetTitle>
                </SheetHeader>
                <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-6 space-y-6">
                  <p className="text-d-sm text-zinc-200 leading-relaxed">
                    {info.description}
                  </p>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <div className="mb-2 text-d-xs font-semibold uppercase tracking-wider text-emerald-500">
                        Pros
                      </div>
                      <ul className="space-y-1 text-d-sm text-zinc-200">
                        {info.pros.map((p, i) => (
                          <PointItem key={i} point={p} tone="pro" />
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="mb-2 text-d-xs font-semibold uppercase tracking-wider text-red-500">
                        Cons
                      </div>
                      <ul className="space-y-1 text-d-sm text-zinc-200">
                        {info.cons.map((c, i) => (
                          <PointItem key={i} point={c} tone="con" />
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-d-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Examples in the wild
                    </div>
                    <ul className="space-y-3">
                      {info.sites.map((s) => (
                        <li
                          key={s.url}
                          className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                        >
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-d-sm font-medium underline"
                          >
                            {s.name}
                          </a>
                          <p className="mt-1 text-d-xs text-zinc-600 dark:text-zinc-400">
                            {s.note}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          );
        })}
      </div>
    </div>
  );
}

function HeroCopy() {
  return (
    <div>
      <h1 className="max-w-2xl text-d-4xl font-semibold tracking-tight sm:text-d-5xl">
        Every container variant.
      </h1>
      <p className="mt-4 max-w-xl text-d-lg text-zinc-600 dark:text-zinc-400">
        Pick a container above to see how a typical page layout behaves under
        each option from the Tailwind Plus containers gallery.
      </p>
      <div className="mt-6 flex gap-3">
        <Button size="lg">Get started</Button>
        <Button size="lg" variant="outline">Learn more</Button>
      </div>
    </div>
  );
}

const BASE_SIZES = [12, 14, 16, 18, 20] as const;
type ScaleMode = "all" | "text";

function BaseSizePicker() {
  const [size, setSize] = useState<number>(16);
  const [mode, setMode] = useState<ScaleMode>("all");
  useEffect(() => {
    const html = document.documentElement;
    if (mode === "all") {
      html.style.fontSize = `${size}px`;
      html.style.setProperty("--text-scale", "1");
    } else {
      html.style.fontSize = "";
      html.style.setProperty("--text-scale", String(size / 16));
    }
    return () => {
      html.style.fontSize = "";
      html.style.removeProperty("--text-scale");
    };
  }, [size, mode]);
  return (
    <>
      <ButtonGroup>
        {(["all", "text"] as const).map((m) => (
          <Button
            key={m}
            type="button"
            size="sm"
            variant={mode === m ? "default" : "outline"}
            onClick={() => setMode(m)}
          >
            {m === "all" ? "All" : "Text"}
          </Button>
        ))}
      </ButtonGroup>
      <ButtonGroup>
        {BASE_SIZES.map((s) => (
          <Button
            key={s}
            type="button"
            size="sm"
            variant={size === s ? "default" : "outline"}
            onClick={() => setSize(s)}
          >
            {s}
          </Button>
        ))}
      </ButtonGroup>
    </>
  );
}

function ColumnDiagram() {
  // Conceptual 12-col grid: col=32, gap=8 → total = 472
  // Side padding (per CSS comment): 1.5*col + 1.5*gap = 48 + 12 = 60
  const COL = 32;
  const GAP = 8;
  const COLS = 12;
  const TOTAL = COLS * COL + (COLS - 1) * GAP; // 472
  const PAD = 1.5 * COL + 1.5 * GAP; // 60
  return (
    <svg
      viewBox={`0 0 ${TOTAL} 110`}
      className="my-2 w-full rounded border border-zinc-800 bg-zinc-950"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Columns */}
      {Array.from({ length: COLS }).map((_, i) => {
        const x = i * (COL + GAP);
        return (
          <g key={`c${i}`}>
            <rect
              x={x}
              y={25}
              width={COL}
              height={55}
              fill="rgba(96,165,250,0.22)"
              stroke="rgba(147,197,253,0.55)"
              strokeWidth="0.5"
            />
            <text
              x={x + COL / 2}
              y={58}
              fill="#cbd5e1"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {i + 1}
            </text>
          </g>
        );
      })}
      {/* Gaps */}
      {Array.from({ length: COLS - 1 }).map((_, i) => (
        <rect
          key={`g${i}`}
          x={COL + i * (COL + GAP)}
          y={25}
          width={GAP}
          height={55}
          fill="rgba(236,72,153,0.4)"
        />
      ))}
      {/* Side padding overlays */}
      <rect
        x={0}
        y={20}
        width={PAD}
        height={65}
        fill="rgba(74,222,128,0.18)"
        stroke="rgba(134,239,172,0.85)"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <rect
        x={TOTAL - PAD}
        y={20}
        width={PAD}
        height={65}
        fill="rgba(74,222,128,0.18)"
        stroke="rgba(134,239,172,0.85)"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      {/* Top labels */}
      <text
        x={PAD / 2}
        y={14}
        fill="#86efac"
        fontSize="9"
        fontFamily="monospace"
        textAnchor="middle"
      >
        padding
      </text>
      <text
        x={TOTAL - PAD / 2}
        y={14}
        fill="#86efac"
        fontSize="9"
        fontFamily="monospace"
        textAnchor="middle"
      >
        padding
      </text>
      <text
        x={TOTAL / 2}
        y={14}
        fill="#93c5fd"
        fontSize="9"
        fontFamily="monospace"
        textAnchor="middle"
      >
        content area · 9 inner cols
      </text>
      {/* Bottom labels */}
      <text
        x={PAD / 2}
        y={100}
        fill="#86efac"
        fontSize="8"
        fontFamily="monospace"
        textAnchor="middle"
      >
        1.5 col + 1.5 gap
      </text>
      <text
        x={TOTAL - PAD / 2}
        y={100}
        fill="#86efac"
        fontSize="8"
        fontFamily="monospace"
        textAnchor="middle"
      >
        1.5 col + 1.5 gap
      </text>
    </svg>
  );
}

function PointItem({
  point,
  tone,
}: {
  point: VariantPoint;
  tone: "pro" | "con";
}) {
  const marker = tone === "pro" ? "+" : "−";
  const markerColor = tone === "pro" ? "text-emerald-500" : "text-red-500";

  if (typeof point === "string") {
    return (
      <li className="flex gap-2 py-1">
        <span className={markerColor}>{marker}</span>
        <span>{point}</span>
      </li>
    );
  }

  return (
    <li>
      <Collapsible>
        <CollapsibleTrigger className="group flex w-full gap-2 py-1 text-left hover:text-zinc-200">
          <span className={markerColor}>{marker}</span>
          <span className="flex-1">{point.summary}</span>
          <span className="text-xs text-zinc-500 transition-transform group-data-[state=open]:rotate-90">
            ›
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="ml-4 mt-1 mb-3 border-l-2 border-zinc-700 pl-4 text-d-sm text-zinc-400 space-y-3 [&_p]:leading-relaxed [&_code]:rounded [&_code]:bg-zinc-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-zinc-100 [&_strong]:font-semibold [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:marker:text-zinc-600">
            {point.detail}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}

function WindowSize() {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return (
    <code className="rounded bg-zinc-100 px-2 py-1 font-mono text-d-xs tabular-nums dark:bg-zinc-900">
      {size ? `w: ${size.w} × h: ${size.h}` : "— × —"}
    </code>
  );
}
