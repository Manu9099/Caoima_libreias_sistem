import { RouterProvider } from "react-router-dom";
import { AppProviders } from "./providers";
import { router } from "./route";

export default function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}