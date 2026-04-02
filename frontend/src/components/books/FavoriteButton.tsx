import type { BookDetail, BookListItem } from "../../types/book";
import { useFavorites } from "../../hooks/useFavorites";

type BookLike = BookListItem | BookDetail;

type Props = {
  book: BookLike;
  className?: string;
};

export function FavoriteButton({ book, className = "" }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(book.id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(book);
      }}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? "border-rose-200 bg-rose-50 text-rose-600"
          : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
      } ${className}`}
      aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
      title={active ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      {active ? "★ Favorito" : "☆ Favorito"}
    </button>
  );
}
