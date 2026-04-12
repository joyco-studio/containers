"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  parseAsInteger,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";
import {
  VARIANTS,
  useContainer,
  type ContainerVariant,
} from "@/app/container";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ScrollAreaViewport,
  ScrollAreaContent,
} from "@/components/scroll-area";
import { Inspector } from "@/components/inspector";
import {
  BASE_SIZES,
  BASE_VIEWPORTS,
  DEFAULT_BASE_VIEWPORT,
  MODE_LABELS,
  SCALE_MODES,
  VARIANT_EXAMPLES,
  type VariantPoint,
} from "./config";

export function VariantPicker() {
  const { variant, setVariant } = useContainer();
  const [openInfo, setOpenInfo] = useState<ContainerVariant | null>(null);
  return (
    <div className="max-w-[calc(var(--max-width)-var(--sides)*2)] mx-auto flex gap-x-6 justify-between h-14 items-center">
      <div className="flex items-center justify-center h-full aspect-square bg-primary relative">
        <Image
          src="/iso-framed.svg"
          className="size-12"
          width={48}
          height={48}
          alt="joyco iso"
        />
      </div>
      <ScrollAreaViewport orientation="horizontal">
        <ScrollAreaContent>
          <div className="flex justify-center py-3 items-center gap-2 w-max">
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
            <span className="mx-2 h-5 w-px bg-zinc-700" />
            <Inspector />
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
        </ScrollAreaContent>
      </ScrollAreaViewport>
    </div>
  );
}

function BaseSizePicker() {
  const [size, setSize] = useQueryState(
    "size",
    parseAsInteger
      .withDefault(16)
      .withOptions({ history: "replace", shallow: true }),
  );
  const [mode, setMode] = useQueryState(
    "mode",
    parseAsStringLiteral(SCALE_MODES)
      .withDefault("text")
      .withOptions({ history: "replace", shallow: true }),
  );
  const [baseViewport, setBaseViewport] = useQueryState(
    "bv",
    parseAsInteger
      .withDefault(DEFAULT_BASE_VIEWPORT)
      .withOptions({ history: "replace", shallow: true }),
  );
  useEffect(() => {
    const html = document.documentElement;
    if (mode === "all") {
      html.style.fontSize = `${size}px`;
      html.style.setProperty("--text-scale", "1");
    } else if (mode === "scalable") {
      // calc(unitless * length / unitless) = length.
      // At vw === baseViewport, this evaluates to exactly `${size}px`.
      html.style.fontSize = `calc(${size} * 100vw / ${baseViewport})`;
      html.style.setProperty("--text-scale", "1");
    } else {
      html.style.fontSize = "";
      html.style.setProperty("--text-scale", String(size / 16));
    }
    return () => {
      html.style.fontSize = "";
      html.style.removeProperty("--text-scale");
    };
  }, [size, mode, baseViewport]);
  return (
    <>
      <Select
        value={mode}
        onValueChange={(v) => void setMode(v as typeof mode)}
      >
        <SelectTrigger size="sm">
          <span className="text-muted-foreground">Scale:</span> <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SCALE_MODES.map((m) => (
            <SelectItem key={m} value={m}>
              {MODE_LABELS[m]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={String(size)}
        onValueChange={(v) => void setSize(Number(v))}
      >
        <SelectTrigger size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {BASE_SIZES.map((s) => (
            <SelectItem key={s} value={String(s)}>
              {s}px
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {mode === "scalable" && (
        <Select
          value={String(baseViewport)}
          onValueChange={(v) => void setBaseViewport(Number(v))}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BASE_VIEWPORTS.map((v) => (
              <SelectItem key={v} value={String(v)}>
                {v}px
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </>
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
          <span className="text-lg leading-none text-zinc-400 transition-transform group-data-[state=open]:rotate-90">
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
    <code className="rounded whitespace-nowrap h-8 flex items-center border border-input bg-input/30 px-2 py-1 font-mono text-d-xs tabular-nums">
      {size ? `w: ${size.w} × h: ${size.h}` : "— × —"}
    </code>
  );
}
