"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

interface InspectInfo {
  family: string;
  size: string;
  weight: string;
  lineHeight: string;
  letterSpacing: string;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  display: string;
  flexDirection: string;
  gap: string;
  rowGap: string;
  columnGap: string;
  rect: DOMRect;
  // cursor position (used only in hover mode)
  x: number;
  y: number;
}

function parsePx(value: string): number {
  return parseFloat(value) || 0;
}

function formatPx(value: number): string {
  return value === 0 ? "0" : `${Math.round(value * 100) / 100}px`;
}

/** Round any numbers in a CSS value string to at most 2 decimal places */
function formatVal(value: string): string {
  return value.replace(/\d+\.\d+/g, (m) => {
    const n = parseFloat(m);
    return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
  });
}

function createHatchPattern(ctx: CanvasRenderingContext2D, color: string): CanvasPattern | null {
  const size = 6;
  const off = document.createElement("canvas");
  off.width = size;
  off.height = size;
  const offCtx = off.getContext("2d");
  if (!offCtx) return null;
  offCtx.strokeStyle = color;
  offCtx.lineWidth = 1;
  offCtx.beginPath();
  offCtx.moveTo(0, size);
  offCtx.lineTo(size, 0);
  offCtx.stroke();
  return ctx.createPattern(off, "repeat");
}

function computeGapRects(
  el: HTMLElement,
  style: CSSStyleDeclaration,
  contentLeft: number,
  contentTop: number,
  contentWidth: number,
  contentHeight: number,
): DOMRect[] {
  const children = Array.from(el.children) as HTMLElement[];
  if (children.length < 2) return [];

  const rects: DOMRect[] = [];
  const display = style.display;
  const isFlex = display.includes("flex");
  const isGrid = display.includes("grid");

  if (isFlex) {
    const dir = style.flexDirection;
    const isRow = dir === "row" || dir === "row-reverse";
    const childRects = children
      .map((c) => c.getBoundingClientRect())
      .filter((r) => r.width > 0 && r.height > 0);

    if (isRow) {
      childRects.sort((a, b) => a.left - b.left);
      for (let i = 0; i < childRects.length - 1; i++) {
        const gapWidth = childRects[i + 1].left - childRects[i].right;
        if (gapWidth > 0.5) {
          rects.push(new DOMRect(childRects[i].right, contentTop, gapWidth, contentHeight));
        }
      }
    } else {
      childRects.sort((a, b) => a.top - b.top);
      for (let i = 0; i < childRects.length - 1; i++) {
        const gapHeight = childRects[i + 1].top - childRects[i].bottom;
        if (gapHeight > 0.5) {
          rects.push(new DOMRect(contentLeft, childRects[i].bottom, contentWidth, gapHeight));
        }
      }
    }
  } else if (isGrid) {
    const childRects = children
      .map((c) => c.getBoundingClientRect())
      .filter((r) => r.width > 0 && r.height > 0);
    if (childRects.length === 0) return [];

    const SNAP = 2;
    const snap = (v: number) => Math.round(v / SNAP) * SNAP;

    const rowMap = new Map<number, DOMRect[]>();
    for (const r of childRects) {
      const key = snap(r.top);
      const row = rowMap.get(key);
      if (row) row.push(r);
      else rowMap.set(key, [r]);
    }

    const rows = [...rowMap.entries()]
      .sort(([a], [b]) => a - b)
      .map(([, items]) => items);

    for (let i = 0; i < rows.length - 1; i++) {
      const rowBottom = Math.max(...rows[i].map((r) => r.bottom));
      const nextRowTop = Math.min(...rows[i + 1].map((r) => r.top));
      const gapHeight = nextRowTop - rowBottom;
      if (gapHeight > 0.5) {
        rects.push(new DOMRect(contentLeft, rowBottom, contentWidth, gapHeight));
      }
    }

    for (const row of rows) {
      const sorted = [...row].sort((a, b) => a.left - b.left);
      const rowTop = Math.min(...sorted.map((r) => r.top));
      const rowBottom = Math.max(...sorted.map((r) => r.bottom));
      const rowHeight = rowBottom - rowTop;
      for (let i = 0; i < sorted.length - 1; i++) {
        const gapWidth = sorted[i + 1].left - sorted[i].right;
        if (gapWidth > 0.5) {
          rects.push(new DOMRect(sorted[i].right, rowTop, gapWidth, rowHeight));
        }
      }
    }
  }

  return rects;
}

/** Read all inspect info from a DOM element */
function readElementInfo(el: HTMLElement, cursorX: number, cursorY: number): InspectInfo {
  const style = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  return {
    family: style.fontFamily.split(",")[0].trim().replace(/^["']|["']$/g, ""),
    size: style.fontSize,
    weight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    paddingTop: parsePx(style.paddingTop),
    paddingRight: parsePx(style.paddingRight),
    paddingBottom: parsePx(style.paddingBottom),
    paddingLeft: parsePx(style.paddingLeft),
    marginTop: parsePx(style.marginTop),
    marginRight: parsePx(style.marginRight),
    marginBottom: parsePx(style.marginBottom),
    marginLeft: parsePx(style.marginLeft),
    display: style.display,
    flexDirection: style.flexDirection,
    gap: style.gap,
    rowGap: style.rowGap,
    columnGap: style.columnGap,
    rect,
    x: cursorX,
    y: cursorY,
  };
}

function drawOverlays(
  canvas: HTMLCanvasElement,
  info: InspectInfo,
  targetEl: HTMLElement | null,
) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const { rect, paddingTop, paddingRight, paddingBottom, paddingLeft, marginTop, marginRight, marginBottom, marginLeft } = info;

  // Margin (orange)
  ctx.fillStyle = "rgba(246, 178, 107, 0.25)";
  ctx.fillRect(rect.left - marginLeft, rect.top - marginTop, rect.width + marginLeft + marginRight, marginTop);
  ctx.fillRect(rect.left - marginLeft, rect.bottom, rect.width + marginLeft + marginRight, marginBottom);
  ctx.fillRect(rect.left - marginLeft, rect.top, marginLeft, rect.height);
  ctx.fillRect(rect.right, rect.top, marginRight, rect.height);

  // Padding (green)
  ctx.fillStyle = "rgba(147, 196, 125, 0.35)";
  ctx.fillRect(rect.left, rect.top, rect.width, paddingTop);
  ctx.fillRect(rect.left, rect.bottom - paddingBottom, rect.width, paddingBottom);
  ctx.fillRect(rect.left, rect.top + paddingTop, paddingLeft, rect.height - paddingTop - paddingBottom);
  ctx.fillRect(rect.right - paddingRight, rect.top + paddingTop, paddingRight, rect.height - paddingTop - paddingBottom);

  // Content (blue)
  const contentLeft = rect.left + paddingLeft;
  const contentTop = rect.top + paddingTop;
  const contentWidth = rect.width - paddingLeft - paddingRight;
  const contentHeight = rect.height - paddingTop - paddingBottom;

  ctx.fillStyle = "rgba(111, 168, 220, 0.25)";
  ctx.fillRect(contentLeft, contentTop, contentWidth, contentHeight);

  // Gap overlays (purple hatched)
  if (targetEl && (info.display.includes("flex") || info.display.includes("grid"))) {
    const style = getComputedStyle(targetEl);
    const gapRects = computeGapRects(targetEl, style, contentLeft, contentTop, contentWidth, contentHeight);

    if (gapRects.length > 0) {
      ctx.fillStyle = "rgba(192, 132, 252, 0.2)";
      for (const gr of gapRects) ctx.fillRect(gr.x, gr.y, gr.width, gr.height);

      const pattern = createHatchPattern(ctx, "rgba(192, 132, 252, 0.45)");
      if (pattern) {
        ctx.fillStyle = pattern;
        for (const gr of gapRects) ctx.fillRect(gr.x, gr.y, gr.width, gr.height);
      }

      ctx.strokeStyle = "rgba(192, 132, 252, 0.6)";
      ctx.lineWidth = 1;
      for (const gr of gapRects) ctx.strokeRect(gr.x, gr.y, gr.width, gr.height);
    }
  }

  // Border outline
  ctx.strokeStyle = "rgba(111, 168, 220, 0.8)";
  ctx.lineWidth = 1;
  ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
}

export function Inspector() {
  const [active, setActive] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [info, setInfo] = useState<InspectInfo | null>(null);
  const hoveredElRef = useRef<HTMLElement | null>(null);
  const pinnedElRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // --- Refresh pinned element info ---
  const refreshPinned = useCallback(() => {
    const el = pinnedElRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setInfo(readElementInfo(el, rect.right + 16, rect.top));
  }, []);

  // --- Hover handler (only when not pinned) ---
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (pinnedElRef.current) return; // skip while pinned
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el || !(el instanceof HTMLElement)) {
      setInfo(null);
      hoveredElRef.current = null;
      return;
    }
    if (el.closest("[data-inspector]")) return;
    hoveredElRef.current = el;
    setInfo(readElementInfo(el, e.clientX, e.clientY));
  }, []);

  // --- Click handler: pin to element ---
  const handleClick = useCallback((e: MouseEvent) => {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el || !(el instanceof HTMLElement)) return;
    if (el.closest("[data-inspector]")) return;

    e.preventDefault();
    e.stopPropagation();

    pinnedElRef.current = el;
    hoveredElRef.current = el;
    setPinned(true);
    const rect = el.getBoundingClientRect();
    setInfo(readElementInfo(el, rect.right + 16, rect.top));
  }, []);

  // --- Draw canvas whenever info changes ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !info) return;
    const targetEl = pinnedElRef.current || hoveredElRef.current;
    drawOverlays(canvas, info, targetEl);
  }, [info]);

  // --- ResizeObserver + window resize for pinned element ---
  useEffect(() => {
    if (!pinned || !pinnedElRef.current) return;

    const ro = new ResizeObserver(refreshPinned);
    ro.observe(pinnedElRef.current);

    window.addEventListener("resize", refreshPinned);
    window.addEventListener("scroll", refreshPinned, true);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", refreshPinned);
      window.removeEventListener("scroll", refreshPinned, true);
    };
  }, [pinned, refreshPinned]);

  // --- Clear on deactivate ---
  useEffect(() => {
    if (!active) {
      setInfo(null);
      setPinned(false);
      hoveredElRef.current = null;
      pinnedElRef.current = null;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [active]);

  // --- Keyboard & mouse listeners ---
  useEffect(() => {
    if (!active) {
      setInfo(null);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (pinnedElRef.current) {
          // First Escape: unpin, go back to hover mode
          pinnedElRef.current = null;
          setPinned(false);
        } else {
          // Second Escape: deactivate
          setActive(false);
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, handleMouseMove, handleClick]);

  const hasMargin = info && (info.marginTop || info.marginRight || info.marginBottom || info.marginLeft);
  const hasPadding = info && (info.paddingTop || info.paddingRight || info.paddingBottom || info.paddingLeft);
  const isFlexOrGrid = info && (info.display.includes("flex") || info.display.includes("grid"));

  // --- Tooltip positioning with viewport collision avoidance ---
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (!info) {
      setVisible(false);
      return;
    }

    const { rect } = info;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Hide if target element is completely out of viewport
    if (rect.bottom <= 0 || rect.top >= vh || rect.right <= 0 || rect.left >= vw) {
      setVisible(false);
      return;
    }

    setVisible(true);

    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    const tipRect = tooltip.getBoundingClientRect();
    const gap = 8;
    const tw = tipRect.width;
    const th = tipRect.height;

    // Vertically align to the target element's top, clamped within viewport
    const clampTop = (t: number) => Math.max(gap, Math.min(t, vh - th - gap));
    const alignedTop = clampTop(rect.top);

    // Try right of target element
    const rightLeft = rect.right + gap;
    if (rightLeft + tw + gap <= vw) {
      setTooltipPos({ top: alignedTop, left: rightLeft });
      return;
    }

    // Try left of target element
    const leftLeft = rect.left - tw - gap;
    if (leftLeft >= gap) {
      setTooltipPos({ top: alignedTop, left: leftLeft });
      return;
    }

    // No room on either side — place over the element, centered horizontally
    const overLeft = Math.max(gap, Math.min(rect.left + (rect.width - tw) / 2, vw - tw - gap));
    const overTop = Math.max(gap, Math.min(rect.top + (rect.height - th) / 2, vh - th - gap));
    setTooltipPos({ top: overTop, left: overLeft });
  }, [info]);

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant={active ? "default" : "outline"}
        onClick={() => setActive((a) => !a)}
        aria-pressed={active}
        data-inspector
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <rect x="7" y="7" width="10" height="10" />
        </svg>
        Inspect
      </Button>

      {mounted &&
        createPortal(
          <>
            <canvas
              ref={canvasRef}
              data-inspector
              className="fixed inset-0 z-[9999] pointer-events-none"
              style={{ display: active && info && visible ? "block" : "none" }}
            />

            {active && info && visible && (
              <div
                ref={tooltipRef}
                data-inspector
                style={tooltipPos}
                className="fixed z-[10000] pointer-events-none w-56 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-mono text-zinc-100 shadow-lg"
              >
                {pinned && (
                  <div className="mb-1.5 pb-1.5 font-semibold border-b border-zinc-700/60 flex items-center gap-2 text-[10px] uppercase tracking-wider text-foreground">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Esc to unpin
                  </div>
                )}

                {/* Font section */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">
                    Font
                  </span>
                  <span>
                    <span className="text-zinc-400">family: </span>
                    {info.family}
                  </span>
                  <span>
                    <span className="text-zinc-400">size: </span>
                    {formatVal(info.size)}
                  </span>
                  <span>
                    <span className="text-zinc-400">weight: </span>
                    {info.weight}
                  </span>
                  <span>
                    <span className="text-zinc-400">line-height: </span>
                    {formatVal(info.lineHeight)}
                  </span>
                  <span>
                    <span className="text-zinc-400">letter-spacing: </span>
                    {formatVal(info.letterSpacing)}
                  </span>
                </div>

                {/* Spacing section */}
                {(hasPadding || hasMargin) && (
                  <div className="flex flex-col gap-0.5 mt-2 pt-2 border-t border-zinc-700/60">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">
                      Spacing
                    </span>
                    {hasPadding && (
                      <span>
                        <span className="text-green-400/80">padding: </span>
                        {formatPx(info.paddingTop)} {formatPx(info.paddingRight)}{" "}
                        {formatPx(info.paddingBottom)} {formatPx(info.paddingLeft)}
                      </span>
                    )}
                    {hasMargin && (
                      <span>
                        <span className="text-orange-400/80">margin: </span>
                        {formatPx(info.marginTop)} {formatPx(info.marginRight)}{" "}
                        {formatPx(info.marginBottom)} {formatPx(info.marginLeft)}
                      </span>
                    )}
                  </div>
                )}

                {/* Layout section */}
                {isFlexOrGrid && (
                  <div className="flex flex-col gap-0.5 mt-2 pt-2 border-t border-zinc-700/60">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">
                      Layout
                    </span>
                    <span>
                      <span className="text-purple-400/80">display: </span>
                      {info.display}
                    </span>
                    {info.gap !== "normal" && info.gap !== "0px" && info.rowGap === info.columnGap && (
                      <span>
                        <span className="text-purple-400/80">gap: </span>
                        {formatVal(info.gap)}
                      </span>
                    )}
                    {info.gap !== "normal" && info.gap !== "0px" && info.rowGap !== info.columnGap && (
                      <>
                        <span>
                          <span className="text-purple-400/80">row-gap: </span>
                          {formatVal(info.rowGap)}
                        </span>
                        <span>
                          <span className="text-purple-400/80">column-gap: </span>
                          {formatVal(info.columnGap)}
                        </span>
                      </>
                    )}
                  </div>
                )}

                {/* Box size */}
                <div className="flex flex-col gap-0.5 mt-2 pt-2 border-t border-zinc-700/60">
                  <span>
                    <span className="text-blue-400/80">size: </span>
                    {Math.round(info.rect.width)} x {Math.round(info.rect.height)}
                  </span>
                </div>
              </div>
            )}
          </>,
          document.body,
        )}
    </>
  );
}
