import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from '../global/NavBar';
import AdminSidebar from '../global/AdminSideBar';
import FormsBuilder from './editformbuilder';
import './AddSurvey.css';
import axios from 'axios';

function EditSurvey() {
  const location = useLocation();
  const navigate = useNavigate();
  const survey = location.state?.survey || null; // Get survey data if available
  const [updatedSurvey, setUpdatedSurvey] = useState(survey);

  useEffect(() => {
    if (survey) {
      setUpdatedSurvey(survey);
    }
  }, [survey]);

  const handleUpdate = async () => {
    if (!updatedSurvey || !updatedSurvey.id) {
      alert("Survey ID is required!");
      return;
    }
  
    // Validate sections and questions
    if (!updatedSurvey.sections || updatedSurvey.sections.length === 0) {
      alert("At least one section is required!");
      return;
    }
  
    // Check each section for valid questions
    for (let section of updatedSurvey.sections) {
      if (!section.title || section.title.trim() === "") {
        alert("Each section must have a title.");
        return;
      }
      for (let question of section.questions) {
        if (!question.text || question.text.trim() === "") {
          alert("Each question must have text.");
          return;
        }
      }
    }
  
    console.log("Sending Survey Data:", updatedSurvey); // Log the data to see what's being sent
    
    try {
      const response = await axios.put(
        `http://localhost:5000/api/surveys/update/1`,
        updatedSurvey,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Response Data:", response.data);
    } catch (error) {
      console.error("Error Response Data:", error.response?.data);
      alert("An error occurred while updating the survey: " + (error.response?.data.message || error.message));
    }        
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="d-flex" style={{ flex: 1 }}>
        <AdminSidebar />
        <div className="w-100 p-3 d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-3 survey-header">
            <h2 className="font-inter">Edit Survey</h2>
            <div className="button-container"> 
              <button className="btn me-10" onClick={handleUpdate}>Save Form</button>
            </div>
          </div>
          <FormsBuilder surveyData={updatedSurvey} setSurveyData={setUpdatedSurvey} style={{ flex: 1 }} />
        </div>
      </div>
    </div>
  );
}

export default EditSurvey;
