import { useState } from "react";
import "./App.css";




function Title() {
  return (
    <span className="Title">
      SchedU
    </span>
  )
}


export const Confirmation = (props) => {
  return (
    <div className="CalendarApp">
      <div className="main_container">

        <h2>Thank you for using SchedU!</h2>
        <h2>Remember your confirmation code!</h2>
        <p>Use this code to access the event at a later date</p>

        <div className="code_box">
          <span>Event Code</span>
          <button className="copyCode">Copy Event Code</button>
        </div>

        <p>Invite more participants</p>
        <div className="invite_link_container">
          <p>Invite Link</p>
          <button className="copyLink">Copy Invite Link</button>
        </div>

      </div>
    </div>
  )
};