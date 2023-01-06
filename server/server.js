const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader(
    "Access-Control-Allow-Origin",
    "http://localhost:3000",
    "https://attendance-management.onrender.com"
  );

  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
//DB Connection
require('dotenv').config();
const uri = process.env.ATLAS_URI
console.log(uri);
mongoose.connect(uri, {useNewUrlParser: true});

const db = mongoose.connection;
db.on("error", (err) => {
  console.log("Error: " + err);
});
db.once("connected", () => {
  console.log("DB Connected!");
});

//Making Student Schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollNo: {
    type: String,
    required: true,
  },
  inTime: {
    type: String,
    required: true,
  },
  outTime: {
    type: String,
    required: true,
  },
});

//Student Model
const Student = mongoose.model("Student", studentSchema);

//Get Data from MongoDB
app.get("/", async (req, res) => {
  try {
    const students = await Student.find();

    return res.status(200).json({
      success: true,
      count: students.length, //Keeping count of Students
      data: students, //Data of Students
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

//Post Data from Front-end to MongoDB
app.post("/", async (req, res) => {
  const { name, rollNo, inTime, outTime } = req.body;

  if (!name || !rollNo || !inTime || !outTime) {
    return res.status(422).json({ error: "Please fill all fields" });
  }

  try {
    const studentExists = await Student.findOne({ rollNo: rollNo });

    if (studentExists) {
      return res.status(409).json({ error: "Student Checked In Already!" });
    } else {
      const student = new Student({ name, rollNo, inTime, outTime });
      await student.save();

      res.status(201).json({ message: "Student registered sucessfully!" });
      res.render("/");
    }
  } catch (err) {
    console.log(err);
  }
});

//Delete Student Record
app.get("/delete/:id", (req, res) => {
  // console.log(req.params.id);
  Student.findByIdAndDelete({ _id: req.params.id }, (res) => {
    try {
      if (res) {
        console.log("Student Checked-out sucessfully!");
      }
    } catch (err) {
      console.log(err);
    }
  });
});

app.listen(3001, () => {
  console.log("Server Started on port 3001");
});
