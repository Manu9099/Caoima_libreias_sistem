import { Link } from "react-router-dom";
import type { BookListItem } from "../../types/book";
import type { LocalBookItem } from "../../utils/localLibrary";
import { FavoriteButton } from "./FavoriteButton";

type Props = {
  book: BookListItem | LocalBookItem;
};

export function BookCard({ book }: Props) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="relative -aspect-[3/4] bg-slate-100">
        <div className="absolute right-3 top-3 z-10">
          <FavoriteButton book={book} />
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
          <span>Año: {book.year ?? "—"}</span>
          <span>{book.downloadCount} descargas</span>
        </div>

        {!book.hasHtmlContent && (
          <div className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Este libro podría abrirse en modo texto plano.
          </div>
        )}

        {"progress" in book && typeof book.progress === "number" && book.progress > 0 && (
          <div className="rounded-xl bg-sky-50 px-3 py-2 text-xs text-sky-700">
            Progreso guardado: {book.progress}%
          </div>
        )}

        <Link
          to={`/books/${book.id}`}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Leer
        </Link>
      </div>
    </article>
  );
}
