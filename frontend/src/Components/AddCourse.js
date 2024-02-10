import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "../axios/axiosConfig";
import "../css/AddCourse.css";
import Loading from "./Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../redux/userSlice";

const AddCourse = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [videos, setVideos] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLoaction] = useState("Online");
  const [enrollmentStatus, setEnrollmentStatus] = useState("Open");
  const [schedule, setSchedule] = useState("");
  const [prerequisites, setPrerequisites] = useState([""]);
  const [syllabus, setSyllabus] = useState([
    { week: "", topic: "", content: "" },
  ]);
  const [description, setDescription] = useState("");
  const [errorMsg, setErrMsg] = useState("");

  const user = useSelector((state) => state.user.userDetails);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveTab("addCourse"));
  }, []);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    // Check if the selected file is an image (e.g., JPEG, PNG, or GIF)
    if (selectedImage && selectedImage.type.startsWith("image/")) {
      setErrMsg("");
      setImage(selectedImage);
    } else {
      // alert('Please select a valid image file (JPEG, PNG, or GIF).');
      setErrMsg("Please select a valid image file (JPEG, PNG, or GIF).");
    }
  };

  const handleVideoChange = (e) => {
    var selectedVideos = e.target.files;
    var error = false;
    console.log("selctedVideos", selectedVideos);
    // Check if the selected file is a video (e.g., MP4)
    if (selectedVideos) {
      for (const file of selectedVideos) {
        if (file && file.type.startsWith("video/")) {
        } else {
          error = true;
        }
      }
    }
    if (error == true) {
      setErrMsg("Please select a valid video file (MP4).");
    } else {
      setErrMsg("");
      setVideos([...selectedVideos]);
    }
  };

  const handleInputChange = (setInputState, e) => {
    setInputState(e.target.value);
  };

  // Function to handle changes in a specific prerequisite input
  const handlePrerequisiteChange = (index, value) => {
    const updatedPrerequisites = [...prerequisites];
    updatedPrerequisites[index] = value;
    setPrerequisites(updatedPrerequisites);
  };
  const handleAddPrerequisite = () => {
    setPrerequisites([...prerequisites, ""]);
  };
  const handleDeletePrerequisite = (index) => {
    if (prerequisites.length > 1) {
      const updatedPrerequisites = [...prerequisites];
      updatedPrerequisites.splice(index, 1);
      setPrerequisites(updatedPrerequisites);
    }
  };

  // Function to handle changes in a specific syllabus entry
  const handleSyllabusChange = (index, field, value) => {
    console.log(syllabus);
    const updatedSyllabus = [...syllabus];
    updatedSyllabus[index][field] = value;
    setSyllabus(updatedSyllabus);
  };
  const handleAddSyllabusEntry = () => {
    setSyllabus([...syllabus, { week: "", topic: "", content: "" }]);
  };
  const handleDeleteSyllabusEntry = (index) => {
    if (syllabus.length > 1 && index == syllabus.length - 1) {
      console.log(syllabus);
      const updatedSyllabus = [...syllabus];
      updatedSyllabus.splice(-1);
      setSyllabus(updatedSyllabus);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("videos", videos);

    if (image == null) {
      setErrMsg("Please select course image");
    } else if (videos.length == 0) {
      setErrMsg("Please upload source content");
    } else {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("duration", duration);
      formData.append("location", location);
      formData.append("enrollmentStatus", enrollmentStatus);
      formData.append("schedule", schedule);
      formData.append("prerequisites", JSON.stringify(prerequisites));
      formData.append(
        "syllabus",
        JSON.stringify(
          syllabus.map((entry, index) => {
            entry.week = index + 1;
            return entry;
          })
        )
      );
      formData.append("description", description);
      formData.append("instructor", user._id);
      formData.append("image", image);
      for (let i = 0; i < videos.length; i++) {
        formData.append("video", videos[i]);
      }

      try {
        await axios.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setIsLoading(false);
        // alert('File uploaded successfully.');
        navigate("/");
      } catch (error) {
        setIsLoading(false);
        console.error(error);
        alert("Error uploading file.");
      }
    }
  };

  return (
    <div className="main-container">
      <h2>Upload Course Content</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="image" className="label">
              Select Course image:
            </label>
            <label
              htmlFor="image"
              className={`custom-file-upload ${
                image != null ? "blue" : "blue"
              }`}
            >
              {image ? image.name : "Upload image"}
            </label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              className="input-file"
              onChange={handleImageChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="video" className="label">
              Course content:
            </label>
            <label
              htmlFor="video"
              className={`custom-file-upload ${
                videos.length > 0 ? "blue" : "blue"
              }`}
            >
              {videos.length > 0
                ? `${videos[0].name} (${videos.length})`
                : "Upload videos"}
            </label>
            <input
              type="file"
              name="video"
              id="video"
              accept="video/*"
              multiple
              className="input-file"
              onChange={handleVideoChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name" className="label">
              Course Name:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => handleInputChange(setName, e)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category" className="label">
              Category:
            </label>
            <input
              type="text"
              name="category"
              id="category"
              value={category}
              onChange={(e) => handleInputChange(setCategory, e)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="duration" className="label">
              Duration:
            </label>
            <input
              type="text"
              name="duration"
              id="duration"
              value={duration}
              onChange={(e) => handleInputChange(setDuration, e)}
              required
            />
          </div>
          {/* <div className="form-group">
            <label htmlFor="duration" className="label">Duration(Months) :</label>
            <input type="number" step={1} min={1} max={12} style={{ width: '190px' }} name='duration' id="duration" value={duration} onChange={handleDurationChange} required />
          </div> */}
          <div className="form-group">
            <label htmlFor="schedule" className="label">
              Schedule:
            </label>
            <input
              type="text"
              name="schedule"
              id="schedule"
              value={schedule}
              onChange={(e) => handleInputChange(setSchedule, e)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="enrollmentStatus" className="label">
              Enrollment Status:
            </label>
            <select
              id="enrollmentStatus"
              className="dropdown"
              value={enrollmentStatus}
              onChange={(e) => handleInputChange(setEnrollmentStatus, e)}
              required
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="location" className="label">
              Location:
            </label>
            <select
              id="location"
              className="dropdown"
              value={location}
              onChange={(e) => handleInputChange(setLoaction, e)}
              required
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
          <div className="form-group">
            <label
              htmlFor="prerequisites"
              className="label"
              style={{ marginRight: "18px" }}
            >
              Prerequisites:{" "}
              <FontAwesomeIcon
                icon={faCirclePlus}
                color="#2381c5"
                onClick={handleAddPrerequisite}
              />
            </label>
            <div>
              {prerequisites.map((prerequisite, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={prerequisite}
                    onChange={(e) =>
                      handlePrerequisiteChange(index, e.target.value)
                    }
                    style={{ marginBottom: "2px" }}
                    required
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    color={prerequisites.length > 1 ? "red" : "grey"}
                    onClick={() => handleDeletePrerequisite(index)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label
              htmlFor="syllabus"
              className="label"
              style={{ alignSelf: "flex-end" }}
            >
              Syllabus:{" "}
              <FontAwesomeIcon
                icon={faCirclePlus}
                color="#2381c5"
                onClick={handleAddSyllabusEntry}
              />
            </label>
            <div>
              {syllabus.map((entry, index) => (
                <div key={index}>
                  <div>
                    <input
                      type="text"
                      placeholder="Week Number"
                      value={"Week " + (index + 1)}
                      disabled
                      style={{ marginLeft: "18px" }}
                      required
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      color={
                        syllabus.length > 1 && index == syllabus.length - 1
                          ? "red"
                          : "grey"
                      }
                      onClick={() => handleDeleteSyllabusEntry(index)}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Topic"
                      value={entry.topic}
                      onChange={(e) =>
                        handleSyllabusChange(index, "topic", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Content"
                      value={entry.content}
                      onChange={(e) =>
                        handleSyllabusChange(index, "content", e.target.value)
                      }
                      style={{ marginBottom: "5px" }}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description" className="label">
              Description:
            </label>
            <textarea
              name="description"
              className="textarea"
              // style={{resize:'horizontal'}}
              id="description"
              value={description}
              onChange={(e) => handleInputChange(setDescription, e)}
              required
            />
          </div>
          <div className="button-container">
            <button type="submit" className="button">
              Upload
            </button>
            {isLoading && <Loading />}
          </div>
        </form>
        <div className="err-msg">{errorMsg}</div>
      </div>
    </div>
  );
};

export default AddCourse;
