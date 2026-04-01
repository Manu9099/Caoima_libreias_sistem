import { Link, useParams } from "react-router-dom";
import { BookViewer } from "../components/books/BookViewer";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { useBookContent } from "../hooks/useBookContent";
import { useBookDetail } from "../hooks/useBookDetail";

export function BookDetailPage() {
  const { id = "" } = useParams();

  const bookQuery = useBookDetail(id);
  const contentQuery = useBookContent(id);

  if (!id) {
    return <ErrorState message="No se encontró el identificador del libro." />;
  }

  if (bookQuery.isLoading || contentQuery.isLoading) {
    return <LoadingState message="Cargando libro..." />;
  }

  if (bookQuery.isError || !bookQuery.data) {
    return <ErrorState message="No se pudo cargar el detalle del libro." />;
  }

  if (contentQuery.isError || !contentQuery.data) {
    return <ErrorState message="No se pudo cargar el contenido del libro." />;
  }

  const book = bookQuery.data;
  const content = contentQuery.data;

  return (
    <div className="space-y-6">
      <Link
        to="/"
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
              <h1 className="text-3xl font-bold text-slate-900">{book.title}</h1>
              <p className="mt-2 text-slate-600">
                {book.authors.map((author) => author.name).join(", ") || "Autor desconocido"}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Idiomas</p>
                <p className="mt-1 text-sm text-slate-800">
                  {book.languages.length > 0 ? book.languages.join(", ") : "—"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Descargas</p>
                <p className="mt-1 text-sm text-slate-800">{book.downloadCount}</p>
              </div>
            </div>

            {!book.formats.html && (
              <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-700">
                Este libro no trae HTML nativo. Se está mostrando una versión alternativa.
              </div>
            )}

            {book.subjects.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Temas</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {book.subjects.slice(0, 8).map((subject) => (
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
          </div>
        </div>
      </section>

      <BookViewer html={content.html} />
    </div>
  );
}