import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import "./App.css";
import axios from 'axios';
import { useAuth } from './AuthContext';

export const Login = (props) => {
  const [getEmail, setEmail] = useState('');
  const [getPass, setPass] = useState('');
  const { login } = useAuth();


// Handler for interfacing with the database when logging in  
const submit = (e) => {
    axios({
        method: 'post',
        url: 'http://localhost:8000/api/login',
        data: {
            email: getEmail,
            password: getPass
        }
    })
    .then(function (response) {
        console.log(response);
        if (response.status === 200) {
            login(response.data.token, response.data.userId);
            navigate("/create-event");
        } else {
            window.alert("Invalid credentials");
        }
    })
    .catch(function (error) {
        console.log(error);
        window.alert(error.response.data.message);
    });
    e.preventDefault();
    console.log(getEmail);
}

// Routes between pages
let navigate = useNavigate();

  return (
    <div className="App">
      <div className="container">


          <form className="loginScreen" onSubmit={submit}>
            <label className="loginLabel"><b>Login</b></label>

              {/*Email Field*/}
              <label htmlFor="email">Email</label>
              <input value={getEmail} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email"/>

              {/*Password Field*/}
              <label htmlFor="password">Password</label>
              <input value={getPass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password"/>

              {/*Submit Credentials*/}
              <button className="submitButton" type="submit">Log In</button>


          </form>

          {/*Underlined Buttons*/}
          <button className="underlinedTextButton" onClick={() => {navigate("/register")}}>Register new account</button>
          <button className="underlinedTextButton" onClick={() => {navigate("/forgot_password")}}>Forgot Password</button>


      </div>
    </div>
  )
};


