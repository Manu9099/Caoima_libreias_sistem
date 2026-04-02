import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { BookDetailPage } from "../pages/BookDetailPage";
import { HomePage } from "../pages/HomePage";
import { OpenLibraryDetailPage } from "../pages/OpenLibraryDetailPage";
import { OpenLibraryPage } from "../pages/OpenLibraryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "books/:id",
        element: <BookDetailPage />,
      },
      {
        path: "open-library",
        element: <OpenLibraryPage />,
      },
      {
        path: "open-library/:workId",
        element: <OpenLibraryDetailPage />,
      },
    ],
  },
]);