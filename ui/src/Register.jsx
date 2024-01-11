import './App.css';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Icon } from 'react-icons-kit'
import { basic_eye } from 'react-icons-kit/linea/basic_eye';
import { basic_eye_closed } from 'react-icons-kit/linea/basic_eye_closed';
import { arrows_circle_check } from 'react-icons-kit/linea/arrows_circle_check';
import { arrows_circle_remove } from 'react-icons-kit/linea/arrows_circle_remove';



export const Register = (props) => {
  const [getEmail, setEmail] = useState("");
  const [getPass, setPass] = useState("");
  const [getPass2, setPass2] = useState("");
  const [getName, setName] = useState("");

  //Strong password states
  const [type, setType] = useState("password");
  const [lowerValidated, setLowerValidated] = useState(false);
  const [upperValidated, setUpperValidated] = useState(false);
  const [numberValidated, setNumberValidated] = useState(false);
  const [specialValidated, setSpecialValidated] = useState(false);
  const [lengthValidated, setLengthValidated] = useState(false);
  const [show, toggleShow] = useState(false);

  // The following two manages whether the password is displayed as plain text or asterisks
  const handleInputFocus = () => {
    toggleShow(true);
  };
  const handleInputBlur = () => {
    toggleShow(false);
  };

  // Manages password input changes
  const handleChange = (value) => {
    const lower = new RegExp('(?=.*[a-z])');
    const upper = new RegExp('(?=.*[A-Z])');
    const number = new RegExp('(?=.*[0-9])');
    const special = new RegExp('(?=.*[!@#\$%\^&\*])');
    const length = new RegExp('(?=.{8,})');

    //Lowercase check
    if (lower.test(value)) {
      setLowerValidated(true);
    }
    else {
      setLowerValidated(false);
    }

    //Uppercase check
    if (upper.test(value)) {
      setUpperValidated(true);
    }
    else {
      setUpperValidated(false);
    }

    //Number check
    if (number.test(value)) {
      setNumberValidated(true);
    }
    else {
      setNumberValidated(false);
    }

    //Special char check
    if (special.test(value)) {
      setSpecialValidated(true);
    }
    else {
      setSpecialValidated(false);
    }

    //Lowercase check
    if (length.test(value)) {
      setLengthValidated(true);
    }
    else {
      setLengthValidated(false);
    }
  }

  // Send to the database 
  const submit = (e) => {
    if (getPass == getPass2) {
      axios({
        method: 'post',
        url: 'http://localhost:8000/api/register',
        data: {
          username: getName,
          email: getEmail,
          password: getPass
        }
      })
        .then(function (response) {
          console.log(response);
          navigate("/");
        })
        .catch(function (error) {
          console.log(error);
          window.alert(error.response.data.error);
        });
    } else {
      window.alert("Passwords must match");
    }
    e.preventDefault();
    console.log(getEmail);
  }

  // Routes between pages
  let navigate = useNavigate();

  // The text box for the password input
  function passwordInput() {
    return (
      <div className='input-with-icon-div form-control'>
        <input className='iconInput' value={getPass} onChange={(e) => setPass(e.target.value)} type={type} placeholder="Password" id="password" name="password"
          onInput={(e) => handleChange(e.target.value)} onFocus={handleInputFocus} onBlur={handleInputBlur} />

        {/*The eyeball that changes whether the password is shown as asterisks or not*/}
        {type === "password" ? (
          <span className='icon-span'
            onClick={() => setType("text")}>
            <Icon icon={basic_eye_closed} size={22}></Icon>
          </span>
        ) : (
          <span className='icon-span'
            onClick={() => setType("password")}>
            <Icon icon={basic_eye} size={22}></Icon>
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="App">
      <div className="container">


        <form className="registerScreen" onSubmit={submit}>


          <label className="registerLabel"><b>Register</b></label>


          {/*Name input*/}
          <input value={getName} name="name" id="name" onChange={(e) => setName(e.target.value)} placeholder='Name' />

          {/*Email input*/}
          <input value={getEmail} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" id="email" name="email" />

          {/*Basically, the password entry; */}
          {passwordInput()}

          {/*Shows the requirements that must be met to register the given password*/}
          {show &&
            <main className='requirements-box'>
              <div className={lowerValidated ? "validated" : "not-validated"}>
                {lowerValidated ? (
                  <span className="reqIcon green">
                    <Icon icon={arrows_circle_check}></Icon>
                  </span>
                ) : (
                  <span className="reqIcon">
                    <Icon icon={arrows_circle_remove}></Icon>
                  </span>
                )}
                At least one lowercase letter
              </div>
              <div className={upperValidated ? "validated" : "not-validated"}>
                {upperValidated ? (
                  <span className="reqIcon green">
                    <Icon icon={arrows_circle_check}></Icon>
                  </span>
                ) : (
                  <span className="reqIcon">
                    <Icon icon={arrows_circle_remove}></Icon>
                  </span>
                )}

                At least one uppercase letter
              </div>
              <div className={numberValidated ? "validated" : "not-validated"}>
                {numberValidated ? (
                  <span className="reqIcon green">
                    <Icon icon={arrows_circle_check}></Icon>
                  </span>
                ) : (
                  <span className="reqIcon">
                    <Icon icon={arrows_circle_remove}></Icon>
                  </span>
                )}
                At least one number
              </div>
              <div className={specialValidated ? "validated" : "not-validated"}>
                {specialValidated ? (
                  <span className="reqIcon green">
                    <Icon icon={arrows_circle_check}></Icon>
                  </span>
                ) : (
                  <span className="reqIcon">
                    <Icon icon={arrows_circle_remove}></Icon>
                  </span>
                )}
                At least one special character
              </div>
              <div className={lengthValidated ? "validated" : "not-validated"}>
                {lengthValidated ? (
                  <span className="reqIcon green">
                    <Icon icon={arrows_circle_check}></Icon>
                  </span>
                ) : (
                  <span className="reqIcon">
                    <Icon icon={arrows_circle_remove}></Icon>
                  </span>
                )}
                At least 8 characters long
              </div>
            </main>
          }

          {/*Confirm password*/}
          <input value={getPass2} onChange={(e) => setPass2(e.target.value)} type="password" placeholder="Confirm password" id="confirm_password" name="confirm_password" />
          <button className="submitButton" type="submit">Register</button>


        </form>

        {/*Go back*/}
        <button className="underlinedTextButton" onClick={() => { navigate("/") }}>Log In Instead</button>
      </div>
    </div>
  )
};
