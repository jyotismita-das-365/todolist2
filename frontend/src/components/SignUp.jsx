import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/addtask.css";

function SignUp() {
  const [userData, setUserData] = useState();
  const navigate = useNavigate()
  
  useEffect(() => {
      if(localStorage.getItem('login')){
        navigate('/')
      }
    })

  const handleSignUp = async() => {
    console.log(userData);
    let result = await fetch('http://localhost:3200/signup', {
      method:'post',
      body:JSON.stringify(userData),
      headers:{
        'Content-Type': 'Application/Json'
      }
    })
    result = await result.json()
    if(result.success){
      console.log(result);
      document.cookie = "token"+result.token
      localStorage.setItem('login', userData.email);
      navigate('/');
    }else{
      alert("Try after sometime");
    }
  }
  return (
    <>
      <div className="container">
        <h1>Sign Up</h1>

        <label htmlFor="title">Name</label>
        <input
          onChange={(event) =>
            setUserData({ ...userData, name: event.target.value })
          }
          type="text"
          name="name"
          placeholder="Enter user name"
        />

        <label htmlFor="title">Email</label>
        <input
          onChange={(event) =>
            setUserData({ ...userData, email: event.target.value })
          }
          type="email"
          name="email"
          placeholder="Enter user email"
        />

        <label htmlFor="title">Password</label>
        <input
          onChange={(event) =>
            setUserData({ ...userData, password: event.target.value })
          }
          type="password"
          name="password"
          placeholder="Enter user password"
        />
        <button onClick={handleSignUp} className="submit">
          Sign Up
        </button>
        <Link className="link" to="/login">
          Login
        </Link>
      </div>
    </>
  );
}

export default SignUp;
