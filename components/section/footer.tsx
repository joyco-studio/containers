import { Container } from "@/app/container";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Docs", href: "#" },
      { label: "Support", href: "#" },
      { label: "Community", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-dashed border-zinc-300 py-12 dark:border-zinc-800">
      <Container>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <div className="text-d-sm font-semibold">{col.heading}</div>
              <ul className="mt-3 space-y-2 text-d-sm text-zinc-600 dark:text-zinc-400">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-center justify-between border-t border-zinc-200 pt-6 text-d-xs text-zinc-500 dark:border-zinc-800">
          <div>© 2026 Acme Inc.</div>
          <div>Built with containers.</div>
        </div>
      </Container>
    </footer>
  );
}
