import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { OpenLibraryList } from "../components/books/OpenLibraryList";
import { SearchBar } from "../components/books/SearchBar";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useOpenLibrarySearch } from "../hooks/useOpenLibrarySearch";

function parsePage(value: string | null) {
  const parsed = Number(value ?? "1");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function parseYear(value: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function OpenLibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const page = parsePage(searchParams.get("page"));
  const genre = searchParams.get("genre") ?? "";
  const language = searchParams.get("language") ?? "";
  const yearFrom = parseYear(searchParams.get("yearFrom"));
  const yearTo = parseYear(searchParams.get("yearTo"));
  const readableOnly = searchParams.get("readableOnly") === "true";

  const [inputValue, setInputValue] = useState(query);
  const [genreInput, setGenreInput] = useState(genre);
  const [languageInput, setLanguageInput] = useState(language);
  const [yearFromInput, setYearFromInput] = useState(yearFrom?.toString() ?? "");
  const [yearToInput, setYearToInput] = useState(yearTo?.toString() ?? "");
  const [readableOnlyInput, setReadableOnlyInput] = useState(readableOnly);

  const debouncedInput = useDebouncedValue(inputValue, 500);

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

    setSearchParams(next, { replace: true });
  }, [debouncedInput, query, searchParams, setSearchParams]);

  const booksQuery = useOpenLibrarySearch({
    q: query,
    page,
    genre: genre || undefined,
    language: language || undefined,
    yearFrom,
    yearTo,
    readableOnly,
  });

  const hasResults = useMemo(
    () => !!booksQuery.data && booksQuery.data.items.length > 0,
    [booksQuery.data]
  );

  const isQueryEmpty = !query.trim();

  const applyFilters = () => {
    const next = new URLSearchParams(searchParams);
    const trimmed = inputValue.trim();

    if (trimmed) {
      next.set("q", trimmed);
      next.set("page", "1");
    } else {
      next.delete("q");
      next.delete("page");
    }

    if (genreInput.trim()) next.set("genre", genreInput.trim());
    else next.delete("genre");

    if (languageInput.trim()) next.set("language", languageInput.trim().toLowerCase());
    else next.delete("language");

    if (yearFromInput.trim()) next.set("yearFrom", yearFromInput.trim());
    else next.delete("yearFrom");

    if (yearToInput.trim()) next.set("yearTo", yearToInput.trim());
    else next.delete("yearTo");

    if (readableOnlyInput) next.set("readableOnly", "true");
    else next.delete("readableOnly");

    setSearchParams(next);
  };

  const clearFilters = () => {
    setGenreInput("");
    setLanguageInput("");
    setYearFromInput("");
    setYearToInput("");
    setReadableOnlyInput(false);

    const next = new URLSearchParams(searchParams);
    next.delete("genre");
    next.delete("language");
    next.delete("yearFrom");
    next.delete("yearTo");
    next.delete("readableOnly");
    next.set("page", "1");
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
        <h1 className="text-3xl font-bold text-slate-900">Open Library</h1>
        <p className="mt-2 text-sm text-slate-600">
          Busca obras, filtra por género, idioma y año, y revisa disponibilidad de lectura o préstamo.
        </p>

        <div className="mt-5 space-y-4">
          <SearchBar
            value={inputValue}
            onChange={setInputValue}
            onSearch={applyFilters}
          />

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <input
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              placeholder="Género / subject"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
            />

            <input
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
              placeholder="Idioma: eng, spa, fre"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
            />

            <input
              value={yearFromInput}
              onChange={(e) => setYearFromInput(e.target.value)}
              placeholder="Año desde"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
            />

            <input
              value={yearToInput}
              onChange={(e) => setYearToInput(e.target.value)}
              placeholder="Año hasta"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
            />

            <label className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={readableOnlyInput}
                onChange={(e) => setReadableOnlyInput(e.target.checked)}
              />
              Solo legibles
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={applyFilters}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
            >
              Aplicar filtros
            </button>

            <button
              onClick={clearFilters}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700"
            >
              Limpiar
            </button>
          </div>
        </div>
      </section>

      {isQueryEmpty && (
        <EmptyState
          title="Escribe algo para buscar"
          description="Prueba con Sherlock, Alice, Pride o Frankenstein."
        />
      )}

      {!isQueryEmpty && booksQuery.isLoading && (
        <LoadingState message="Buscando en Open Library..." />
      )}

      {!isQueryEmpty && booksQuery.isError && (
        <ErrorState message="No se pudieron cargar las obras de Open Library." />
      )}

      {!isQueryEmpty && !booksQuery.isLoading && !booksQuery.isError && !hasResults && (
        <EmptyState
          title="No encontramos resultados"
          description="Prueba con otros filtros o una búsqueda más amplia."
        />
      )}

      {!isQueryEmpty && booksQuery.data && hasResults && (
        <OpenLibraryList
          items={booksQuery.data.items}
          page={booksQuery.data.page}
          totalPages={booksQuery.data.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}