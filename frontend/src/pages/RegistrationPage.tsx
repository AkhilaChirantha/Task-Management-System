import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaFacebookSquare, FaGooglePlusG } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";

export default function RegistrationPage() {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5001/api/user/register", {
        name,
        username,
        email,
        password,
      });

      console.log(response.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration Failed 🫣");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/api/user/auth/google";
  };

  return (
    <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop:"250px",
      height: "100px",
      marginLeft:'20px'
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
        
        {/* Left Side */}


        <div
          style={{
            flex: 1,
            backgroundColor: "#009688",
            color: "white",
            display: "flex",
            width:"800px",
            height:"370px",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "20px",
          }}
        >
        <div style={{ flex: 1, textAlign: "center", padding: "20px" }}>
          <h2 style={{ color: "#fff", marginTop:"55px", }}>Welcome Back!</h2>
          <p style={{ color: "#fff" }}>Enter your personal details to use all of the features</p>
          <button onClick={() => navigate("/login")} style={{
              backgroundColor: "white",
              color: "#009688",
              padding: "10px 20px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              marginTop: "10px",
            }}>
            Sign In
          </button>
        </div>
        </div>

        {/* Right Side */}
        
        <div style={{ flex: 1,  paddingLeft: "20px" }}>
          <h2 style={{ textAlign: "center", color: "#009688", marginTop: "50px" }}>Register Here</h2>

          {error && <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" value={name} required onChange={(e) => setName(e.target.value)} style={{ width: "80%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />

            <input type="text" placeholder="Username" value={username} required onChange={(e) => setUsername(e.target.value)} style={{ width: "80%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />

            <input type="email" placeholder="Email" value={email} required onChange={(e) => setEmail(e.target.value)} style={{ width: "80%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />

            <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                    width: "80%",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    }}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    marginLeft: "280px",
                    display: "flex",
                    alignItems: "center",
                    }}
                >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              


            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
                        <button style={{ backgroundColor: "#4267B2", color: "white", border: "none", padding: "10px", borderRadius: "5px",cursor:"pointer" }}>
                          <FaFacebookSquare />
                        </button>
                        <button
                          style={{ backgroundColor: "#db4437", color: "white", border: "none", padding: "10px", borderRadius: "5px",cursor:"pointer" }}
                          onClick={handleGoogleLogin} // Add onClick handler for Google OAuth
                        >
                          <FaGooglePlusG />
                        </button>
                        <button style={{ backgroundColor: "#0077b5", color: "white", border: "none", padding: "10px", borderRadius: "5px",cursor:"pointer" }}>
                          in
                        </button>
                      </div>

            <div style={{ display: "flex", marginTop: "15px",gap:"135px" }}>
              <button type="submit" style={{ backgroundColor: "#009688", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                Register
              </button>
              <button type="reset" style={{ backgroundColor: "#009688", color: "#fff", padding: "15px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
