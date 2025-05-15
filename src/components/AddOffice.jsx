import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../global/NavBar";
import AdminSidebar from "../global/AdminSideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AddOffice.css";
import axios from "axios"; // Make sure to install axios if not already

const AddOffice = () => {
  const navigate = useNavigate();

  const [office_code, setOfficeCode] = useState("");
  const [office_name, setOfficeName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Save office details to PostgreSQL
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!office_name.trim()) {
      setError("Office name cannot be empty!");
      return;
    }

    if (!office_code.trim()) {
      setError("Office code cannot be empty!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
        office_code,
        office_name,
        services: [], // Empty array since we're just adding the office
        personnel: [] // Empty array since we're just adding the office
      });

      if (response.data.message === "Office created successfully") {
        navigate("/manageoffice");
      } else {
        setError("Failed to create office. Please try again.");
      }
    } catch (err) {
      console.error("Error creating office:", err);
      setError(err.response?.data?.message || "Error creating office. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-overlay">
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="container mt-4">
          <form onSubmit={handleSubmit} className="add-office-form">
            <h4>Add Office</h4>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* Office Code */}
            <div className="mb-3">
              <label className="form-label">Office Code</label>
              <input 
                type="text" 
                className="form-control" 
                value={office_code} 
                onChange={(e) => setOfficeCode(e.target.value)} 
                required 
              />
            </div>

            {/* Office Name */}
            <div className="mb-3">
              <label className="form-label">Office Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={office_name} 
                onChange={(e) => setOfficeName(e.target.value)} 
                required 
              />
            </div>  

            <button 
              type="submit" 
              className="btn btn-add-office"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Office"}
            </button>
            
            <button
              type="button"
              className="btn btn-secondary btn-cancel ms-3"
              onClick={() => navigate("/manageoffice")}
              disabled={isSubmitting}
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