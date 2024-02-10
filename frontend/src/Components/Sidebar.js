import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faFolder, faHome, faStar, faUser } from '@fortawesome/free-solid-svg-icons';

import '../css/Sidebar.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';



const Sidebar = ({ isOpen, toggleSidebar }) => {

    const activeTab = useSelector((state) => state.activeTab);

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={toggleSidebar}>
          X
        </button>
        <ul>
        <Link to="/">
          <li>
            {isOpen ? (
              <FontAwesomeIcon icon={faHome}  className= {`open sidebar-icon ${activeTab=="home" && 'active'}`}/>
            ) : (
              <FontAwesomeIcon icon={faHome}  className='closed sidebar-icon' /> /* Show icon even when closed */
            )}
            <span>Home</span>
          </li>
          </Link>
          <Link to="/addCourse">
          <li>
            {isOpen ? (
              <FontAwesomeIcon icon={faAdd}  className={`open sidebar-icon ${activeTab=="addCourse" && 'active'}`} />
            ) : (
              <FontAwesomeIcon icon={faAdd}  className='closed sidebar-icon' /> /* Show icon even when closed */
            )}
            <span>Add Course</span>
          </li>
          </Link>
          <Link to="/addCourse">
          <li>
            {isOpen ? (
              <FontAwesomeIcon icon={faStar}  className={`open sidebar-icon ${activeTab=="favCourses" && 'active'}`} />
            ) : (
              <FontAwesomeIcon icon={faStar}  className='closed sidebar-icon' /> /* Show icon even when closed */
            )}
            <span>Favourite Courses</span>
          </li>
          </Link>
          <Link to="/profile">
          <li>
            {isOpen ? (
              <FontAwesomeIcon icon={faUser}  className={`open sidebar-icon ${activeTab=="profile" && 'active'}`} />
            ) : (
              <FontAwesomeIcon icon={faUser}  className='closed sidebar-icon' /> /* Show icon even when closed */
            )}
            <span>User</span>
          </li>
          </Link>
        </ul>
      </div>
    );
};

export default Sidebar;