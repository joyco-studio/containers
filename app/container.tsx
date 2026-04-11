"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import clsx from "clsx";

export const VARIANTS = [
  { id: "container-max-w", label: "Max Width" },
  { id: "container-padded-max-w", label: "Padded Max Width" },
  { id: "container-critical-breakpoint", label: "Critical Breakpoint" },
  { id: "container-grid", label: "Grid" },
  { id: "container-responsive", label: "Emulated Grid" },
] as const;

export type ContainerVariant = (typeof VARIANTS)[number]["id"];

const VARIANT_IDS = VARIANTS.map((v) => v.id) as [
  ContainerVariant,
  ...ContainerVariant[],
];

// ---------------------------------------------------------------------------
// <Container> — outer wrapper. Applies the chosen container-* utility class
// and, for the sidebar variant, slots in an <aside> as the first grid child.
// For the grid variant, the wrapper's children become direct grid items, so
// you should put <Item> children directly inside it.
// ---------------------------------------------------------------------------

type ContainerContextValue = {
  variant: ContainerVariant;
  setVariant: (v: ContainerVariant) => void;
};

const ContainerContext = createContext<ContainerContextValue | null>(null);

export function ContainerProvider({
  children,
  initialVariant = "container-max-w",
}: {
  children: ReactNode;
  initialVariant?: ContainerVariant;
}) {
  const [variant, setVariantQuery] = useQueryState(
    "variant",
    parseAsStringLiteral(VARIANT_IDS)
      .withDefault(initialVariant)
      .withOptions({ history: "replace", shallow: true }),
  );
  const setVariant = useCallback(
    (v: ContainerVariant) => {
      void setVariantQuery(v);
    },
    [setVariantQuery],
  );
  const value = useMemo(() => ({ variant, setVariant }), [variant, setVariant]);
  return (
    <ContainerContext.Provider value={value}>
      {children}
    </ContainerContext.Provider>
  );
}

export function useContainer() {
  const ctx = useContext(ContainerContext);
  if (!ctx) {
    throw new Error("useContainer must be used within a ContainerProvider");
  }
  return ctx;
}

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  variant?: ContainerVariant;
};

const GRID_ITEM_CLASSES =
  "col-start-1 col-end-[-1] lg:col-start-2 lg:col-end-10 2xl:col-start-3 2xl:col-end-11";

export function Container({
  variant: variantProp,
  children,
  className,
  ...rest
}: ContainerProps) {
  const ctx = useContext(ContainerContext);
  const variant = variantProp ?? ctx?.variant;

  if (!variant) {
    throw new Error("Container variant is required");
  }

  const content = useMemo(() => {
    if (variant === "container-grid") {
      return (
        <div className={clsx(GRID_ITEM_CLASSES, className)}>{children}</div>
      );
    }
    return children;
  }, [children, variant, className]);

  const wrapperClasses = useMemo(() => {
    if (variant === "container-grid") {
      return variant;
    }
    return clsx(variant, className);
  }, [variant, className]);

  return (
    <div className={wrapperClasses} {...rest}>
      {content}
    </div>
  );
}
