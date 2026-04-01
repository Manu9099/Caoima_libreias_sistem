type Props = {
  message?: string;
};

export function ErrorState({ message = "Ocurrió un error." }: Props) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
      <p className="text-sm text-red-700">{message}</p>
    </div>
  );
}