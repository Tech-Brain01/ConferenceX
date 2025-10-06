import { useNavigate } from "react-router-dom";
import { useState } from "react";
import jwtDecode from "jwt-decode"; // ✅ decode the token
import { Input } from "./ui/input.jsx";
import { Label } from "./ui/label.jsx";
import { BackgroundBeams } from "./ui/beam-background.jsx";
import { toast } from "sonner";

const SignupPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);

        const decodedUser = jwtDecode(data.token);
        // console.log("✅ Decoded token after signup:", decodedUser);

        onLogin(decodedUser);

        toast.success("Signup successful! You are now logged in.");
        navigate("/rooms");
      } else {
        toast.error(`${data.error}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white px-4">
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

        <form onSubmit={handleSubmit} className="w-full md:w-1/2 space-y-5">
          <h2 className="text-3xl font-bold text-cyan-400 text-center">
            Create Account
          </h2>

          <div>
            <Label htmlFor="username" className="text-sm">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600"
              required
            />
          </div>

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
            Sign Up
          </button>

          <div className="mt-4 text-sm text-center">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-cyan-400 hover:underline"
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <BackgroundBeams />
    </div>
  );
};

export default SignupPage;
