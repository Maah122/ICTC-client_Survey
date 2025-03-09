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
            console.log("Fetched surveys:", response.data); // Debugging log
            // Sort surveys by ID in ascending order
            const sortedSurveys = response.data.sort((a, b) => a.id - b.id);
            setSurveys(sortedSurveys);
        } catch (error) {
            console.error("Error fetching surveys:", error);
        }
    };
    fetchSurveys();
}, []);

  const deleteSurvey = (id) => {
    setSurveys(surveys.filter((survey) => survey.id !== id));
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
    const newStatus = !currentStatus; // Toggle status between true and false

    // If the new status is true (active), check if there's already an active survey
    if (newStatus) {
      if (activeSurveyId !== null) {
        // Deactivate the currently active survey
        await axios.put(`http://localhost:5000/api/surveys/${activeSurveyId}/status`, {
          status: false, // Set the currently active survey to inactive
        });
      }
      setActiveSurveyId(surveyId); // Set the new active survey ID
    } else {
      // If the survey is being set to inactive, clear the activeSurveyId
      if (activeSurveyId === surveyId) {
        setActiveSurveyId(null);
      }
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/surveys/${surveyId}/status`, {
        status: newStatus, // Send the new status as a boolean
      });

      if (response.status === 200) {
        alert("Status updated successfully!");
        setSurveys((prevSurveys) =>
          prevSurveys.map((survey) =>
            survey.id === surveyId ? { ...survey, status: newStatus } : survey
          )
        );
      } else {
        console.error("Failed to update status");
        alert("Failed to update status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating status:", error.response.data); // Log the error response for more details
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
                      onClick={() => navigate("/edit-survey", { state: { survey } })}
                    />
                    <i id="edit-btn" className="bi bi-trash" style={{ cursor: 'pointer', marginRight: '' }} onClick={() => deleteSurvey(survey.id)}></i>
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