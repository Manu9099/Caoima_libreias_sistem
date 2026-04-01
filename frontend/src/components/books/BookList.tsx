import type { BookListItem } from "../../types/book";
import { BookCard } from "./BookCard";

type Props = {
  items: BookListItem[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function BookList({ items, page, totalPages, onPageChange }: Props) {
  const canGoBack = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </section>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => canGoBack && onPageChange(page - 1)}
          disabled={!canGoBack}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Anterior
        </button>

        <span className="text-sm text-slate-600">
          Página {page} de {totalPages}
        </span>

        <button
          onClick={() => canGoNext && onPageChange(page + 1)}
          disabled={!canGoNext}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}