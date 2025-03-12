import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from '../global/NavBar';
import AdminSidebar from '../global/AdminSideBar';
import FormsBuilder from './editformbuilder';
import './AddSurvey.css';
import axios from 'axios';

function EditSurvey() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get surveyId from URL search params
  const surveyId = searchParams.get("surveyId");
  const [updatedSurvey, setUpdatedSurvey] = useState(null);

  console.log("Received survey ID from search params:", surveyId);

  const handleUpdate = async (surveyData) => {
    if (!surveyData || !surveyData.id) {
      alert("Survey ID is required!");
      return;
    }
  
    // Validate sections and questions
    if (!surveyData.sections || surveyData.sections.length === 0) {
      alert("At least one section is required!");
      return;
    }
  
    // Check each section for valid questions
    for (let section of surveyData.sections) {
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
  
    console.log("Sending Survey Data:", JSON.stringify(surveyData, null, 2));
    
    try {
      const response = await axios.put(
        `http://localhost:5000/api/surveys/update/${surveyData.id}`,
        surveyData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Response Data:", response.data);

      // Optionally, give feedback or reset the form
      alert("Survey saved successfully!");
      navigate("/managesurvey");
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
              <button className="btn me-10" onClick={() => handleUpdate(updatedSurvey)}>Save Form</button>
            </div>
          </div>
          {surveyId && (
            <FormsBuilder surveyId={surveyId} setSurveyData={setUpdatedSurvey} style={{ flex: 1 }} />
          )}
        </div>
      </div>
    </div>
  );
}

export default EditSurvey;