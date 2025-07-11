import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_POINT } from "../../utils/Apicall";
import { z } from "zod";
import horrorBg from "../../assets/horror-img.jpeg";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

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
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || "Invalid input";
      toast.error(errorMessage);
      return;
    }

    try {
      const res = await axios.post(`${USER_API_POINT}/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Login successful");
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Login Failed");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div
      className="min-h-screen text-[#E5E5E5] relative"
      style={{
        backgroundImage: `url(${horrorBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-[#0a001a]/60 min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen px-4">
          <div className="bg-[#1C0032] p-8 rounded-xl shadow-[0_0_25px_#A259FF] w-full max-w-md border border-[#A259FF]">
            <h2 className="text-3xl font-bold mb-6 text-center text-[#FF4C4C] animate-pulse tracking-wide drop-shadow-[0_0_10px_#FF4C4C]">
              ENTER THE SHADOWS
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-1 text-sm text-[#E5E5E5]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 bg-[#120020] text-[#E5E5E5] border border-[#A259FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0FF00]"
                  placeholder="ghost@escape.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-[#E5E5E5]">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-4 py-2 bg-[#120020] text-[#E5E5E5] border border-[#A259FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0FF00]"
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
              No account yet?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-[#FF4C4C] cursor-pointer hover:text-[#B3001B] hover:underline transition"
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
