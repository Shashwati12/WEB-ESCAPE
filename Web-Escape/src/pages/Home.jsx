import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer"
const Home=()=>{
    const navigate = useNavigate();
 return(
   <div>
    <Navbar/>
     <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black text-white">
   
      <div className="flex flex-col items-center justify-center py-24 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Escape the Web</h1>
        <p className="text-lg md:text-xl mb-10 max-w-2xl">
          Solve web-based puzzles, unlock hidden clues, and escape the trap of the internet!
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-lg rounded-full transition"
        >
          Start Game
        </button>
      </div>
    </div>
    
   <Footer/>
   </div>

 )
}

export default Home;