import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import api from "../../api/axios";
import { USER_API_POINT } from "../../utils/Apicall";
import { toast } from "sonner";
import horrorBg2 from "../../assets/login3.png";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(`${USER_API_POINT}/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        // Store token and username in localStorage
        if (res.data.user?.token) {
          localStorage.setItem("token", res.data.user.token);
        }
        if (res.data.user?.username) {
          localStorage.setItem("username", res.data.user.username);
        }
        toast.success("Welcome back to the shadows");
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Login Failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div
      className="min-h-screen text-[#E5E5E5] relative"
      style={{
        backgroundImage: `url(${horrorBg2})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-[#0a001a]/60 min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen px-4">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-[0_0_25px_rgba(255,76,76,0.4)] w-full max-w-md transition-transform duration-300 hover:scale-[1.02]">
            <h2 className="text-3xl font-bold mb-6 text-center text-[#FF4C4C] animate-pulse tracking-wide drop-shadow-[0_0_10px_#FF4C4C]">
              ENTER THE SHADOW
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-1 text-sm text-[#E5E5E5]">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 bg-white/10 text-[#E5E5E5] border border-[#A259FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4C4C] backdrop-blur-sm placeholder:text-white/70"
                  placeholder="ghost@escape.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-[#E5E5E5]">Password</label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-4 py-2 bg-white/10 text-[#E5E5E5] border border-[#A259FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4C4C] backdrop-blur-sm placeholder:text-white/70"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#FF4C4C] text-black font-semibold rounded-lg hover:bg-[#B3001B] hover:text-white transition duration-300"
              >
                Login
              </button>
            </form>

            <p className="mt-4 text-sm text-center text-[#FFBABA]">
              Not yet cursed?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-[#FF4C4C] cursor-pointer hover:text-[#B3001B] hover:underline transition"
              >
                Join the dark order
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
