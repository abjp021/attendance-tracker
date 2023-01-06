import React, { useEffect, useState } from "react";
import "./form.css";

function StudentTable() {
  const [student, setStudent] = useState([]);
  const [strength, setStrength] = useState();
  const [delStudent, setDelStudent] = useState();

  //Fetch Data from DB
  const getStudent = () => {
    fetch("http://localhost:3001")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // console.log(data)
        let studentData = data.data;
        let studentStrength = data.count; //For Displaying Current Strength

        setStudent(studentData);
        setStrength(studentStrength);
      });
  };
  //Display new Data in table without refreshing
  useEffect(() => {
    getStudent();
  }, [student]);

  //Handle Delete Request
  const handleClick = async (e) => {
    if (e) {
      setDelStudent(e);
      // console.log(delStudent);
      await fetch("http://localhost:3001/delete/" + delStudent).then(
        (response) => {
          return response.json();
        }
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <h3>Current Strength: {strength} </h3>
      <table>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Check-in Time</th>
            <th>Check-out Time</th>
            <th>Check-out Manually </th>
          </tr>
        </thead>

        <tbody>
          {student.map((currEle) => {
            return (
              <tr key={currEle._id}>
                <td>{currEle.rollNo} </td>
                <td>{currEle.name} </td>
                <td> {currEle.inTime} </td>
                <td> {currEle.outTime} </td>
                <td>
                  <button style={{backgroundColor :"red"}} onClick={() => handleClick(currEle._id)}>Check out Now</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
