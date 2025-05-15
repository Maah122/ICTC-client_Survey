import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getUserFromToken } from "../utils/auth";
import axios from "axios";
import Navbar from "../global/NavBar";
import AdminSidebar from "../global/AdminSideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ManageOffice.css";

const ManageOffice = () => {
  const [offices, setOffices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const officesPerPage = 10;
  const navigate = useNavigate();

  // Get token from localStorage and decode it
  // Get token from localStorage and decode it
  const token = localStorage.getItem("token");
  let userRights = "";
  let allowedOfficeCodes = [];
  const user = getUserFromToken(); // Make sure this is imported properly

  if (user) {
    userRights = user.user_rights;

    // Handle multiple office codes (split by comma and trim spaces)
    if (user.office) {
      allowedOfficeCodes = user.office.split(",").map(code => code.trim());
    }
  }

  const isAdmin = userRights === "Admin"; // Capital A
  const isViewAll = userRights === "View all";
  const isLimited = userRights === "Limited";

  // Fetch latest offices from API
  const fetchOffices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/offices");
      console.log("Fetched offices:", response.data);  // Check if updated status is present
      setOffices(response.data);
    } catch (error) {
      console.error("Error fetching offices:", error);
    }
  };

  useEffect(() => {
    console.log("Office data:", offices);
  }, [offices]);

  useEffect(() => {
    fetchOffices();
  }, []);

  // Handle toggling the active status of an office
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const response = await axios.put(`http://localhost:5000/api/offices/${id}/status`, {
        status: newStatus,
      });
  
      if (response.data.success) {
        // Refresh the office data immediately after successful update
        fetchOffices();
      }
    } catch (error) {
      console.error("Error updating office status:", error);
    }
  };
  
  const deleteOffice = async (id) => {
    if (window.confirm("Are you sure you want to delete this office?")) {
      try {
        await axios.delete(`http://localhost:5000/api/offices/${id}`);
        fetchOffices(); // Refresh data after deletion
      } catch (error) {
        console.error("Error deleting office:", error);
      }
    }
  };

  const goToEditOfficePage = (office) => {
    navigate("/edit-office", { state: { office } });
  };

  const filteredOffices = offices
  .sort((a, b) => a.id - b.id) // Sort by ID ascending
  .filter((office) => {
    if (isAdmin) return true;
    if (isLimited || isViewAll) return allowedOfficeCodes.includes(office.office_code);
    return false;
  })
  .filter((office) =>
    office.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOffices.length / officesPerPage);
  const indexOfLastOffice = currentPage * officesPerPage;
  const indexOfFirstOffice = indexOfLastOffice - officesPerPage;
  const currentOffices = filteredOffices.slice(indexOfFirstOffice, indexOfLastOffice);

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="container mt-4">
          <h4>Manage Office</h4>
          <div className="d-flex align-items-center gap-2 mb-3">
            <input
              type="text"
              className="form-control w-auto flex-grow-1"
              placeholder="Search Office"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isAdmin && (
              <button
                className="btn-add-manage-office"
                style={{ backgroundColor: "#870d0d", borderColor: "#870d0d" }}
                onClick={() => navigate("/add-office")}
              >
                Add Office
              </button>
            )}
          </div>

          <div className="table-responsive" style={{ minWidth: "95%" }}>
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Office Code</th>
                  <th>Office</th>
                  {isAdmin && <th>Status</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                    {currentOffices.map((office) => {
                      const globalIndex = filteredOffices.findIndex((o) => o.id === office.id);
                      return (
                        <React.Fragment key={office.id}>
                          <tr>
                            <td>{globalIndex + 1}</td>
                            <td>{office.office_code ? office.office_code : "No Code"}</td>
                            <td>{office.name}</td>
                            {isAdmin && (
                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={office.status}
                                    onChange={() => handleToggleStatus(office.id, office.status)}
                                  />
                                  <span className="slider round"></span>
                                </label>
                              </td>
                            )}
                            <td>
                              <i
                                className="bi bi-pencil-square"
                                style={{ cursor: "pointer", marginRight: "10px" }}
                                onClick={() => goToEditOfficePage(office)}
                              />
                              {isAdmin && (
                                <i
                                  className="bi bi-trash"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => deleteOffice(office.id)}
                                />
                              )}
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                {/* Previous Button */}
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(page)}>
                      {page}
                    </button>
                  </li>
                ))}

                {/* Next Button */}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageOffice;