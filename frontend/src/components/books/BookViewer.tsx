import DOMPurify from "dompurify";

type Props = {
  html: string;
};

export function BookViewer({ html }: Props) {
  const safeHtml = DOMPurify.sanitize(html, {
    WHOLE_DOCUMENT: true,
  });

  return (
    <iframe
      title="Book Viewer"
      srcDoc={safeHtml}
      sandbox="allow-same-origin"
      className="h-[80vh] w-full rounded-3xl border border-slate-200 bg-white shadow-sm"
    />
  );
}