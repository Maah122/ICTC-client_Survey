import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"; // ✅ Add this
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../Admin.css";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); // ✅ Add this

  // Get token from localStorage and decode it
  const token = localStorage.getItem("token");
  let userRights = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRights = decoded.user_rights;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  // If no valid userRights, don't show sidebar
  if (!userRights) return null;

  const isAdmin = userRights === "Admin"; // Capital A

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear(); // Optional: clear other saved data
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="d-flex">
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        {/* Toggle Button */}
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          ☰
        </button>

        <ul className="nav flex-column">
          {/* Always visible: Dashboard */}
          <li className="nav-item">
            <a href="/dashboard" className="nav-link" title="Dashboard">
              <i className="bi-person-circle"></i>
              <span className="link-text"> Dashboard </span>
            </a>
          </li>

          {/* Admin Only: Manage Surveys */}
          {isAdmin && (
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="collapse" href="#surveyMenu" role="button" title="Manage Survey">
                <i className="bi bi-card-heading"></i>
                <span className="link-text"> Manage Surveys</span>
              </a>
              <div className="collapse" id="surveyMenu">
                <ul className="nav flex-column ms-3">
                  <li>
                    <a href="/add-survey" className="nav-link" title="Add Survey">
                      <i className="bi bi-file-diff"></i>
                      <span className="link-text"> Add Survey</span>
                    </a>
                  </li>
                  <li>
                    <a href="/managesurvey" className="nav-link" title="Manage Survey">
                      <i className="bi bi-table"></i>
                      <span className="link-text"> Survey</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          )}

          {/* Admin Only: Manage Offices */}
          {isAdmin && (
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="collapse" href="#officeMenu" role="button" title="Manage Office">
                <i className="bi bi-building-fill"></i>
                <span className="link-text"> Manage Offices</span>
              </a>
              <div className="collapse" id="officeMenu">
                <ul className="nav flex-column ms-3">
                  <li>
                    <a href="/add-office" className="nav-link" title="Add Office">
                      <i className="bi bi-building-add"></i>
                      <span className="link-text"> Add Office</span>
                    </a>
                  </li>
                  <li>
                    <a href="/manageoffice" className="nav-link" title="Manage Office">
                      <i className="bi bi-table"></i>
                      <span className="link-text"> Office</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          )}

          {/* Admin Only: Manage Users */}
          {isAdmin && (
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="collapse" href="#usersMenu" role="button" title="Users">
                <i className="bi bi-people"></i>
                <span className="link-text"> Manage Users</span>
              </a>
              <div className="collapse" id="usersMenu">
                <ul className="nav flex-column ms-3">
                  <li>
                    <a href="/add-user" className="nav-link" title="Add User">
                      <i className="bi bi-person-plus"></i>
                      <span className="link-text"> Add User</span>
                    </a>
                  </li>
                  <li>
                    <a href="/manageuser" className="nav-link" title="Manage Users">
                      <i className="bi bi-gear"></i>
                      <span className="link-text"> Users</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          )}
          {/* ✅ Logout Button */}
          <li className="nav-item mt-auto">
            <button
              className="nav-link text-start w-100 bg-transparent border-0"
              onClick={handleLogout}
              title="Logout"
              style={{ color: "red" }}
            >
              <i className="bi bi-box-arrow-right"></i>
              <span className="link-text"> Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
