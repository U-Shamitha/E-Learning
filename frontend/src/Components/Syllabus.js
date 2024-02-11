import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortUp,
  faSortDown,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "../axios/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/userSlice";

const Syllabus = ({ syllabus, courseId, isEnrolled }) => {
  console.log('courseId', courseId);
  const [expandedIndex, setExpandedIndex] = useState(syllabus.map(() => false));
  const [completedWeeks, setCompletedWeeks] = useState([]);
  const [isEdited, setIsEdited] = useState(false);


  const user = useSelector((state) => state.user.userDetails);

  useEffect(() => {
    //setCompletedWeeks for this course
    if(user?.enrolledCourses?.find((course) => course.courseId == courseId)
    ?.completedWeeks){
      console.log(
        user?.enrolledCourses?.find((course) => course.courseId == courseId)
          ?.completedWeeks
      );
      setCompletedWeeks(
        user?.enrolledCourses?.find((course) => course.courseId == courseId)
          ?.completedWeeks
      );
    }
  }, [user]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleExpand = (index) => {
    setExpandedIndex((prev) => {
      const newExpansions = [...prev];
      newExpansions[index] = !newExpansions[index];
      return newExpansions;
    });
  };

  const handleCheckboxChange = (index) => {
    setIsEdited(true);
    if (completedWeeks.includes(index)) {
      setCompletedWeeks((prev) =>
        prev.filter((weekIndex) => weekIndex !== index)
      );
    } else {
      setCompletedWeeks((prev) => [...prev, index]);
    }
  };

  const handleMarkAsComplete = () => {
    setIsEdited(true);
    if (completedWeeks.length == syllabus.length) {
      setCompletedWeeks([]);
    } else {
      setCompletedWeeks(syllabus.map((week, index) => index));
    }
  };

  const isWeekComplete = (index) => {
    return completedWeeks.includes(index);
  };

  const handleConfirmCourseCompletion = () => {
    console.log("userId", user._id);
    axios
      .post(
        `/updateCourseCompletionInEnrolledCourses/${user._id}/course/${courseId}`,
        { newCompletedWeeks: completedWeeks }
      )
      .then((res) => {
        setIsEdited(false);
        console.log(res.data.user);
        localStorage.setItem("currentUser", JSON.stringify(res.data.user));
        dispatch(fetchUser());
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontWeight: "bold", fontSize: "20px" }}>Syllabus</p>
        {isEnrolled && <input
          type="checkbox"
          checked={completedWeeks?.length == syllabus?.length}
          onChange={handleMarkAsComplete}
          style={{ marginRight: "10px" }}
        />}
      </div>
      {syllabus.map((item, index) => (
        <div key={index}>
          <div
            style={{
              paddingLeft: "15px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              onClick={() => toggleExpand(index)}
              style={{
                cursor: "pointer",
                marginBottom: "2px",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon
                icon={expandedIndex[index] ? faSortUp : faSortDown}
                style={{ marginTop: expandedIndex[index] ? "12px" : "-5px" }}
              />
              <span style={{ paddingLeft: "10px" }}>
                Week{index + 1}: &nbsp; {item.topic}
              </span>
            </div>
            {isEnrolled && 
              <input
                type="checkbox"
                checked={isWeekComplete(index)}
                onChange={() => handleCheckboxChange(index)}
                style={{ marginRight: "10px" }}
              />
            }
          </div>
          {expandedIndex[index] && (
            <div>
              <p style={{ paddingLeft: "45px" }}>{item.content}</p>
            </div>
          )}
        </div>
      ))}
      {isEnrolled && 
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            className="register-btn"
            type="button"
            onClick={handleConfirmCourseCompletion}
            style={{ margin: "10px", backgroundColor: !isEdited ? '#aaa9a9d5' : '', disabled: !isEdited}}
          >
            <FontAwesomeIcon icon={faCheck} /> &nbsp;Mark{" "}
            {completedWeeks.length > 0 && completedWeeks.length == syllabus.length
              ? "Course "
              : completedWeeks.map((week, index) => (
                  <span key={index}>
                    Week{week + 1}
                    {index !== completedWeeks.length - 1 && ", "}{" "}
                  </span>
                ))}
            As Complete
          </button>
        </div>
      }
    </div>
  );
};

export default Syllabus;
