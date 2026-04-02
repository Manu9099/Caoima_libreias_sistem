
import type { BookListItem } from "../../types/book";
import type { LocalBookItem } from "../../utils/localLibrary";
import { BookCard } from "./BookCard";

type Props = {
  title: string;
  description?: string;
  items: Array<BookListItem | LocalBookItem>;
};

export function BookShelf({ title, description, items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}