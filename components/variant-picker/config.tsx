import type { ContainerVariant } from "@/app/container";

export type VariantPoint =
  | string
  | { summary: string; detail: React.ReactNode };

export type VariantInfo = {
  description: string;
  pros: VariantPoint[];
  cons: VariantPoint[];
  sites: { name: string; url: string; note: string }[];
};

export const VARIANT_EXAMPLES: Record<ContainerVariant, VariantInfo> = {
  "container-max-w": {
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
  "container-padded-max-w": {
    description:
      "Max-width capped content where the horizontal padding IS the overflow gutter: padding-inline = (100vw − max-w) / 2. Below the cap the element goes fully edge-to-edge; above the cap the padding soaks up the extra viewport width so content stays locked at max-width.",
    pros: [
      {
        summary: "Full-bleed backgrounds and capped content share one element.",
        detail:
          "Above the cap the container still occupies the full viewport — the overflow is its own padding, not dead margin. So a background-color on the container fills the viewport AND the content column sits at max-width without any wrapper/inner split. The 'full-bleed bg vs. capped content' mismatch that Max Width has is gone.",
      },
      {
        summary: "Below the cap, every pixel is usable.",
        detail:
          "padding-inline clamps to 0 when the viewport is narrower than max-width, so on mobile and tablet content spans edge-to-edge with no wasted gutter. Good for dense dashboards or mobile-first layouts that want every available pixel.",
      },
      "One formula, no breakpoints. Padding is a pure function of viewport and max-width.",
    ],
    cons: [
      {
        summary: "Content slams the viewport edge below the cap.",
        detail:
          "Because padding collapses to 0 under max-width, text and controls sit flush against the screen edge on mobile/tablet. You almost always need an inner wrapper with its own padding for readability, which partly defeats the point of using this variant as your only container.",
      },
      {
        summary: "Hard transition at the cap — no smooth handoff.",
        detail:
          "At exactly viewport = max-width the padding snaps from 0 to growing with vw. There's no intermediate region where the gutter eases in; it's binary. Constrained or Responsive containers both scale more gracefully through that threshold.",
      },
      "Relies on 100vw, which includes the scrollbar on some platforms — can cause a tiny horizontal overflow unless you account for it.",
    ],
    sites: [
      {
        name: "Example",
        url: "https://example.com",
        note: "Replace with a real reference.",
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
        summary:
          "Desktop QA collapses to 4 exact widths instead of a continuum.",
        detail:
          "Below sm the content collapses fluidly (handle it like any mobile layout). Above sm the container only ever takes one of four exact widths — sm, md, lg, or xl. So the entire desktop range collapses into just four states to design and QA, not an infinite range of viewport sizes.",
      },
    ],
    cons: [
      {
        summary:
          "Same full-bleed mismatch as Max Width, but at every breakpoint.",
        detail:
          "Between breakpoints the container width is frozen while the viewport keeps growing — so the side gutter expands until the next snap. You get the 'background fills the viewport, content sits in an island' problem from Max Width, except it repeats four times over instead of just once.",
      },
      "In-between widths are wasted — a 1200px viewport renders as if it were 1024px.",
    ],
    sites: [
      {
        name: "Example",
        url: "https://example.com",
        note: "Replace with a real reference.",
      },
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
    ],
    cons: [
      {
        summary:
          "Wrapper pins all content into a single fixed cell (in this codebase).",
        detail: (
          <>
            <p>
              <code>&lt;Container&gt;</code> wraps all children in one grid item
              pinned to <code>col-start-3 col-end-11</code> at <code>lg</code>.
            </p>
            <p>
              So in practice content is plain block flow inside one fixed cell —
              none of the &ldquo;real grid&rdquo; flexibility from the pros is
              exposed unless you bypass <code>Container</code> and emit grid
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
        summary:
          "Two scaling models (fixed padding, fluid columns) coexist awkwardly.",
        detail:
          "Padding outside the grid is fixed per breakpoint (1 / 1.5 / 2rem), so the *outermost* gutter stops scaling at 1024px even though the columns inside keep stretching. Two different scaling rules in the same component.",
      },
      {
        summary:
          "Column count changes per breakpoint, so spans must be re-declared.",
        detail:
          "1 col below 640, 6 cols 640–1024, 12 cols above 1024. Any explicit span like `col-start-3 col-end-11` only makes sense at ≥1024px — at smaller breakpoints you have to re-declare it or fall back to auto-placement (which usually breaks the layout).",
      },
    ],
    sites: [
      {
        name: "Darkroom",
        url: "https://darkroom.engineering/",
        note: "Editorial site built on a visible 8-col grid (4 cols on tablet / mobile) — children opt into specific spans rather than living inside a single content cell.",
      },
    ],
  },
  "container-responsive": {
    description:
      "A fluid-padding container: side `padding-inline` is a continuous function of viewport width (with breakpoint-tuned divisors), capped at 1920px. Marketed as an 'emulated 12-col grid', but the actual formula doesn't produce a clean whole-column breakdown — it's really just a hand-tuned fluid padding that feels grid-adjacent.",
    pros: [
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
      "Children stay normal block/flex elements — no grid-item bookkeeping, drop anything in and it inherits the padding.",
    ],
    cons: [
      {
        summary:
          "The 'grid-derived' framing is aspirational, not what the code does.",
        detail: (
          <>
            <p>
              The CSS comment says{" "}
              <code>padding = 1.5 cols + 1.5 gaps = (W + g) / 8</code>, which
              would leave exactly 9 inner cols of content in a 12-col conceptual
              grid. But the code uses <code>(W + g) / 9</code>, not{" "}
              <code>/ 8</code>.
            </p>
            <p>
              Working the math, <code>/9</code> gives ≈{" "}
              <strong>1.33 cols + 1.33 gaps</strong> of padding, leaving ≈{" "}
              <strong>9.33 inner cols</strong> of content — not exactly 9. So
              there&apos;s no clean column count inside: a real{" "}
              <code>grid-cols-9</code> child almost fits but leaves about a
              third of a column of unused space on the trailing edge.
            </p>
            <p>
              In practice this is visually fine (the padding still scales nicely
              with the viewport), but the &ldquo;emulated 12-col grid&rdquo;
              story is a lie. It&apos;s a bespoke fluid padding formula, not a
              grid system. Treat it as such.
            </p>
          </>
        ),
      },
      {
        summary: "Opaque padding formula — 'why divide by 9?'",
        detail:
          "`(min(100%, 1920px) + var(--grid-gap)) / 9` is unreadable at a glance and, as noted above, doesn't map cleanly to any whole-column breakdown. The CSS comment next to it is also wrong (says `/8`). Looks like a magic number because it effectively is one.",
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

export const BASE_SIZES = [12, 14, 16, 18, 20] as const;
export const SCALE_MODES = ["text", "all", "scalable"] as const;
export type ScaleMode = (typeof SCALE_MODES)[number];

export const MODE_LABELS: Record<ScaleMode, string> = {
  text: "Text",
  all: "All",
  scalable: "Scalable",
};

export const BASE_VIEWPORTS = [480, 768, 1440, 1920] as const;
export type BaseViewport = (typeof BASE_VIEWPORTS)[number];
export const DEFAULT_BASE_VIEWPORT: BaseViewport = 1440;
