


import DOMPurify from "dompurify";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getReadingProgress,
  saveReadingProgress,
} from "../../utils/localLibrary";

type ViewerTheme = "paper" | "sepia" | "night";

type Props = {
  bookId: number;
  html: string;
};

function buildViewerHtml(
  originalHtml: string,
  fontScale: number,
  theme: ViewerTheme
) {
  const themeStyles =
    theme === "night"
      ? {
          background: "#0f172a",
          color: "#e2e8f0",
        }
      : theme === "sepia"
      ? {
          background: "#f7f1e3",
          color: "#3f2f1f",
        }
      : {
          background: "#ffffff",
          color: "#111827",
        };

  const extraCss = `
    html {
      scroll-behavior: smooth;
    }

    body {
      max-width: 860px;
      margin: 0 auto;
      padding: 2rem 1.25rem 4rem;
      font-family: Georgia, serif;
      font-size: ${fontScale}rem;
      line-height: 1.8;
      background: ${themeStyles.background};
      color: ${themeStyles.color};
      word-break: break-word;
    }

    img {
      max-width: 100%;
      height: auto;
    }

    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: Georgia, serif;
    }

    table {
      max-width: 100%;
      overflow-x: auto;
      display: block;
    }

    a {
      color: inherit;
    }
  `;

  if (originalHtml.includes("</head>")) {
    return originalHtml.replace("</head>", `<style>${extraCss}</style></head>`);
  }

  if (originalHtml.includes("<html")) {
    return originalHtml.replace("<html", `<html style="background:${themeStyles.background};"`);
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>${extraCss}</style>
      </head>
      <body>
        ${originalHtml}
      </body>
    </html>
  `;
}

export function BookViewer({ bookId, html }: Props) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const cleanupRef = useRef<null | (() => void)>(null);

  const [fontScale, setFontScale] = useState(1);
  const [theme, setTheme] = useState<ViewerTheme>("paper");
  const [progress, setProgress] = useState(
    () => getReadingProgress(bookId)?.percentage ?? 0
  );

  const sanitizedHtml = useMemo(
    () =>
      DOMPurify.sanitize(html, {
        WHOLE_DOCUMENT: true,
      }),
    [html]
  );

  const renderedHtml = useMemo(
    () => buildViewerHtml(sanitizedHtml, fontScale, theme),
    [sanitizedHtml, fontScale, theme]
  );

  const attachScrollTracking = useCallback(() => {
    cleanupRef.current?.();

    const iframe = iframeRef.current;
    if (!iframe?.contentWindow || !iframe.contentDocument) return;

    const win = iframe.contentWindow;
    const doc = iframe.contentDocument;

    const restore = getReadingProgress(bookId);

    const restoreTimer = window.setTimeout(() => {
      if (restore?.scrollTop && restore.scrollTop > 0) {
        win.scrollTo({ top: restore.scrollTop, behavior: "auto" });
      }
    }, 150);

    let saveTimer: number | null = null;

    const saveCurrentProgress = () => {
      const docEl = doc.documentElement;
      const body = doc.body;

      const scrollTop =
        win.scrollY ||
        docEl.scrollTop ||
        body.scrollTop ||
        0;

      const scrollHeight = Math.max(
        docEl.scrollHeight,
        body.scrollHeight
      );

      const clientHeight = Math.max(
        win.innerHeight,
        docEl.clientHeight,
        body.clientHeight
      );

      const maxScroll = Math.max(scrollHeight - clientHeight, 1);
      const percentage = Math.min(
        100,
        Math.max(0, Math.round((scrollTop / maxScroll) * 100))
      );

      saveReadingProgress(bookId, percentage, scrollTop);
      setProgress(percentage);
    };

    const handleScroll = () => {
      if (saveTimer) {
        window.clearTimeout(saveTimer);
      }

      saveTimer = window.setTimeout(saveCurrentProgress, 120);
    };

    win.addEventListener("scroll", handleScroll, { passive: true });

    cleanupRef.current = () => {
      win.removeEventListener("scroll", handleScroll);
      window.clearTimeout(restoreTimer);
      if (saveTimer) window.clearTimeout(saveTimer);
    };
  }, [bookId]);

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  const handleResume = () => {
    const iframe = iframeRef.current;
    const saved = getReadingProgress(bookId);

    if (!iframe?.contentWindow || !saved) return;

    iframe.contentWindow.scrollTo({
      top: saved.scrollTop,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
          Progreso: {progress}%
        </div>

        <button
          type="button"
          onClick={handleResume}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
        >
          Reanudar lectura
        </button>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFontScale((value) => Math.max(0.9, +(value - 0.1).toFixed(1)))}
            className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            A-
          </button>

          <button
            type="button"
            onClick={() => setFontScale(1)}
            className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={() => setFontScale((value) => Math.min(1.5, +(value + 0.1).toFixed(1)))}
            className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            A+
          </button>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as ViewerTheme)}
            className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="paper">Papel</option>
            <option value="sepia">Sepia</option>
            <option value="night">Noche</option>
          </select>
        </div>
      </div>

      <iframe
        ref={iframeRef}
        title="Book Viewer"
        srcDoc={renderedHtml}
        sandbox="allow-same-origin"
        onLoad={attachScrollTracking}
        className="h-[80vh] w-full rounded-3xl border border-slate-200 bg-white shadow-sm"
      />
    </div>
  );
}
