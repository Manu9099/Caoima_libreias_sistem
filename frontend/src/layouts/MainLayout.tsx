import { Link, NavLink, Outlet } from "react-router-dom";

function navClassName(isActive: boolean) {
  return isActive
    ? "rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
    : "rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100";
}

export function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="text-xl font-bold text-slate-900">
            Bookify
          </Link>

          <nav className="flex flex-wrap gap-2">
            <NavLink to="/" end className={({ isActive }) => navClassName(isActive)}>
              Gutendex
            </NavLink>

            <NavLink
              to="/open-library"
              className={({ isActive }) => navClassName(isActive)}
            >
              Open Library
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}