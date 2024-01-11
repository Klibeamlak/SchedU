import "./ForgotPassword.css";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RecoveryCodeInput() {
  let navigate = useNavigate();
  const emailAddress = document.getElementsByName("email")[0].value;
  const [otp, setOtp] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");


  // Essentially just validates password 
  function validate() {
    const password_input = document.getElementsByName("password1")[0];
    // Placeholder  (If password_input, the element, does not exist)
    if (!password_input) {

    // If password_input is empty 
    } else if (password_input.value == "") {
      password_input.classList.remove("valid");
      password_input.classList.add("invalid");
      return "Please enter new password.";

    // If password_input exists as an element and is not empty 
    } else {
      password_input.classList.add("valid");
      password_input.classList.remove("invalid");
    }

    const confirm_password_input =
      document.getElementsByName("password2")[0];

    // Make sure both given passwords match
    if (!confirm_password_input) {
    } else if (password1 == password2) {
      confirm_password_input.classList.add("valid");
      confirm_password_input.classList.remove("invalid");
    } else {
      confirm_password_input.classList.remove("valid");
      confirm_password_input.classList.add("invalid");
      return "Passwords must match.";
    }
  }

  // One time password handler 
  const otpInputHandler = (e) => {
    setOtp(e.target.value);
  };

  // The following are the handlers for the two passwords that updates the respective password variables for the inputs elements 
  const inputHandler1 = (e) => {
    setPassword1(e.target.value);
    validate();
  };
  const inputHandler2 = (e) => {
    setPassword2(e.target.value);
    validate();
  };

  // Interfaces with the database to send the passwords to the database 
  function handleSubmit() {
    const password_input1 = document.getElementsByName("password1")[0];
    const password_input2 = document.getElementsByName("password2")[0];
    if (password_input1.classList.contains("valid") && password_input2.classList.contains("valid")) {
      axios({
        method: 'post',
        xhrFields: { withCredentials: true },
        credentials: 'include',
        withCredentials: true,
        url: 'http://localhost:8000/api/update_password',
        data: {
          email: emailAddress,
          otp: otp,
          password: password1,
        }
      })
        .then(function (response) {
          console.log(response);
          if (response.status === 200) {
          } else {
            window.alert(response.data.message);
          }
          navigate("/login");
        })
        .catch(function (error) {
          console.log(error);
          window.alert(error.response.data.message);
        });
    }
  }


  return (
    <div>

      {/*Six Digit one time password entry*/}
      <input
        type="text"
        value={otp}
        onChange={otpInputHandler}
        inputmode="numeric"
        placeholder="6-Digit recovery code"
      ></input>

      {/*Password one entry*/}
      <input
        name="password1"
        type="password"
        placeholder="New password"
        onChange={inputHandler1}
      ></input>

      {/*Confirm password*/}
      <input
        type="password"
        name="password2"
        placeholder="Confirm new password"
        onChange={inputHandler2}
      ></input>


      <button
        class="submitButton"
        onClick={handleSubmit}
      >Update password</button>
      {validate()}
    </div>
  );
}

export const ForgotPassword = (props) => {
  let navigate = useNavigate();
  const [emailAddress, setEmailAddress] = useState("");
  const [showCode, setShowCode] = useState(false);
  const inputHandler = (e) => {
    setEmailAddress(e.target.value);
  };

  // Interfaces with the database to find a given user
  const searchHandler = (e) => {
    axios({
      method: 'post',
      credentials: 'include',
      xhrFields: { withCredentials: true },
      withCredentials: true,
      url: 'http://localhost:8000/api/find_user',
      data: {
        email: emailAddress,
      }
    })
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          setShowCode(true);
        } else {
          window.alert(response.response.data.message);
          setShowCode(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        window.alert(error.response.data.message);
      });
  };

  function handleSubmit() { }
  return (
    <div className="App">
      <div className="container">

        {/*Email input*/}
        <div class="help-text">
          Enter your email address to find your account.
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={emailAddress}
          onChange={inputHandler}
          autofocus="1"
        ></input>

        {/*Cancel buttom*/}
        <button class="cancelButton" type="submit" name="cancel" onClick={() => { navigate("/login") }}>
          Cancel
        </button>

        {/*Search buttom*/}
        <button class="submitButton" type="submit" name="submit" onClick={searchHandler}>
          Search
        </button>
        {showCode && <RecoveryCodeInput />}


      </div>
    </div>
  );
};