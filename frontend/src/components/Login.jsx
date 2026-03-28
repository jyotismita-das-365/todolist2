import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import '../style/addtask.css'

function Login() {
  
  const [userData, setUserData] = useState()
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('login')){
      navigate('/')
    }
  })

  const handleLogin = async() => {
    console.log(userData);
    let result = await fetch('http://localhost:3200/login', {
      method:'Post',
      body:JSON.stringify(userData),
      headers:{
        'Content-Type': 'Application/Json'
      }
    })
    result = await result.json()
    if(result.success){
      console.log(result);
      document.cookie = "token"+result.token;
      localStorage.setItem('login', userData.email);
      window.dispatchEvent(new Event('localStorage-change'))
      navigate('/');
    }else{
      alert("Try after some time");
    }
  }
  return(
    <>
    <div className="container">
      <h1>Login</h1>

        <label htmlFor="title">Email</label>
        <input onChange={(event) => setUserData({...userData, email: event.target.value})}
        type="email" name="email" placeholder="Enter user email" />

        <label htmlFor="title">Password</label>
        <input onChange={(event) => setUserData({...userData, password: event.target.value})}
        type="password" name="password" placeholder="Enter user password" />
        <button onClick={handleLogin} className="submit">Login</button>
        <Link className = 'link' to="/signup">Sign Up</Link>
    </div>
    </>
  )
}

export default Login;