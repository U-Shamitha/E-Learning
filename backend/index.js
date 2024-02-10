const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 5000;
const dotenv = require("dotenv"); //  Loads environment variables from .env file
dotenv.config({ path: ".env" });
const { cloudinary } = require("./config/cloudinaryConfig");
const { Courses } = require("./models/Course");
const { Users } = require("./models/User");

app.use(bodyParser.json());

// Allow requests from specific origins
// app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cors());

mongoose.connect(process.env.MONGODB_URL, { dbName: process.env.DB_NAME });

//routes
app.post("/api/register", async (req, res) => {
  try {
    console.log(req.body);
    const user = new Users({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      favouriteCourses: [],
    });
    await user.save();
    res.status(201).json({ user: user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
});

app.post("/updateProfile/:id", async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    const update = {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      },
    };
    await Users.updateOne(filter, update);
    const user = await Users.findOne(filter);
    res.status(201).json({ user: user });
  } catch {
    console.log(error);
    res.status(400).json({ error: error });
  }
});

//enroll to new course
app.post("/updateUserEnrolledCourses/add/:id", async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.body.newEnrolledCourse);
    let filter = { _id: req.params.id };
    let update = {
      $push: {
        enrolledCourses: req.body.newEnrolledCourse,
      },
    };
    await Users.updateOne(filter, update);
    const user = await Users.findOne(filter);

    filter = { _id: req.body.newEnrolledCourse.courseId };
    update = {
      $push: {
        enrolledStudents: { studentId: req.params.id, name: user.name },
      },
    };
    await Courses.updateOne(filter, update);

    res.status(201).json({ user: user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
});

//update completed weeks in enrolled course details
app.post(
  "/updateCourseCompletionInEnrolledCourses/:userId/course/:courseId",
  async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.body.newCompletedWeeks);
      const filter = {
        _id: req.params.userId,
        "enrolledCourses.courseId": req.params.courseId,
      };
      const updateOperation = {
        $set: {
          "enrolledCourses.$.completedWeeks": req.body.newCompletedWeeks,
        },
      };
      await Users.updateOne(filter, updateOperation);
      const user = await Users.findOne(filter);

      res.status(201).json({ user: user });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error });
    }
  }
);

//add to favourite courses
app.post("/updateUserFav/add/:id", async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.body.newFavouriteCourse);
    const filter = { _id: req.params.id };
    const update = {
      $push: {
        favouriteCourses: req.body.newFavouriteCourse,
      },
    };
    await Users.updateOne(filter, update);
    const user = await Users.findOne(filter);
    res.status(201).json({ user: user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
});

app.post("/updateUserFav/remove/:id", async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.body.newFavouriteCourse);
    const filter = { _id: req.params.id };
    const update = {
      $pull: {
        favouriteCourses: req.body.newFavouriteCourse,
      },
    };
    await Users.updateOne(filter, update);
    const user = await Users.findOne(filter);
    res.status(201).json({ user: user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
});

app.get("/favouriteCourses/:id", async (req, res) => {
  try {
    const user = await Users.findOne({ _id: req.params.id });

    if (user) {
      const favoriteCourseIds = user.favouriteCourses.map(
        (favCourse) => favCourse.courseId
      );

      // Find the favorite courses based on the IDs in the array
      const favoriteCourses = await Courses.find({
        _id: { $in: favoriteCourseIds },
      });

      res.status(201).json({ favouriteCourses: favoriteCourses });

      // console.log('Favorite courses:', favoriteCourses);
    } else {
      console.log("User not found.");
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/login", async (req, res) => {
  try {
    // console.log(req.body);
    const user = await Users.findOne({ email: req.body.email });
    if (user != null) {
      if (user.password == req.body.password) {
        res.status(201).json({ user: user });
      } else {
        res.status(201).json({ error: "Wrong Password" });
      }
    } else {
      res.status(201).json({ error: "User does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
});

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, callback) {
    callback(null, true);
  },
});

app.post(
  "/upload",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 30 },
  ]),
  async (req, res) => {
    try {
      const newContent = new Courses({
        name: req.body.name,
        category: req.body.category,
        duration: req.body.duration,
        schedule: req.body.schedule,
        dueDate: new Date(),
        location: req.body.location,
        enrollmentStatus: req.body.enrollmentStatus,
        prerequisites: JSON.parse(req.body.prerequisites),
        syllabus: JSON.parse(req.body.syllabus),
        description: req.body.description,
        instructor: req.body.owner,
        image: {
          data: req.files["image"][0].buffer,
          name: req.files["image"][0].originalname,
          contentType: req.files["image"][0].mimetype,
        },
      });

      // Store video files in the 'videos' field
      if (req.files) {
        console.log(req.files);

        req.files["video"].map(async (videoFile, index) => {
          //Video upload to Cloudinary
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                { folder: "uploads", resource_type: "video" },
                (error, result) => {
                  if (error) {
                    console.error(error);
                    reject(error);
                    return res
                      .status(500)
                      .json({ message: "Internal Server Error" });
                  } else {
                    resolve(result);
                  }
                }
              )
              .end(videoFile.buffer);
          });
          if (result) {
            console.log(result);
            newContent.videos[index] = {
              link: result.secure_url,
              name: videoFile.originalname,
            };
            console.log(newContent);
            if (index == req.files["video"].length - 1) {
              const course = await newContent.save();
              res
                .status(201)
                .json({ msg: "File uploaded successfully.", course });
            }
          } else {
            console.log(result);
            return res.status(500).json({ message: "Internal Server Error" });
          }
        });
      }

      // console.log(newContent)

      // const course = await newContent.save();
      // res.status(201).json({ msg: "File uploaded successfully.", course });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error uploading file.");
    }
  }
);

// Set up a route for cousre updates
app.post(
  "/updateCourse/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 30 },
  ]),
  async (req, res) => {
    let courseDetails = {
      name: req.body.name,
      category: req.body.category,
      duration: req.body.duration,
      schedule: req.body.schedule,
      dueDate: new Date(),
      location: req.body.location,
      enrollmentStatus: req.body.enrollmentStatus,
      prerequisites: JSON.parse(req.body.prerequisites),
      syllabus: JSON.parse(req.body.syllabus),
      description: req.body.description,
      instructor: req.body.owner,
    };

    if (req.files["image"]) {
      courseDetails.image = {
        data: req.files["image"][0].buffer,
        name: req.files["image"][0].originalname,
        contentType: req.files["image"][0].mimetype,
      };
    }

    try {
      if (req.files["video"]) {
        console.log(req.files);

        const videos = req.files["video"].map(async (videoFile, index) => {
          //Video upload to Cloudinary
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                { folder: "uploads", resource_type: "video", timeout: 600000 },
                (error, result) => {
                  if (error) {
                    console.error(error);
                    reject(error);
                    return res
                      .status(500)
                      .json({ message: "Internal Server Error" });
                  } else {
                    resolve(result);
                  }
                }
              )
              .end(videoFile.buffer);
          });
          if (result) {
            console.log(result);
            videos[index] = {
              link: result.secure_url,
              name: videoFile.originalname,
            };
            console.log(videos);
            if (index == req.files["video"].length - 1) {
              const filter = { _id: req.params.id };
              const update = {
                $set: {
                  ...courseDetails,
                  videos: videos,
                },
              };
              await Courses.updateOne(filter, update);

              res.status(201).send("File uploaded successfully.");
            }
          } else {
            console.log(result);
            return res.status(500).json({ message: "Internal Server Error" });
          }
        });
      } else {
        const filter = { _id: req.params.id };
        const update = {
          $set: courseDetails,
        };
        await Courses.updateOne(filter, update);

        res.status(201).send("File uploaded successfully.");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error uploading file.");
    }
  }
);

// Create an API endpoint to fetch the list of courses
app.get("/courses", async (req, res) => {
  try {
    const courses = await Courses.find();
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Create an API endpoint to fetch the list of courses of particular user
app.get("/courses/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const course = await Courses.find({ instructor: userId });
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Create an API endpoint to fetch the list of courses
app.get("/courseContent/:id", async (req, res) => {
  try {
    // Convert the targetId to an ObjectID
    const courseId = req.params.id;
    const course = await Courses.findOne({ _id: courseId });
    // console.log(course);
    const instructorDetails = await Users.findById(course.instructor);
    course.instructorDetails = instructorDetails;
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
