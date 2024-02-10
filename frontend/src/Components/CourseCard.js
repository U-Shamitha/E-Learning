import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";

import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setSelectedCourse } from "../redux/userSlice";

const CourseCard = ({ course, updatable }) => {
  const blob = new Blob([Int8Array.from(course.image.data.data)], {
    type: course.image.contentType,
  });
  const image = window.URL.createObjectURL(blob);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCourseSelection = () => {
    dispatch(setSelectedCourse(course._id));
    localStorage.setItem("selectedCourse", JSON.stringify(course._id));
    navigate(`/courseContent`);
  };

  const handleCourseUpdate = () => {
    localStorage.setItem("selectedCourse", JSON.stringify(course._id));
    navigate(`/updateCourse`);
  };

  return (
    <div className="course-card" style={{ width: "250px" }}>
      <div className="course-image">
        <img height="200" width="200" src={image} alt={course.name} />
      </div>
      <div className="course-details">
        <h3>{course.name}</h3>
        <p>{course.category}</p>
        <p>{course.duration} months</p>
        {/* <p>{course.description}</p> */}
        <button
          className={`view-course-button ${updatable ? "u" : "nu"}`}
          onClick={handleCourseSelection}
        >
          View Course
        </button>
        {updatable && (
          <button className="edit-course-button" onClick={handleCourseUpdate}>
            <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
