const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: String,
    favouriteCourses: [
      {
        courseId: String,
        courseName: String,
      }, 
    ],
    enrolledCourses: [
        {
          courseId: String,
          courseName: String,
          completedWeeks: []
        }, 
    ],
  });

const Users = mongoose.model("users", UserSchema);

module.exports = {Users}; 