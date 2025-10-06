import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "./ui/input.jsx";
import { Label } from "./ui/label.jsx";
import jwtDecode from "jwt-decode";
import { BackgroundBeams } from "./ui/beam-background.jsx";
import { toast } from "sonner";


const LoginPage = ({ onLogin }) => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);

        const decodedUser = jwtDecode(data.token);
        onLogin(decodedUser);

        if (decodedUser?.role === "admin") {
          toast.success("Welcome admin");
        }
        if(decodedUser?.role === "user") {
          toast.success(`Welcome ${decodedUser.name}`);

        }

        navigate("/rooms");
      } else {
      if (res.status === 403) {
        toast.error("Your account is restricted and cannot log in.");
      } else {
        toast.error(data.error || "Login failed");
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Network error, please try again later.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white px-4">
      <div className="flex flex-col md:flex-row items-center gap-10 bg-white/10 backdrop-blur-md rounded-2xl p-10 shadow-xl w-full max-w-4xl border border-white/10">
        {/* Login Animation */}
        <div className="w-full md:w-1/2">
          <lottie-player
            src="https://assets9.lottiefiles.com/packages/lf20_jcikwtux.json"
            background="transparent"
            speed="1"
            style={{ width: "400px", height: "400px" }}
            loop
            autoplay
          ></lottie-player>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full md:w-1/2 space-y-5">
          <h2 className="text-3xl font-bold text-cyan-400 text-center">
            Welcome Back 👋
          </h2>

          <div>
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm">
              Password
            </Label>
            <Input 
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-400 transition-all duration-200"
          >
            Login
          </button>

          <div className="text-sm flex justify-center text-gray-300">
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="hover:text-cyan-400 transition"
            >
              Create New Account
            </button>
            {/* <button
              type="button"
              onClick={() =>
                alert("Forgot password functionality not yet implemented")
              }
              className="hover:text-red-300 transition"
            >
              Forgot Password?
            </button> */}
          </div>
        </form>
      </div>
      <BackgroundBeams />
    </div>
  );
};

export default LoginPage;
