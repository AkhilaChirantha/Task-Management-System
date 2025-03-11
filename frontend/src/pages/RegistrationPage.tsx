import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function RegistrationPage() {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5001/api/user/register", {
        name,
        email,
        password,
      });

      console.log(response.data);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Registration Failed 🫣");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/api/user/auth/google";
  };


  const handleReset = () => {
    setName('');
    setEmail('');
    setPassword('');
  }

  return (
   <>
   {error && <p className="text-red-500">{error}</p>}
   <div style={{backgroundColor:'#A6E68D', fontFamily:'Iowan Old Style', minHeight:'88vh', padding:'40px',overflow:'hidden', display:'flex' }}>

     {/* Left Side part with Logo and others. */} 
     <div style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', flex:'1'}}> 
        <div style={{ fontSize:'20px', fontWeight:'500' }}>ABC</div>
        <div style={{ fontSize:'35px', fontWeight:'600' }}>Task Management System</div>
        <div> <img src="logo.jpg" style={{width:'500px', height:'396px'}} /></div>
        <div style={{ fontSize:'20px', fontWeight:'500' }}>Have an Account</div>
        <div style={{textAlign:'center', fontSize:'18px', fontWeight:'400'}}>Engage with account & discover a great amount of new <br /> opportunities 😍 </div>
        <div style={{paddingTop:'20px'}}> <button style={{border:' none', width:'200px', height:'60px', backgroundColor:'#F88A1A', color:'#ffffff', fontSize:'20px', boxShadow:'0 1px 2px rgba(0,0,0,0.35)', borderRadius:'10px', cursor:'pointer'}} onClick={() => navigate('/login')}>Sign In</button></div>
      </div>


      {/* Right Side - Gray Box with Login Form */} 
      <div style={{backgroundColor:'#F3F3F3', borderRadius:'10px',minWidth:'600px', marginLeft:'auto', alignItems:'center' }}>
      <div style={{fontWeight:'500', fontSize:'25px', paddingTop:'87px', paddingLeft:'49px'}}>Create an Account 😍</div>

              {/* Login Form */} 
              <div style={{paddingTop:'42px', display:'flex',justifyContent:'center'}}>
                <form style={{display:'flex', flexDirection:'column', paddingTop:'12px', rowGap:'15px', }} onSubmit={handleSubmit}>

                <input 
                      type="text"
                      value={name}
                      placeholder="Enter Your Name"
                      required
                      onChange={(e) => setName(e.target.value)}
                      style={{width:'480px', height:'50px',fontFamily:'Iowan Old Style', fontSize:'15px', border:'1px solid rgba(0, 0, 0, 0.35)', paddingLeft:'19px', borderRadius:'10px', backgroundColor:'#F3F3F3'}} />
      
                  <input 
                      type="email"
                      value={email}
                      placeholder="Enter Your Email"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      style={{width:'480px', height:'50px',fontFamily:'Iowan Old Style', fontSize:'15px', border:'1px solid rgba(0, 0, 0, 0.35)', paddingLeft:'19px', borderRadius:'10px', backgroundColor:'#F3F3F3'}} />
      
                  <div style={{ position: "relative" }}>
                      <input 
                          type={showPassword ? "text" : "password"}
                          value={password}
                          placeholder="Enter Password" 
                          required
                          onChange={(e) => setPassword(e.target.value)}
                          style={{width:'480px', height:'50px',fontFamily:'Iowan Old Style', fontSize:'15px', border:'1px solid rgba(0,0,0,0.35)', paddingLeft:'19px', borderRadius:'10px', backgroundColor:'#F3F3F3' }} />
      
                      <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer',color:'#000000 ',opacity:'35%'}} >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                  </div>
      
      
                  <div style={{display:'flex', flexDirection:'row', columnGap:'30px', justifyContent:'center', paddingTop:'20px'}}>
                        <button type="submit" 
                        style={{width:'180px', height:'50px',fontFamily:'Iowan Old Style', fontSize:'20px', border:'none',backgroundColor:'#ffffff', fontWeight:'500', color:'#379413', borderRadius:'10px', boxShadow:'0 1px 2px rgba(0,0,0,0.35)', cursor:'pointer'}}
                        disabled={loading}>
                        {loading ? "Logging in..." : "Sign Up"}</button>
      
                        <button type="reset" 
                        style={{width:'180px', height:'50px',fontFamily:'Iowan Old Style', fontSize:'20px', border:'none',backgroundColor:'#ffffff', fontWeight:'500', color:'#379413', borderRadius:'10px', boxShadow:'0 1px 2px rgba(0,0,0,0.35)', cursor:'pointer'}}
                        disabled={loading} onClick={handleReset}>
                        Cancel</button>
                  </div>
      
                </form>
              </div>

                      {/* OR Part */} 
        <div style={{display:'flex', paddingTop:'40px', alignItems:'center'}}>
          <hr style={{width:'220px', height:'1px', backgroundColor:'rgba(0,0,0,0.20)'}}/> <div style={{color:'rgba(0,0,0,0.35)'}}>Or</div> <hr style={{width:'220px', height:'1px', backgroundColor:'rgba(0,0,0,0.20)'}}/>
        </div>


        {/* Social Authentications */}

        <div style={{display:'flex', flexDirection:'column', alignItems:'center', rowGap:'15px', paddingTop:'25px'}}>

          <div style={{display:'flex', flexDirection:'row', columnGap:'20px'}}>
          <button style={{border:'none',width:'200px', height:'60px',fontFamily:'Iowan Old Style', fontSize:'18px',backgroundColor:'#ffffff', fontWeight:'500',  borderRadius:'10px', boxShadow:'0 1px 2px rgba(0,0,0,0.35)',display:'flex', alignItems:'center', gap:'20px', cursor:'pointer'}}  onClick={handleGoogleLogin}><img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" style={{width:'30px', height:'30px', paddingLeft:'10px'}}/>Google</button>
          <button style={{border:'none',width:'200px', height:'60px',fontFamily:'Iowan Old Style', fontSize:'18px',backgroundColor:'#ffffff', fontWeight:'500',  borderRadius:'10px', boxShadow:'0 1px 2px rgba(0,0,0,0.35)',display:'flex', alignItems:'center', gap:'20px', cursor:'pointer'}}><img src="https://pngimg.com/d/facebook_logos_PNG19753.png" style={{width:'30px', height:'30px', paddingLeft:'10px'}}/>Facebook</button>
          </div>

          <div style={{display:'flex', flexDirection:'row', columnGap:'20px'}}>
            <button style={{border:'none',width:'200px', height:'60px',fontFamily:'Iowan Old Style', fontSize:'18px',backgroundColor:'#ffffff', fontWeight:'500',  borderRadius:'10px', boxShadow:'0 1px 2px rgba(0,0,0,0.35)',display:'flex', alignItems:'center', gap:'20px', cursor:'pointer'}}><img src="https://www.iconpacks.net/icons/2/free-linkedin-logo-icon-2430-thumb.png" style={{width:'25px', height:'25px', paddingLeft:'10px'}}/>Linkedin</button>
            <button style={{border:'none',width:'200px', height:'60px',fontFamily:'Iowan Old Style', fontSize:'18px',backgroundColor:'#ffffff', fontWeight:'500',  borderRadius:'10px', boxShadow:'0 1px 2px rgba(0,0,0,0.35)',display:'flex', alignItems:'center', gap:'20px', cursor:'pointer'}}><img src="https://pngimg.com/d/apple_logo_PNG19666.png" style={{width:'25px', height:'25px', paddingLeft:'10px'}}/>Apple</button>
          </div>
          
         
        </div>



      </div>

   </div>
   
   </>
  );
}
