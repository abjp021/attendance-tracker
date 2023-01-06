import React, { useState } from "react";
import "react-bootstrap";
import "./form.css";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
} from "mdb-react-ui-kit";

import StudentTable from "./StudentTable";

function Form() {
  const [student, setStudent] = useState({
    name: "",
    rollNo: "",
    inTime: "",
    outTime: "",
  });

  const handleInputs = (e) => {
    // console.log(e);
    const name = e.target.name;
    const value = e.target.value;

    // console.log(name,value);
    setStudent({ ...student, [name]: value });
  };

  //Posting Data to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, rollNo, inTime, outTime } = student;

    const res = await fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        rollNo,
        inTime,
        outTime,
      }),
    });

    await res.json();

    const status = res.status;

    if (status === 201) {
      window.alert("Check-in Sucessfull!");
    } else if (status === 409) {
      window.alert("Student Already Checked In!");
    } else {
      window.alert("Fill All fileds!");
    }

    //Resetting State of the Form
    setStudent({
      name: "",
      rollNo: "",
      inTime: "",
      outTime: "",
    });
  };

  return (
    <MDBContainer fluid>
      <MDBCard className="text-black m-5" style={{ borderRadius: "25px" }}>
        <MDBCardBody>
          <form method="POST" onSubmit={handleSubmit}>
            <MDBRow>
              <MDBCol
                md="10"
                lg="6"
                className="order-2 order-lg-1 d-flex flex-column align-items-center"
              >
                <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                  Student Attendance
                </p>

                <label className="mb-1">Full Name</label>
                <div className="d-flex flex-row align-items-center mb-4 ">
                  <input
                    name="name"
                    id="form1"
                    type="text"
                    className="w-100"
                    value={student.name}
                    onChange={handleInputs}
                  />
                </div>

                <label className="mb-1">Your Roll Number</label>
                <div className="d-flex flex-row align-items-center mb-4">
                  <input
                    name="rollNo"
                    id="form2"
                    type="text"
                    value={student.rollNo}
                    onChange={handleInputs}
                  />
                </div>

                <label className="mb-1">Check-in Time</label>
                <div className="d-flex flex-row align-items-start mb-4">
                  <input
                    name="inTime"
                    id="form2"
                    type="time"
                    value={student.inTime}
                    onChange={handleInputs}
                  />
                </div>

                <label className="mb-1">Check-out Time</label>
                <div className="d-flex flex-row align-items-start mb-4">
                  <input
                    name="outTime"
                    id="form2"
                    type="time"
                    value={student.outTime}
                    onChange={handleInputs}
                  />
                </div>

                <button type="submit" className="button button1">
                  Check-in
                </button>
              </MDBCol>
              <MDBCol
                md="10"
                lg="6"
                className="order-1 order-lg-2 d-flex align-items-center"
              >
                <MDBCardImage
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                  fluid
                />
              </MDBCol>
            </MDBRow>
          </form>
        </MDBCardBody>
      </MDBCard>

      <StudentTable />
    </MDBContainer>
  );
}

export default Form;
