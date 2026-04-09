"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import clsx from "clsx";

export const VARIANTS = [
  { id: "container-constrained", label: "Max Width" },
  { id: "container-critical-breakpoint", label: "Critical Breakpoint" },
  { id: "container-grid", label: "Grid" },
  { id: "container-responsive", label: "Emulated Grid" },
] as const;

export type ContainerVariant = (typeof VARIANTS)[number]["id"];

// ---------------------------------------------------------------------------
// <Container> — outer wrapper. Applies the chosen container-* utility class
// and, for the sidebar variant, slots in an <aside> as the first grid child.
// For the grid variant, the wrapper's children become direct grid items, so
// you should put <Item> children directly inside it.
// ---------------------------------------------------------------------------

type ContainerContextValue = {
  variant: ContainerVariant;
  setVariant: Dispatch<SetStateAction<ContainerVariant>>;
};

const ContainerContext = createContext<ContainerContextValue | null>(null);

export function ContainerProvider({
  children,
  initialVariant = "container-constrained",
}: {
  children: ReactNode;
  initialVariant?: ContainerVariant;
}) {
  const [variant, setVariant] = useState<ContainerVariant>(initialVariant);
  const value = useMemo(() => ({ variant, setVariant }), [variant]);
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
  "col-start-1 col-end-[-1] sm:col-start-1 sm:col-end-10 lg:col-start-3 lg:col-end-11";

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
