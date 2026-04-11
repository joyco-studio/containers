import { Container } from "@/app/container";

const NAV = [
  { label: "Product", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Docs", href: "#" },
  { label: "Sign in", href: "#" },
];

export function Header() {
  return (
    <header className="border-b border-dashed border-zinc-300 py-4 dark:border-zinc-800">
      <Container>
        <div className="flex items-center justify-between">
          <div className="text-d-lg font-semibold">Acme Inc.</div>
          <nav className="flex gap-6 text-d-sm text-zinc-600 dark:text-zinc-400">
            {NAV.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </Container>
    </header>
  );
}
