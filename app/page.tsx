"use client";

import {
  Container,
  ContainerProvider,
  VARIANTS,
  useContainer,
} from "./container";

export default function Home() {
  return (
    <ContainerProvider>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
        {/* Sticky picker */}
        <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
          <Container variant="container-constrained" className="flex flex-wrap items-center gap-2 py-3">
            <VariantPicker />
          </Container>
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
  return (
    <>
      <span className="mr-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
        Container
      </span>
      {VARIANTS.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={() => setVariant(v.id)}
          className={`rounded-full border px-3 py-1 text-sm transition-colors ${
            variant === v.id
              ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-black"
              : "border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          }`}
        >
          {v.label}
        </button>
      ))}
      <code className="ml-auto rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-900">
        className=&quot;{variant}&quot;
      </code>
    </>
  );
}

function HeroCopy() {
  return (
    <div>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        One class. Every Tailwind container variant.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        Pick a container above to see how a typical page layout behaves under
        each option from the Tailwind Plus containers gallery.
      </p>
      <div className="mt-6 flex gap-3">
        <button className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-black">
          Get started
        </button>
        <button className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium dark:border-zinc-700">
          Learn more
        </button>
      </div>
    </div>
  );
}
