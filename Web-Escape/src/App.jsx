import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Home from "./pages/Home";
import FindObjectGame from "./rooms/easy/FindObjectGame";
import MatchQuestGame from "./rooms/easy/MatchOuest";

const routes = [
  { path: "/", element: <Home />},
  { path: "/login", element: <Login />},
  { path: "/signup", element: <Signup />},
  { path: "/level/find-object", element: <FindObjectGame />},
  { path: "/level/match-quest", element: <MatchQuestGame />},
];

const router = createBrowserRouter(routes);

export default function App() {
  return <RouterProvider router={router} />;
}
