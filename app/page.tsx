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

const VARIANT_EXAMPLES: Record<
  ContainerVariant,
  { description: string; sites: { name: string; url: string; note: string }[] }
> = {
  "container-constrained": {
    description:
      "A single max-width column centered on the page. The classic content container.",
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
      "Stays narrow until a critical breakpoint, then jumps to a wider layout.",
    sites: [
      { name: "Example", url: "https://example.com", note: "Replace with a real reference." },
    ],
  },
  "container-grid": {
    description:
      "A 12-column grid container that lets children opt into specific column spans.",
    sites: [
      { name: "Example", url: "https://example.com", note: "Replace with a real reference." },
    ],
  },
  "container-responsive": {
    description:
      "Fluid side padding derived from a 12-column grid. Padding scales with viewport width and caps at 1920px.",
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
              <div className="text-lg font-semibold">Acme Inc.</div>
              <nav className="flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
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
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800"
                >
                  <div className="mb-3 h-8 w-8 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <h3 className="font-semibold">Feature {i + 1}</h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    A short description of what this feature does and why it matters.
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="bg-white py-16 dark:bg-zinc-950">
          <Container>
            <div className="rounded-2xl bg-zinc-900 p-10 text-center text-white dark:bg-zinc-100 dark:text-zinc-900">
              <h2 className="text-2xl font-semibold">Ready to ship?</h2>
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
                <div className="text-sm font-semibold">Product</div>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <li><a href="#">Features</a></li>
                  <li><a href="#">Pricing</a></li>
                  <li><a href="#">Changelog</a></li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-semibold">Company</div>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <li><a href="#">About</a></li>
                  <li><a href="#">Blog</a></li>
                  <li><a href="#">Careers</a></li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-semibold">Resources</div>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <li><a href="#">Docs</a></li>
                  <li><a href="#">Support</a></li>
                  <li><a href="#">Community</a></li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-semibold">Legal</div>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <li><a href="#">Privacy</a></li>
                  <li><a href="#">Terms</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-10 flex items-center justify-between border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-zinc-800">
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
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>{v.label}</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-6 space-y-6">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {info.description}
                  </p>
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
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
                            className="text-sm font-medium underline"
                          >
                            {s.name}
                          </a>
                          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
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
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Every container variant.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
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
    <code className="rounded bg-zinc-100 px-2 py-1 font-mono text-xs tabular-nums dark:bg-zinc-900">
      {size ? `w: ${size.w} × h: ${size.h}` : "— × —"}
    </code>
  );
}
