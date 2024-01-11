import React, { useEffect, useState } from "react";
import "./App.css";
import { useNavigate, useSearchParams } from "react-router-dom";


function Title() {
    return (
      <span className="EventTitle">
        SchedU
      </span>
    );
  }




export default function Profile() {
  const [searchParams] = useSearchParams();
  const emailUsername = searchParams.get("email");
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const parsedArray = JSON.parse(localStorage.getItem("events"));
    if (parsedArray?.length > 0) {
      setEvents(parsedArray);
    }
  }, []);

  return (
    <div className="CalendarApp">

    {Title()}

    <div style={{ height: "10%" }} />

    <div
        style={{
          width: "100%",
          height: "65vh",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column"
        }}>

      <header className="header">
        <h1>Profile</h1>
        <div>
          <p>{emailUsername ? emailUsername : "Username"}</p>
          <button
            onClick={() => navigate(`/create-event?email=${emailUsername}`)}
          >
            Create Event
          </button>
        </div>
      </header>

      
      <div className="eventsContainer">
        {events?.length > 0 ? (
          <table id="events">
            <tr>
              <th>Owner Name</th>
              <th>Event Name</th>
              <th>Actions</th>
            </tr>
            {events?.map((val, ind) => {
              return (
                <tr key={ind}>
                  <td>{val?.ownerName}</td>
                  <td>{val?.eventName}</td>
                  <td>
                    <button
                      className="tableBtn"
                      onClick={() =>
                        navigate(`/create-event?email=${emailUsername}`)
                      }
                    >
                      Go to Event
                    </button>
                  </td>
                </tr>
              );
            })}
          </table>
        ) : (
          <p style={{ fontSize: "18px", textAlign: "center" }}>
            No Events Created
          </p>
        )}
      </div>

      </div>
      
    </div>
  );
}
