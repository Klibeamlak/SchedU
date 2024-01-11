import './App.css';
import React, { useRef, useState, useEffect } from "react";
import DatePicker, { DatePickerProps, DateObject, toDateObject } from "react-multi-date-picker";
import { Calendar } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { useNavigate } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import moment from 'moment-timezone';
import axios from 'axios';
import dayjs from 'dayjs'



function Title() {
  return (
    <span className="EventTitle">
      SchedU
    </span>
  );
}



function CreateEvent() {
  let navigate = useNavigate();

  const [eventName, setEventName] = useState("");
  const [pickedDates, setPickedDates] = useState();
  const [startTime, setStart] = useState(new Date(2020, 10, 10, 9, 0));
  const [endTime, setEnd] = useState(new Date(2020, 10, 10, 17, 0));
  let utcOffsets = moment.tz.names()
  const [TZ, setTZ] = useState(moment.tz.guess());

  const titleInputHandler = (e) => {
    setEventName(e.target.value);
  };

  // Send content to the database
  function handleSubmit() {
    axios({
      method: 'post',
      xhrFields: { withCredentials: true },
      credentials: 'include',
      withCredentials: true,
      url: 'http://localhost:8000/api/events',
      data: {
        title: eventName,
        min_start_time: dayjs(startTime.toISOString()).format("HH:MM"),
        max_start_time: dayjs(endTime.toISOString()).format("HH:MM"),
      }
    })
      .then(function (response) {
        console.log(response);
        if (response.status === 201) {
        } else {
          window.alert(response.data.message);
        }
        navigate("/participants");
      })
      .catch(function (error) {
        console.log(error);
        window.alert(error.response.data.message);
      });
  }

  // Display the column with the calendar with which you choose your event days
  function calendarColumn() {
    return (
      <div className="CalendarColumn">
        <label id="CCol" className="ColumnTitle">Days Selected</label>
        <div style={{ height: "10%" }} />

        {/*The calendar itself; these are just formatting options that aren't important*/}
        <Calendar id="DayCalendar"
          format="MM/DD/YYYY HH:mm"

          style={{
            borderRadius: "0px",
            boxShadow: "0 0 0 0",
            display: "inline-block",
          }}

          datePanel
          multiple
          showOtherDays

          value={pickedDates}
          onChange={setPickedDates}
        />
      </div>
    );
  }

  // Display the column with the time pickers with which you choose the start time range of your event days
  function timesColumn() {
    return (
      <div className="TimesColumn">
        <label id="TCol" className="ColumnTitle">Start time</label>

        <div style={{ height: "10%" }} />

        {/*Picker for earliest start time*/}
        <label className="DurationTitle">Earliest</label>
        <br />
        <Calendar format="hh:mm A"

          style={{
            borderRadius: "0px",
            boxShadow: "0 0 0 0",
            display: "inline-block",
          }}

          disableDayPicker

          value={startTime}
          onChange={setStart}

          plugins={[<TimePicker hideSeconds mStep={60} />]}
        />

        <div style={{ height: "10%" }} />

        {/*Picker for latest start time*/}
        <label className="DurationTitle">Latest</label>
        <br />
        <Calendar format="hh:mm A"
          style={{
            borderRadius: "0px",
            boxShadow: "0 0 0 0",
            display: "inline-block",
          }}

          disableDayPicker

          value={endTime}
          onChange={setEnd}

          plugins={[<TimePicker hideSeconds mStep={60} />]}
        />
      </div>
    );
  }

  // Display the column for Event Name, Time Zone, and submitting this to the database
  function submissionColumn() {
    return (
      <div className="SubmissionColumn">
        <label id="SCol" className="ColumnTitle">Submission</label>

        <div style={{ height: "10%" }} />

        <div className="TimeZoneDiv" >

          {/*Event Name input */}
          <label style={{ fontWeight: "700", textAlign: 'center' }}>Event Name</label>

          <br></br>

          <input size="50" type="text" style={{ "backgroundImage": "linear-gradient(79deg, rgb(188, 247, 224), rgb(214, 184, 221) 48%, rgb(212, 234, 241))", borderRadius: "0px", textAlign: "center", width: "93%" }} value={eventName} onChange={titleInputHandler} id="EventName" name="EventName" />

          <br></br>

          {/*Time Zone input */}
          <label style={{ fontWeight: "700", textAlign: 'center' }}>Time Zone</label>
          <br></br>
          <label>Selected: {TZ} </label>

          <br></br>
          <br></br>

          {/*Time Zones*/}
          <select id="UTCTimeZone" name="TimeZone" value={TZ} onChange={e => setTZ(e.target.value)} >
            {
              utcOffsets.map(
                utcOffset => { return <option value={utcOffset} onChange={setTZ}>{utcOffset}</option> }
              )
            }
          </select>

          <br></br>

          {/*Submit button */}
          <input type="submit" value="Submit" onClick={handleSubmit} ></input>
        </div>
      </div>
    );
  }

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
          display: "flex"
        }}>

        <div className="EventCreation">

          {/* The Column for Selecting Days of the Event*/}
          {calendarColumn()}

          <div style={{ width: "5%" }} />

          {/* The Column for Selecting Start and End Times*/}
          {timesColumn()}


          <div style={{ width: "5%" }} />

          {/* The Column for Event Name, Time Zone, and submitting this to the database*/}
          {submissionColumn()}

        </div>

      </div>

    </div>

  );
}

export default CreateEvent;