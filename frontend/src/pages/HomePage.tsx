import { useMemo, useState } from "react";
import { BookList } from "../components/books/BookList";
import { SearchBar } from "../components/books/SearchBar";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { useBooksSearch } from "../hooks/useBooksSearch";

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

export function HomePage() {
  const [inputValue, setInputValue] = useState("harry");
  const [query, setQuery] = useState("harry");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("title_asc");

  const booksQuery = useBooksSearch(query, page, sort);

  const hasResults = useMemo(
    () => !!booksQuery.data && booksQuery.data.items.length > 0,
    [booksQuery.data]
  );

  const isQueryEmpty = !query.trim();

  const handleSearch = () => {
    const trimmed = inputValue.trim();

    if (!trimmed) {
      setPage(1);
      setQuery("");
      return;
    }

    setPage(1);
    setQuery(trimmed);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Explora libros</h1>
        <p className="mt-2 text-sm text-slate-600">
          Busca títulos, autores y abre el lector HTML embebido.
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
              onChange={(e) => {
                setPage(1);
                setSort(e.target.value);
              }}
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

      {isQueryEmpty && (
        <EmptyState
          title="Escribe algo para buscar"
          description="Prueba con un título, autor o palabra clave como Frankenstein, Alice o Sherlock."
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
          onPageChange={setPage}
        />
      )}
    </div>
  );
}