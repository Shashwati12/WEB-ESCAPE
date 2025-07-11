import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Home from "./pages/Home";
import LevelRouter from "./components/LevelRouter";
import Dashboard from "./components/Dashboard";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {path : "/dashboard" , element: <Dashboard />},
  { path: "/level/:id", element: <LevelRouter /> },
];

const router = createBrowserRouter(routes);

export default function App() {
 return (
  
     <RouterProvider router={router} />

  

 );

}
