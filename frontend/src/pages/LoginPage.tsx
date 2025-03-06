import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { FaFacebookSquare, FaGooglePlusG } from "react-icons/fa";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5001/api/user/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/profile");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setError(err.response?.data?.message ?? "Login Failed 😬");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle Google OAuth login
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/api/user/auth/google";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100px",
        backgroundColor: "#f3f4f6",
        marginLeft:'290px'
      }}
    >
      <div
        style={{
          display: "flex",
          width: "800px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
      >
        {/* Left Section (Login Form) */}
        <div style={{ flex: 1, padding: "40px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#4267B2" }}>
            Login to Your Account
          </h2>
          <p style={{ textAlign: "center", fontSize: "14px", color: "#4267B2" }}>
            Login using social networks
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
            <button style={{ backgroundColor: "#4267B2", color: "white", border: "none", padding: "10px", borderRadius: "5px" }}>
              <FaFacebookSquare />
            </button>
            <button
              style={{ backgroundColor: "#db4437", color: "white", border: "none", padding: "10px", borderRadius: "5px" }}
              onClick={handleGoogleLogin} // Add onClick handler for Google OAuth
            >
              <FaGooglePlusG />
            </button>
            <button style={{ backgroundColor: "#0077b5", color: "white", border: "none", padding: "10px", borderRadius: "5px" }}>
              in
            </button>
          </div>
          {error && <p style={{ color: "red", textAlign: "center", fontSize: "14px" }}>{error}</p>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={{ width: "93%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={{ width: "93%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: "#009688",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Right Section */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#009688",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "20px",
          }}
        >
          <h1 style={{ fontSize: "24px", textAlign: "center" }}>New Here?</h1>
          <p style={{ textAlign: "center", fontSize: "14px", marginTop: "10px" }}>
            Sign up and discover a great amount of new opportunities!
          </p>
          <button
            onClick={() => navigate("/register")}
            style={{
              backgroundColor: "white",
              color: "#009688",
              padding: "10px 20px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}