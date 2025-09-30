import "./App.css";
import { createBrowserRouter, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";
import Home from "./pages/home";
import Repo from "./pages/repo.$repo";
import { Repos } from "./pages/repos";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "repos",
        Component: Repos,
      },
      {
        path: "repo/:repo",
        Component: Repo,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
