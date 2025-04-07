import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../global/NavBar";
import AdminSidebar from "../global/AdminSideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AddOffice.css";


const AddOffice = () => {
  const navigate = useNavigate();

  const [office_code, setOfficeCode] = useState("");
  const [officeName, setOfficeName] = useState("");


  // Save office details
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!officeName.trim()) {
      alert("Office name cannot be empty!");
      return;
    }

    const existingOffices = JSON.parse(localStorage.getItem("offices")) || [];
    const newOffice = {
      id: existingOffices.length + 1,
      office_code,
      office: officeName,
    };

    localStorage.setItem("offices", JSON.stringify([...existingOffices, newOffice]));
    navigate("/manageoffice");
  };

  return (
    <div className="add-overlay">
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="container mt-4">
          <form onSubmit={handleSubmit} className="add-office-form">
            <h4>Add Office</h4>

            {/* Office Code */}
            <div className="mb-3">
              <label className="form-label">Office Code</label>
              <input type="text" className="form-control" value={office_code} onChange={(e) => setOfficeCode(e.target.value)} required />
            </div>

            {/* Office Name */}
            <div className="mb-3">
              <label className="form-label">Office Name</label>
              <input type="text" className="form-control" value={officeName} onChange={(e) => setOfficeName(e.target.value)} required />
            </div>  

            <button type="submit" className="btn btn-add-office">Create Office</button>
            <button
              type="button"
              className="btn btn-secondary btn-cancel ms-3"
              onClick={() => navigate("/manageoffice")}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOffice;
