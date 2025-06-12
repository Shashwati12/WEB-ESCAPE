
import './App.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Home from "./pages/Home";

const appRouter = createBrowserRouter([
  {
    path:"/",
    element:<Home/>
    
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/signup",
    element:<Signup/>
  }
]);
function App() {


  return (
    <>
     
      <RouterProvider router ={appRouter}/>
    </>
  )
}

export default App
