import { Container } from "@/app/container";
import { Button } from "@/components/ui/button";

type PricingTier = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

const PRICING_TIERS: PricingTier[] = [
  {
    name: "Hobby",
    price: "$0",
    period: "forever",
    description: "Everything you need to get a side project off the ground.",
    features: [
      "Up to 3 projects",
      "Community support",
      "1 GB bandwidth",
      "Basic analytics",
    ],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "$24",
    period: "per month",
    description: "For growing teams that need more power and collaboration.",
    features: [
      "Unlimited projects",
      "Priority support",
      "100 GB bandwidth",
      "Advanced analytics",
      "Custom domains",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description:
      "Dedicated infrastructure and support for large organizations.",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "Unlimited bandwidth",
      "SSO & SAML",
      "SLA & audit logs",
    ],
    cta: "Talk to sales",
  },
];

export function Pricing() {
  return (
    <section className="border-b border-dashed border-zinc-300 py-16 dark:border-zinc-800">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-d-3xl font-semibold tracking-tight sm:text-d-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-d-lg text-zinc-600 dark:text-zinc-400">
            Start free, scale as you grow. No hidden fees, cancel anytime.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div className="flex flex-col border-zinc-200 bg-card dark:border-zinc-800 rounded-xl border p-8">
      <div className="flex items-baseline justify-between">
        <h3 className="text-d-xl font-semibold">{tier.name}</h3>
      </div>
      <p className="mt-2 text-d-sm text-zinc-600 dark:text-zinc-400">
        {tier.description}
      </p>
      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-d-4xl font-semibold tracking-tight">
          {tier.price}
        </span>
        <span className="text-d-sm text-zinc-600 dark:text-zinc-400">
          {tier.period}
        </span>
      </div>
      <ul className="mt-6 flex-1 space-y-3">
        {tier.features.map((feature) => (
          <li key={feature} className="flex gap-2 text-d-sm">
            <span className="text-emerald-500">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button size="lg" className="w-full">
          {tier.cta}
        </Button>
      </div>
    </div>
  );
}
