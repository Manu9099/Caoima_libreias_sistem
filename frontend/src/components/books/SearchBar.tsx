type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
};

export function SearchBar({ value, onChange, onSearch }: Props) {
  const isDisabled = !value.trim();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isDisabled) {
            onSearch();
          }
        }}
        placeholder="Buscar libros, autores o temas..."
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-500"
      />

      <button
        onClick={onSearch}
        disabled={isDisabled}
        className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Buscar
      </button>
    </div>
  );
}
