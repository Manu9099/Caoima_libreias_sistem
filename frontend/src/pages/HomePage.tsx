import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BookList } from "../components/books/BookList";
import { BookShelf } from "../components/books/BookShelf";
import { SearchBar } from "../components/books/SearchBar";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { useFavorites } from "../hooks/useFavorites";
import { useBooksSearch } from "../hooks/useBooksSearch";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useReadingHistory } from "../hooks/useReadingHistory";

const SORT_OPTIONS = [
  { value: "title_asc", label: "Título A-Z" },
  { value: "title_desc", label: "Título Z-A" },
  { value: "author_asc", label: "Autor A-Z" },
  { value: "author_desc", label: "Autor Z-A" },
  { value: "year_asc", label: "Año ascendente" },
  { value: "year_desc", label: "Año descendente" },
  { value: "downloads_desc", label: "Más descargados" },
  { value: "downloads_asc", label: "Menos descargados" },
];

function parsePage(value: string | null) {
  const parsed = Number(value ?? "1");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const page = parsePage(searchParams.get("page"));
  const sort = searchParams.get("sort") ?? "title_asc";

  const [inputValue, setInputValue] = useState(query);
  const debouncedInput = useDebouncedValue(inputValue, 500);

  const { favorites } = useFavorites();
  const { history } = useReadingHistory();

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    const trimmed = debouncedInput.trim();

    if (trimmed === query) return;

    const next = new URLSearchParams(searchParams);

    if (trimmed) {
      next.set("q", trimmed);
      next.set("page", "1");
    } else {
      next.delete("q");
      next.delete("page");
    }

    next.set("sort", sort);

    setSearchParams(next, { replace: true });
  }, [debouncedInput, query, searchParams, setSearchParams, sort]);

  const booksQuery = useBooksSearch(query, page, sort);

  const hasResults = useMemo(
    () => !!booksQuery.data && booksQuery.data.items.length > 0,
    [booksQuery.data]
  );

  const isQueryEmpty = !query.trim();

  const handleSearch = () => {
    const trimmed = inputValue.trim();
    const next = new URLSearchParams(searchParams);

    if (trimmed) {
      next.set("q", trimmed);
      next.set("page", "1");
    } else {
      next.delete("q");
      next.delete("page");
    }

    next.set("sort", sort);
    setSearchParams(next);
  };

  const handleSortChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("sort", value);

    if (query.trim()) {
      next.set("page", "1");
    }

    setSearchParams(next);
  };

  const handlePageChange = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Explora libros</h1>
        <p className="mt-2 text-sm text-slate-600">
          Busca títulos, autores y continúa donde te quedaste.
        </p>

        <div className="mt-5 space-y-4">
          <SearchBar
            value={inputValue}
            onChange={setInputValue}
            onSearch={handleSearch}
          />

          <div className="flex justify-end">
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {favorites.length > 0 && (
        <BookShelf
          title="Tus favoritos"
          description="Guardados temporalmente en este navegador."
          items={favorites.slice(0, 4)}
        />
      )}

      {history.length > 0 && (
        <BookShelf
          title="Seguir leyendo"
          description="Historial reciente con progreso guardado."
          items={history.slice(0, 4)}
        />
      )}

      {isQueryEmpty && (
        <EmptyState
          title="Escribe algo para buscar"
          description="Prueba con Frankenstein, Alice, Sherlock o Pride."
        />
      )}

      {!isQueryEmpty && booksQuery.isLoading && (
        <LoadingState message="Buscando libros..." />
      )}

      {!isQueryEmpty && booksQuery.isError && (
        <ErrorState message="No se pudieron cargar los libros." />
      )}

      {!isQueryEmpty && !booksQuery.isLoading && !booksQuery.isError && !hasResults && (
        <EmptyState
          title="No encontramos resultados"
          description="Prueba con otro título, autor o palabra clave."
        />
      )}

      {!isQueryEmpty && booksQuery.data && hasResults && (
        <BookList
          items={booksQuery.data.items}
          page={booksQuery.data.page}
          totalPages={booksQuery.data.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
