import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import api from "../../api/axios";
import { USER_API_POINT } from "../../utils/Apicall";
import { toast } from "sonner";
import { z } from "zod";
import horrorBg2 from "../../assets/login3.png";

const registerSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
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

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || "Invalid input";
      toast.error(errorMessage);
      return;
    }

    try {
      const res = await api.post(`${USER_API_POINT}/register`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        toast.success("Registered successfully");
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Registration Failed");
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
              BECOME ONE WITH DARKNESS
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-1 text-sm text-[#E5E5E5]">Name</label>
                <input
                  type="text"
                  name="username"
                  className="w-full px-4 py-2 bg-white/10 text-[#E5E5E5] border border-[#A259FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4C4C] backdrop-blur-sm placeholder:text-white/70"
                  placeholder="ShadowWalker"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

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
                Sign Up
              </button>
            </form>

            <p className="mt-4 text-sm text-center text-[#FFBABA]">
              Already a shadow being?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-[#FF4C4C] cursor-pointer hover:text-[#B3001B] hover:underline transition"
              >
                Return to login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;



