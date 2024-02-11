import React, { useEffect } from "react";

import "../css/Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSelectedCourse, fetchUser, setUser } from "../redux/userSlice";

const Header = () => {
  const { userDetails: user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchSelectedCourse());
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Add an event listener for the "storage" event on the window object
  window.addEventListener("storage", function (e) {
    if (e.key === "currentUser") {
      // navigate(0);
      dispatch(fetchUser());
      console.log("LocalStorage data changed:", e.newValue);
    }else if(e.key === "selectedCourse"){
      dispatch(fetchSelectedCourse());
    }
  });

  return (
    <header>
      <h2>Online Courses</h2>
      {!user?._id && (
        <span>
          <Link to="/register">
            <span className="white-text">Register &nbsp; &nbsp;</span>
          </Link>
          <Link to="/login">
            <span className="white-text">Login &nbsp; &nbsp;</span>
          </Link>
        </span>
      )}
    </header>
  );
};

export default Header;
