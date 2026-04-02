import { Link } from "react-router-dom";
import type { OpenLibraryBookListItem } from "../../types/book";

type Props = {
  book: OpenLibraryBookListItem;
};

export function OpenLibraryCard({ book }: Props) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="relative -aspect-[3/4] bg-slate-100">
        <div className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700">
          Open Library
        </div>

        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Sin portada
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
            {book.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-slate-600">{book.author}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Año: {book.firstPublishYear ?? "—"}</span>
          <span>{book.editionCount} ediciones</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {book.isReadableOnline && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
              Lectura disponible
            </span>
          )}

          {book.isBorrowable && (
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-700">
              Préstamo disponible
            </span>
          )}

          {!book.isReadableOnline && !book.isBorrowable && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
              Ver detalles
            </span>
          )}
        </div>

        <Link
          to={`/open-library/${book.workId}`}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Ver obra
        </Link>
      </div>
    </article>
  );
}