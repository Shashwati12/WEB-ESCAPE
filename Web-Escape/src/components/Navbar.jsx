

// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";

// import axios from "axios";
// import { USER_API_POINT } from "../utils/Apicall";

// function Navbar() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

 

//   const handleLogout = async () => {
//     console.log("logout button clicked");
//     try {
//       const res=await axios.get(`${USER_API_POINT}/logout`, {
//         withCredentials: true,
//       });
//       console.log("logout response", res.data);
//       setUser(null); // Clear user data on logout
//        console.log("User state cleared, navigating...");
//       navigate("/login");
//     } catch (err) {
//       console.error("Logout failed");
//     }
//   };


//   return (
//     <div className="bg-white shadow sticky top-0 z-50">
//       <div className="flex justify-between items-center max-w-7xl mx-auto px-4 h-20">
//           <Link to="/" className="text-xl font-bold tracking-wide text-blue-400">
//          EscapeTheWeb
//       </Link>


//         <ul className="flex items-center gap-6 text-lg text-gray-700 font-medium">
//           <li>
//             <Link to="/" className="hover:text-blue-300 transition">Home</Link>
//           </li>
//           <li>
//             <Link to="/rooms"  className="hover:text-blue-300 transition"></Link>
//           </li>
//           <li>
//             <Link to="/leaderboard" className="hover:text-blue-300 transition">Leaderboard</Link>
//           </li>
//            <Link to="/profile" className="hover:text-blue-300 transition">
//           Profile
//         </Link>
//         </ul>

//         <div className="flex items-center gap-4">
//           {user ? (
//             <div className="flex gap-4">
              
                
       
              

//               <button
//                 onClick={handleLogout}
//                 className="flex items-center text-red-600 font-medium border border-red-600 px-4 py-1 rounded-md hover:bg-red-50"
//               >
//                 <Logout fontSize="small" /> Logout
//               </button>
//             </div>
//           ) : (
//             <div className="flex gap-4">
//               <Link to="/login">
//                 <button className="border border-blue-600 text-blue-600 px-4 py-1 rounded-md hover:bg-blue-50">
//                   Login
//                 </button>
//               </Link>
//               <Link to="/signup">
//                 <button className="border border-green-600 text-green-600 px-4 py-1 rounded-md hover:bg-green-50">
//                   Sign Up
//                 </button>
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Navbar;


import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-500 px-6 py-4 flex justify-between items-center">
      <div className="text-white font-bold text-xl">
        EscapeTheWeb
      </div>
      <div className="space-x-6">
        <Link
          to="/"
          className="text-white hover:text-gray-300 font-semibold"
        >
          Home
        </Link>
        <Link
          to="/login"
          className="text-white hover:text-gray-300 font-semibold"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="text-white hover:text-gray-300 font-semibold"
        >
          Signup
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

