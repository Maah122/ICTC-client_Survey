import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
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
          {/* Dashboard */}
          <li className="nav-item">
            <a href="/dashboard" className="nav-link" title="Dashboard">
              <i className="bi-person-circle"></i>
              <span className="link-text"> Dashboard </span>
            </a>
          </li>

          {/* Survey (Collapsible) */}
          <li className="nav-item">
            <a
              className="nav-link"
              data-bs-toggle="collapse"
              href="#surveyMenu"
              role="button"
              title="Manage Survey"
            >
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
                  <a
                    href="/managesurvey"
                    className="nav-link"
                    title="Manage Survey"
                  >
                    <i className="bi bi-table"></i>
                    <span className="link-text"> Survey</span>
                  </a>
                </li>
              </ul>
            </div>
          </li>
          {/* Survey (Collapsible) */}
          <li className="nav-item">
            <a
              className="nav-link"
              data-bs-toggle="collapse"
              href="#officeMenu"
              role="button"
              title="Manage Office"
            >
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
                  <a
                    href="/manageoffice"
                    className="nav-link"
                    title="Manage Office"
                  >
                    <i className="bi bi-table"></i>
                    <span className="link-text"> Office</span>
                  </a>
                </li>
              </ul>
            </div>
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
                  <a
                    href="/manageuser"
                    className="nav-link"
                    title="Manage Users"
                  >
                    <i className="bi bi-gear"></i>
                    <span className="link-text"> Users</span>
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
