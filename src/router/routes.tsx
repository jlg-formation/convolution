import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Demo from "../pages/Demo";
import Learn from "../pages/Learn";
import QuizPage from "../pages/QuizPage";
import About from "../pages/About";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, element: <Home /> },
        { path: "demo", element: <Demo /> },
        { path: "learn", element: <Learn /> },
        { path: "quiz", element: <QuizPage /> },
        { path: "about", element: <About /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
