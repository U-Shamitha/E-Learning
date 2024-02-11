import React, { useState, useEffect } from "react";
import axios from "../axios/axiosConfig";

import "../css/CourseCard.css";
import VideoCard from "./VideoCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faUserCheck,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as unstar } from "@fortawesome/free-regular-svg-icons";
import Syllabus from "./Syllabus";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/userSlice";

function CourseContent() {
  const [course, setCourse] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading]= useState(true);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const { userDetails: user} = useSelector((state) => state.user);
  const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse'));

  const dispatch = useDispatch();

  useEffect(()=>{
    if(selectedCourse){
      axios
        .get(`/courseContent/${selectedCourse}`)
        .then((response) => {
          // console.log("selected course", response.data);
          user?.favouriteCourses && setIsFavourite(user.favouriteCourses.some((favcourse) => favcourse.courseId == response.data._id));
            const blob = new Blob([Int8Array.from(response.data.image.data.data)], {
            type: response.data.image.contentType,
          });
          setImage(window.URL.createObjectURL(blob));
          setCourse(response.data);
          setLoading(false);
        },[])
        .catch((error) => {
          console.error(error);
        });
      }
  },[])

  useEffect(()=>{
    user?.favouriteCourses && setIsFavourite(user.favouriteCourses.some((favcourse) => favcourse.courseId == selectedCourse));
    user?.enrolledCourses && course && setIsEnrolled(
      user.enrolledCourses.some((enrolledCourse) => enrolledCourse.courseId == course._id)
    )
  }
  ,[user, course])

  const handleAddCourseToFav = (e) => {
    console.log(e.target);
    e.target.disabled = true;
    e.target.style.backgroundColor = '#aaa9a9d5';
    e.target.style.color = 'grey'
    axios
      .post(`updateUserFav/add/${user._id}`, {
        newFavouriteCourse: { courseId: course._id, courseName: course.name },
      })
      .then(async(res) => {
        localStorage.setItem("currentUser", JSON.stringify(res.data.user));
        dispatch(fetchUser())
        e.target.disabled = false;
        e.target.backgroundColor = '';
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  const handleRemoveCourseToFav = (e) => {
    console.log(e.target);
    e.target.disabled = true;
    e.target.style.backgroundColor = '#aaa9a9d5';
    e.target.style.color = 'grey'
    console.log(e.target);
    axios
      .post(`updateUserFav/remove/${user._id}`, {
        newFavouriteCourse: { courseId: course._id, courseName: course.name },
      })
      .then((res) => {
        localStorage.setItem("currentUser", JSON.stringify(res.data.user));
        dispatch(fetchUser())
        e.target.disabled = false;
        e.target.backgroundColor = '';
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  const handleEnrollCourse = (e) => {
    e.target.disabled = true;
    e.target.style.backgroundColor = '#aaa9a9d5';
    e.target.style.color = 'grey'
    axios
      .post(`updateUserEnrolledCourses/add/${user._id}`, {
        newEnrolledCourse: { courseId: course._id, courseName: course.name },
      })
      .then((res) => {
        e.target.disabled = false;
        e.target.style.backgroundColor = '';
        e.target.style.color = '';
        localStorage.setItem("currentUser", JSON.stringify(res.data.user));
        dispatch(fetchUser())
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  return (
    <div>
      <h2 className="courseContent-heading">Course Details</h2>
      <div className="course-details-con ">
        {!loading
          ? course && (
              <>
                <div className="detail1">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <img src={image} width={150} />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        gap: "10px",
                        width: "100%",
                      }}
                    >
                      {user && !isFavourite && (
                        <button
                          className="register-btn"
                          type="button"
                          onClick={handleAddCourseToFav}
                          style={{ width: "45%" }}
                        >
                          <FontAwesomeIcon icon={faStar} pointerEvents='none'/> &nbsp;Add
                        </button>
                      )}
                      {user && isFavourite && (
                        <button
                          className="register-btn"
                          type="button"
                          onClick={handleRemoveCourseToFav}
                          style={{ backgroundColor: "red", width: "45%" }}
                        >
                          <FontAwesomeIcon icon={unstar} pointerEvents='none' /> &nbsp;Remove
                        </button>
                      )}
                      {isEnrolled ? (
                        <button
                          className="register-btn"
                          type="button"
                          style={{ backgroundColor: "green" }}
                        >
                          <FontAwesomeIcon icon={faUserCheck} pointerEvents='none'/> &nbsp;Enrolled
                        </button>
                      ) : (
                        <button
                          className="register-btn"
                          type="button"
                          onClick={handleEnrollCourse}
                        >
                          <FontAwesomeIcon icon={faUserPlus} pointerEvents='none'/> &nbsp;Enroll
                        </button>
                      )}
                    </div>
                  </div>
                  <span className="detail1-2">
                    <div>
                      <p style={{ fontWeight: "bold", fontSize: "24px" }}>
                        {course.name}
                      </p>
                      <p>
                        <span style={{ color: "gray", paddingRight: "10px" }}>
                          Category:
                        </span>
                        {course.category}
                      </p>
                      <p>
                        <span style={{ color: "gray", paddingRight: "10px" }}>
                          Duration:
                        </span>
                        {course.duration}
                      </p>
                      <p>
                        <span style={{ color: "gray", paddingRight: "10px" }}>
                          Schedule:
                        </span>
                        {course.schedule}
                      </p>
                      <p>
                        <span style={{ color: "gray", paddingRight: "10px" }}>
                          Due Date:
                        </span>
                        {course.dueDate.split("T")[0]}
                      </p>
                      <p>
                        <span style={{ color: "gray", paddingRight: "10px" }}>
                          Location:
                        </span>
                        {course.location}
                      </p>
                      <p>
                        <span style={{ color: "gray", paddingRight: "10px" }}>
                          Enrollment Status:
                        </span>
                        {course.enrollmentStatus == "Open" && (
                          <span style={{ color: "blue" }}>Open</span>
                        )}
                        {course.enrollmentStatus == "In Progress" && (
                          <span style={{ color: "green" }}>In Progress</span>
                        )}
                        {course.enrollmentStatus == "Closed" && (
                          <span style={{ color: "red" }}>Closed</span>
                        )}
                      </p>
                      <p>
                        <span style={{ color: "gray", paddingRight: "10px" }}>
                          Author:
                        </span>
                        {course?.instructorDetails?.name}
                      </p>
                    </div>
                  </span>
                </div>
                <div>
                  {/* Prerequisites */}
                  <div>
                    <p style={{ fontWeight: "bold", fontSize: "20px" }}>
                      Prerequisites
                    </p>
                    <p style={{ paddingLeft: "15px" }}>
                      {course.prerequisites.map((prerequisite, index) => (
                        <span key={index}>
                          {prerequisite}{" "}
                          {index != prerequisite.length - 1 && ","}&nbsp;&nbsp;
                        </span>
                      ))}
                    </p>
                  </div>

                  {/* Syllabus */}
                  <Syllabus syllabus={course.syllabus} courseId={course._id} isEnrolled={isEnrolled}/>

                  {/* Description */}
                  <div>
                    <p style={{ fontWeight: "bold", fontSize: "20px" }}>
                      Description
                    </p>
                    <p style={{ lineHeight: "1.5", paddingLeft: "15px" }}>
                      {course.description}
                    </p>
                  </div>
                </div>
              </>
            )
          : "Loading..."}
      </div>
      {/* Video Playlist */}
      <h2 className="courseContent-heading">Course Playlist</h2>
      <div className="videos-grid">
        {course &&
          course.videos.map((video, index) => (
            <VideoCard key={index} video={video} />
          ))}
      </div>
    </div>
  );
}

export default CourseContent;
