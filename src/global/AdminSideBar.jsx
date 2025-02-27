import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Required for Bootstrap's collapse functionality
import "bootstrap-icons/font/bootstrap-icons.css";
import "../Admin.css"; // External styles
import Navbar from "../global/NavBar";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="d-flex">
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        {/* Toggle Button */}
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          ☰
        </button>

        {/* Sidebar Content */}
        <ul className="nav flex-column">
          {/* Add Survey */}
          <li className="nav-item">
            <a href="/add-survey" className="nav-link" title="Add Survey">
              <i className="bi bi-plus-circle"></i>
              <span className="link-text"> Add Survey</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="/managesurvey" className="nav-link" title="Add Survey">
            <i className="bi bi-clipboard-check"></i>
              <span className="link-text"> Manage Survey</span>
            </a>
          </li>

          {/* Users (Collapsible) */}
          <li className="nav-item">
            <a
              className="nav-link"
              data-bs-toggle="collapse"
              href="#usersMenu"
              role="button"
              title="Users"
            >
              <i className="bi bi-people"></i>
              <span className="link-text"> Users</span>
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
                  <a
                    href="/manageuser"
                    className="nav-link"
                    title="Manage Users"
                  >
                    <i className="bi bi-gear"></i>
                    <span className="link-text"> Manage Users</span>
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
