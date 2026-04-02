import { Link, useParams } from "react-router-dom";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { useOpenLibraryDetail } from "../hooks/useOpenLibraryDetail";
import { useOpenLibraryReadOptions } from "../hooks/useOpenLibraryReadOptions";

export function OpenLibraryDetailPage() {
  const { workId = "" } = useParams();

  const detailQuery = useOpenLibraryDetail(workId);
  const readOptionsQuery = useOpenLibraryReadOptions(workId);

  if (!workId) {
    return <ErrorState message="No se encontró el identificador de la obra." />;
  }

  if (detailQuery.isLoading) {
    return <LoadingState message="Cargando obra..." />;
  }

  if (detailQuery.isError || !detailQuery.data) {
    return <ErrorState message="No se pudo cargar el detalle de la obra." />;
  }

  const book = detailQuery.data;
  const readOptions = readOptionsQuery.data;

  return (
    <div className="space-y-6">
      <Link
        to="/open-library"
        className="inline-flex rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
      >
        Volver
      </Link>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full max-w-xs overflow-hidden rounded-3xl bg-slate-100">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex -aspect-[3/4] items-center justify-center text-sm text-slate-400">
                Sin portada
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <div className="mb-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                Open Library
              </div>

              <h1 className="text-3xl font-bold text-slate-900">{book.title}</h1>

              <p className="mt-2 text-slate-600">
                {book.authors.length > 0 ? book.authors.join(", ") : "Autor no disponible"}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Año</p>
                <p className="mt-1 text-sm text-slate-800">{book.firstPublishYear ?? "—"}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Idiomas</p>
                <p className="mt-1 text-sm text-slate-800">
                  {book.languages.length > 0 ? book.languages.join(", ") : "—"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Ediciones</p>
                <p className="mt-1 text-sm text-slate-800">{book.editionCount}</p>
              </div>
            </div>

            {book.description && (
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Descripción</h2>
                <p className="mt-2 text-sm leading-7 text-slate-700">{book.description}</p>
              </div>
            )}

            {book.subjects.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Temas</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {book.subjects.slice(0, 10).map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-sm font-semibold text-slate-900">Opciones</h2>

              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href={readOptions?.readUrl || `https://openlibrary.org/works/${workId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                >
                  Ver en Open Library
                </a>

                {readOptions?.borrowUrl && (
                  <a
                    href={readOptions.borrowUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    Ver préstamo
                  </a>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {readOptions?.canReadOnline && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                    Lectura disponible
                  </span>
                )}

                {readOptions?.canBorrow && (
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">
                    Préstamo disponible
                  </span>
                )}

                {readOptions?.availabilityStatus && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    Estado: {readOptions.availabilityStatus}
                  </span>
                )}

                {readOptionsQuery.isError && (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                    Opciones de lectura no disponibles ahora
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}