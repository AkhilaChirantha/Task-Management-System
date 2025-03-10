import React from 'react'
import { useNavigate } from 'react-router-dom'

function HeroPage() {
  const navigate = useNavigate();
  return (
    <>
    <div style={{backgroundColor:'#A6E68D', fontFamily:'Iowan Old Style', minHeight:'88vh', padding:'40px',overflow:'hidden', }}>

      {/* Gray Box */}
          <div style={{backgroundColor:'#F3F3F3', borderRadius:'10px', }}>

            {/* Very top section. Company Name , Log and 2 Buttons */}
              <div style={{display:'flex', alignItems:'center',justifyContent:'space-between'}}>
                  
                  <div style={{display:'flex', alignItems:'center'}}>
                        <img src='logo.jpg' alt='logo' style={{height:'150px', width:'150px', objectFit:'cover', }}/>
                        <div style={{fontSize:'20px',marginLeft:'-16px'}}>ABC Consulting</div>
                  </div> 

                  <div style={{display:'flex', marginRight:'70px', gap:'50px'}}>
                    <button style={{border:'none', backgroundColor:'transparent', fontSize:'16px', fontWeight:'600',fontFamily:'Iowan Old Style',cursor:'pointer'}} onClick={ () => navigate('/register')}>Sign In</button>
                    <button style={{fontSize:'16px', fontWeight:'600',fontFamily:'Iowan Old Style',width:'120px', height:'50px', border:'none', backgroundColor:'#ffffff', borderRadius:'10px', color:'#379413', boxShadow:'0px 2px 2px rgba(0, 0, 0, 0.20)', cursor:'pointer' }} onClick={() => navigate('/login')}>Sign Up</button>
                  </div>

              </div>


            {/* Application Name, Description, and 2 Buttons for Get Start and Demo Session */}
            <div style={{display:'flex',flexDirection:'column',textAlign:'center'}}>
              <div style={{ fontSize:'16px', fontWeight:'600', }}>ABC</div>
              <div style={{ fontSize:'35px', fontWeight:'600'}}>Task Management System</div>
              <div style={{ fontSize:'16px', opacity:'37%', paddingTop:'44px'  }}>ABC Boards, Lists, and Cards enable you to organise and prioritise your projects in a fun,<br /> flexible, and rewarding way. Let’s Start </div>😘  


              <div style={{display:'flex', justifyContent:'center', gap:'34px', marginTop:'40px'}}>
                <button style={{width:'200px', height:'60px', border:'none', backgroundColor:'#F88A1A', color:'#ffffff', fontWeight:'600', fontSize:'20px', borderRadius:'10px', fontFamily:'Iowan Old Style', boxShadow:'0px 2px 10px rgba(0, 0, 0, 0.25)', cursor:'pointer'}} onClick={() => navigate('/login')}>Get Start</button>
                <button style={{width:'200px', height:'60px', border:'none', backgroundColor:'#ffffff', color:'#379413', fontWeight:'600', fontSize:'20px', borderRadius:'10px', fontFamily:'Iowan Old Style', boxShadow:'0px 2px 10px rgba(0, 0, 0, 0.25)', cursor:'pointer'}} onClick={() => navigate('/')}>See Demo</button>
              </div>


              <div><img src='logo.jpg' style={{width:'400px', height:'290px'}}/></div>
              
            </div>



          </div>
    </div>

    </>
  )
}

export default HeroPage