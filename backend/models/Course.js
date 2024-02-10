const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: String,
    category: String,
    duration: String,
    description: String,
    instructor: String,
    dueDate: Date,
    instructorDetails: {},
    enrollmentStatus: {
        type: String,
        enum: ['Open', 'Closed', 'In Progress'],
        default: 'Open'
    },
    schedule: String,
    location: {
        type: String,
        enum: ['Online', 'Offline'],
        default: 'Online'
    },
    prerequisites: [],
    syllabus: [
        {
            week: Number,
            topic: String,
            content: String
        }
    ],
    enrolledStudents: [{
        studentId: String,
        name: String,
    }],
    image: { data: Buffer, contentType: String, name: String },
    videos: [
      {
        link: String,
        name: String,
      },
    ],
  });

const Courses = mongoose.model("Course", CourseSchema);

module.exports = {Courses};