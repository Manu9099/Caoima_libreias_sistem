type Props = {
  message?: string;
};

export function LoadingState({ message = "Cargando..." }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  );
}