import './App.css';
import React, { useState, useEffect } from "react";
import DatePicker, { DatePickerProps, DateObject } from "react-multi-date-picker";
import { Calendar } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { useNavigate } from 'react-router-dom';

var gridArray = new Array(new Array(), new Array(), new Array(), new Array(),
  new Array(), new Array(), new Array(), new Array(), new Array(), new Array(),
  new Array(), new Array());

function Title() {
  return (
    <span className="EventTitle">
      SchedU
    </span>
  );
}

// For the individual cells of the grid 
const GridCell = ({ row, col, selected, onClick, customArray }) => {
  const text = customArray[row] && customArray[row][col];

  return (
    <div
      className={`grid-cell ${selected ? 'selected' : ''}`}
      onClick={() => onClick(row, col)}
    >
      {text}
    </div>
  );
}

function Participants() {
  const [pickedDates, setPickedDates] = useState([]);
  const [startTime, setStart] = useState();
  const [endTime, setEnd] = useState();
  const [participantDates, setParticipantDates] = useState([]);

  var eventName = null;


  let utcOffsets = ["UTC-12:00, Y",
    "UTC-11:00, X",
    "UTC-10:00, W",
    "UTC-09:30, V†",
    "UTC-09:00, V",
    "UTC-08:00, U",
    "UTC-07:00, T",
    "UTC-06:00, S",
    "UTC-05:00, R",
    "UTC-04:00, Q",
    "UTC-03:30, P†",
    "UTC-03:00, P",
    "UTC-02:00, O",
    "UTC-01:00, N",
    "UTC±00:00, Z",
    "UTC+01:00, A",
    "UTC+02:00, B",
    "UTC+03:00, C",
    "UTC+03:30, C†",
    "UTC+04:00, D",
    "UTC+04:30, D†",
    "UTC+05:00, E",
    "UTC+05:30, E†",
    "UTC+05:45, E*",
    "UTC+06:00, F",
    "UTC+06:30, F†",
    "UTC+07:00, G",
    "UTC+08:00, H",
    "UTC+08:45, H*",
    "UTC+09:00, I",
    "UTC+09:30, I†",
    "UTC+10:00, K",
    "UTC+10:30, K†",
    "UTC+11:00, L",
    "UTC+12:00, M",
    "UTC+12:45, M*",];

  const [TZ, setTZ] = useState(utcOffsets[0]);




  //grid
  const [selectedCells, setSelectedCells] = useState([]);
  const [coordinates, setCoordinates] = useState('');
  const handleCellClick = (row, col) => {
    const cellIndex = selectedCells.findIndex(cell => cell.row === row && cell.col === col);

    if (cellIndex === -1) {
      // Cell not selected, add it to the list
      const newSelection = [...selectedCells, { row, col }];
      setSelectedCells(newSelection);
      setCoordinates(newSelection.map(({ row, col }) => `(${row}, ${col})`).join(', '));
    } else {
      // Cell already selected, remove it from the list
      const newSelection = [...selectedCells];
      newSelection.splice(cellIndex, 1);
      setSelectedCells(newSelection);
      setCoordinates(newSelection.map(({ row, col }) => `(${row}, ${col})`).join(', '));
    }
  };

  if (pickedDates.length != 0) {
    console.log(pickedDates[0])
    console.log(pickedDates[0].toString())
  }

  // Create array 
  const createArray = () => {

    gridArray[0].splice(0, gridArray.length);

    gridArray[0][0] = "";
    gridArray[1][0] = "09:00";
    gridArray[2][0] = '10:00';
    gridArray[3][0] = '11:00';
    gridArray[4][0] = '12:00';
    gridArray[5][0] = '13:00';
    gridArray[6][0] = '14:00';
    gridArray[7][0] = '15:00';
    gridArray[8][0] = '16:00';
    gridArray[9][0] = '17:00';
    gridArray[10][0] = '18:00';
    gridArray[11][0] = '19:00';

    for (var i = 0; i < 1; i++) {
      for (var j = 0; j < participantDates.length; j++) {

        gridArray[0].push(participantDates[j].toString());
      }
    }
    return (
      gridArray
    )
  }
  createArray();
  let navigate = useNavigate();


  // Basically the contents on page 1 (Where you submit your stuff)
  function participantSubmission() {
    return (
      <div className="EventCreation">

        {/* The Column for displaying the days of the event*/}
        <div className="CalendarColumn">
          <label id="CCol" className="ColumnTitle">{eventName} Placeholder</label>
          <div style={{ height: "2%" }}
          />
          <div
            style={{
              backgroundColor: "white",
              fontWeight: "600",
              height: "6%",
            }}
          >
            Event Code: { }
          </div>
          <div style={{ height: "2%" }} />

          <Calendar id="DayCalendar"
            format="MM/DD/YYYY HH:mm"

            style={{
              borderRadius: "0px",
              boxShadow: "0 0 0 0",
              display: "inline-block",
            }}

            readOnly

            datePanel
            multiple
            showOtherDays

            value={pickedDates}
            onChange={setPickedDates}
          />
        </div>

        <div style={{ width: "5vw" }} />

        {/* The Column for Selecting your participation days*/}
        <form className="SubmissionColumn">
          <label id="SCol" className="ColumnTitle">{eventName} Your Availability</label>
          <div style={{ height: "2%" }}
          />
          <div
            style={{
              backgroundColor: "white",
              fontWeight: "600",
              height: "6%",
              textAlign: "middle"
            }}
          >
            {startTime}-{endTime} ({TZ})
          </div>
          <div style={{ height: "2%" }} />
          <Calendar
            format="MM/DD/YYYY"

            style={{
              borderRadius: "0px",
              boxShadow: "0 0 0 0",
            }}

            datePanel

            multiple



            showOtherDays

            value={participantDates}
            onChange={setParticipantDates}

            plugins={[<DatePanel sort="date" wrapperClassName="datePanelContainer" />, <TimePicker hideSeconds position="right" />]}
          />

          <div>
            <input type="submit" value="Submit Availability" onClick={() => navigate("/confirmation")}></input>
          </div>
        </form>
      </div>
    );
  }


  // Show all participant availabilities 
  function showAllParticipants() {
    return (
      <div>
        <div className="gridContainer">

          <div className="innerGrid">
            {[...Array(12)].map((_, row) => (
              <div key={row} className="grid-row">
                {[...Array(participantDates.length + 1)].map((_, col) => (
                  <GridCell
                    key={col}
                    row={row}
                    col={col}
                    selected={selectedCells.some(cell => cell.row === row && cell.col === col)}
                    customArray={gridArray}
                    onClick={handleCellClick}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <textarea
          className="coordinates-textbox"
          readOnly
          value={coordinates}
          placeholder="Selected Coordinates"
        />

      </div>
    );
  }


  // Choose between the two subpages
  let [currentPage, changeCurrentPage] = useState(1);
  function chooseBetween() {
    // To go from your availability to all 
    if (currentPage == 1) {
      return (
        <div>
          <button className="defaultButton"  onClick={(e) => { changeCurrentPage(-1) }}>See All Participant Availability</button>
        </div>
      );

    // To go from all to your availability 
    } else if (currentPage == -1) {
      return (
        <div>
          <button className="defaultButton" onClick={(e) => { changeCurrentPage(1) }}>See Personal Availability</button>
        </div>
      );
    }
  }



  return (
    <div className="CalendarApp">

      {Title()}

      <div style={{
        height: "10vh",
        width: "100%",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        display: "flex"
      }}>
        {chooseBetween()}
      </div>

      <div
        style={{
          width: "100%",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          display: "flex"
        }}>



        {(currentPage == 1) ? participantSubmission() : showAllParticipants()}


      </div>


    </div>





  );
}

export default Participants;