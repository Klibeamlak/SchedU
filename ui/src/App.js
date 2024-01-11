import React, {useState} from "react";
import logo from "./logo.svg";
import "./App.css";
import { Login } from "./Login";
import { Register } from "./Register";
import { Confirmation } from "./Confirmation";
import  CreateEvent  from "./CreateEvent";
import  Participants  from "./Participants";
import { ForgotPassword } from "./ForgotPassword";
import { AuthProvider } from './AuthContext';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Profile from "./Profile";
import DropdownMenu from './Dropdown';

function App() {
  // This function basically assigns each page to a particular URL
  return (
    <div className=".App">
      <AuthProvider>
          <Router>
              <Routes>
                    <Route path="/" element={<Login/>} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/register" element={<Register/>} />
                    <Route path="/confirmation" element={<Confirmation/>} />
                    <Route path="/create-event" element={<CreateEvent/>} />
                    <Route path="/participants" element={<Participants/>} />
                    <Route path="/forgot_password" element={<ForgotPassword/>} />
            </Routes>
          </Router>
        </AuthProvider>
     </div>
  )
};

export default App;
