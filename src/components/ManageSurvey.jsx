import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../global/NavBar";
import AdminSidebar from "../global/AdminSideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ManageUser.css";
import axios from "axios";

const ManageUser = () => {
  const [surveys, setSurveys] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/surveys");
            // Sort surveys by ID in ascending order
            const sortedSurveys = response.data.sort((a, b) => a.id - b.id);
            setSurveys(sortedSurveys);
        } catch (error) {
            console.error("Error fetching surveys:", error);
        }
    };
    fetchSurveys();
}, []);


const handleStatusChange = async (surveyId, newStatus) => {
  if (newStatus === "Choose") return;

  try {
      const response = await axios.put(`http://localhost:5000/api/surveys/${surveyId}/status`, {
          status: newStatus,
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
      console.error("Error updating status:", error);
      alert("Error updating status. Please try again later.");
  }
};



  // Filtered surveys based on search and section
  const filteredSurveys = surveys.filter(
    (survey) =>
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSection === "" || survey.sectionNumber === selectedSection)
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentSurveys = filteredSurveys.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="container mt-4">
          <h4>Manage Survey</h4>
          <div className="d-flex justify-content-between mb-3">
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search by Survey Title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="form-select w-25"
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
          </div>

          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Survey ID</th>
                <th>Survey Title</th>
                <th>Section Number</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentSurveys.map((survey) => (
                <tr key={survey.id}>
                  <td>{survey.id}</td>
                  <td>{survey.title}</td>
                  <td>{survey.sectionNumber}</td>
                  <td>
                    <select
                          className={`status-dropdown ${survey.status ? "active" : "inactive"}`}
                          value={survey.status?.toString()}  // Ensure value is a string
                          onChange={(e) => handleStatusChange(survey.id, e.target.value)}
                      >
                          <option value="Choose">Choose</option>
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                      </select>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <nav>
            <ul className="pagination justify-content-center">
              {[...Array(Math.ceil(filteredSurveys.length / usersPerPage))].map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
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

export default ManageUser;
