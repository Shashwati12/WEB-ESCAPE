import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Navbar from "../Navbar";

import axios from "axios";
import {USER_API_POINT} from "../../utils/Apicall";

function Login(){
    const navigate= useNavigate();
    const [formData, setFormData] = useState({
        email:"",
        password:"",
    })


const handleChange= (e)=>{
    setFormData((prev)=>({
        ...prev,
        [e.target.name] : e.target.value,
    }));
}

const handleSubmit = async(e)=>{
    e.preventDefault();
    console.log("login Data", formData);


try{
    const res= await axios.post(`${USER_API_POINT}/login`,formData,{
         headers:{
        "Content-Type":"application/json",
     
    },
        withCredentials:true,
   
    });
    if(res.data.success){
        navigate("/");

    }
   
}catch(error){
    console.log(error);
}
}

return (
    <div>
        <Navbar/>
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
     
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>

       
        </form>
        <p className="mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
    </div>
    
  );
}

export default Login;

