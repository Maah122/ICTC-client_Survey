import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../global/NavBar";
import AdminSidebar from "../global/AdminSideBar";
import axios from "axios"; // Import axios for API calls
import "bootstrap/dist/css/bootstrap.min.css";
import "./ManageSurvey.css";

const ManageUser  = () => {
  const [surveys, setSurveys] = useState([]); // Change from users to surveys
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [surveysPerPage] = useState(8);
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState("");
  const [activeSurveyId, setActiveSurveyId] = useState(null); // Track the active survey ID

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/surveys");
        console.log("Fetched surveys:", response.data);
  
        const sortedSurveys = response.data.sort((a, b) => a.id - b.id);
        setSurveys(sortedSurveys);
  
        // Find the active survey (if any) and set it
        const activeSurvey = sortedSurveys.find((survey) => survey.status === true);
        if (activeSurvey) {
          setActiveSurveyId(activeSurvey.id);
        }
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    };
  
    fetchSurveys();
  }, []);
  

const deleteSurvey = async (surveyId) => {
  try {
      const response = await axios.delete(`http://localhost:5000/api/surveys/delete/${surveyId}`);
      if (response.status === 200) {
          alert("Survey deleted successfully!");
          // Optionally, refresh the survey list or remove the deleted survey from the state
          setSurveys(surveys.filter(survey => survey.id !== surveyId));
      }
  } catch (error) {
      console.error("Error deleting survey:", error);
      alert("Failed to delete survey. Please try again.");
  }
};

  const goToAddSurveyPage = () => {
    navigate("/add-survey");
  };

  const filteredSurveys = surveys
  .filter(
    (survey) =>
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSection === "" || survey.sectionNumber === selectedSection)
  )
  .sort((a, b) => Number(b.status) - Number(a.status)); // Sort by active status (true first)


  const handleStatusChange = async (surveyId, currentStatus) => {
    const newStatus = !currentStatus;
  
    if (newStatus) {
      if (activeSurveyId !== null && activeSurveyId !== surveyId) {
        await axios.put(`http://localhost:5000/api/surveys/${activeSurveyId}/status`, { status: false });
      }
      setActiveSurveyId(surveyId);
    } else {
      if (activeSurveyId === surveyId) {
        setActiveSurveyId(null);
      }
    }
  
    try {
      const response = await axios.put(`http://localhost:5000/api/surveys/${surveyId}/status`, { status: newStatus });
  
      if (response.status === 200) {
        alert("Status updated successfully!");
        setSurveys((prevSurveys) =>
          prevSurveys.map((survey) =>
            survey.id === surveyId ? { ...survey, status: newStatus } : survey
          )
        );
      } else {
        alert("Failed to update status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status. Please try again later.");
    }
  };
  

  const indexOfLastSurvey = currentPage * surveysPerPage;
  const indexOfFirstSurvey = indexOfLastSurvey - surveysPerPage;
  const currentSurveys = filteredSurveys.slice(indexOfFirstSurvey, indexOfLastSurvey);

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="container mt-4">
          <h4>Manage Survey</h4>
          <div className="d-flex justify-content-between mb-3">
            <input
              id="searchBar"
              type="text"
              className="form-control w-50"
              placeholder="Search by Survey Title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="d-flex align-items-center">
              <select
                className="form-select"
                style={{ width: "300px" }} // Adjust width as needed
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="">All Sections</option>
                {[...new Set(surveys.map((survey) => survey.sectionNumber))].map((section) => (
                  <option key={section} value={section}>
                    Section {section}
                  </option>
                ))}
              </select>
              <button
                id="add-btn"
                className="btn ms-3 w-50"
                style={{
                  position: "relative",
                  height: "46px",
                  top: "2px",
                  backgroundColor: "#870d0d",
                  color: "white", // Ensures text is visible
                  borderColor: "#870d0d", // Matches border color
                }}
                onClick={goToAddSurveyPage}
              >
                Add Survey
              </button>
            </div>
          </div>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Survey Number</th>
                <th>Survey Title</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentSurveys.map((survey) => (
                <tr key={survey.id}>
                  <td>{survey.id}</td>
                  <td>{survey.title.length > 50 ? survey.title.substring(0, 70) + "..." : survey.title}</td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={survey.status}
                        onChange={() => handleStatusChange(survey.id, survey.status)}
                        disabled={activeSurveyId !== null && activeSurveyId !== survey.id} // Disable if another survey is active
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                      <i
                      id="edit-btn"
                      className="bi bi-pencil-square"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        console.log("Editing survey:", survey); // Debugging log
                        navigate(`/edit-survey?surveyId=${survey.id}`); // Pass surveyId as a query parameter
                      }}
                    />
                    <i 
                      id="edit-btn" 
                      className="bi bi-trash" 
                      style={{ cursor: 'pointer', marginRight: '' }} 
                      onClick={() => deleteSurvey(survey.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav>
            <ul className="pagination justify-content-center">
              {[...Array(Math.ceil(filteredSurveys.length / surveysPerPage))].map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ManageUser ;