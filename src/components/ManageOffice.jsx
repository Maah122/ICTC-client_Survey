import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../global/NavBar";
import AdminSidebar from "../global/AdminSideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ManageOffice.css"; // Custom styles

const ManageOffice = () => {
  const [offices, setOffices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const officesPerPage = 10;
  const navigate = useNavigate();

  // Fetch offices from the backend API
  const fetchOffices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/offices");
      setOffices(response.data);
    } catch (error) {
      console.error("Error fetching offices:", error);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  // Handle toggling the active status of an office
  const handleToggleStatus = async (id, isActive) => {
    try {
      const updatedStatus = !isActive;
      await axios.patch(`http://localhost:5000/api/offices/${id}`, {
        isActive: updatedStatus,
      });

      const updatedOffices = offices.map((office) =>
        office.id === id ? { ...office, isActive: updatedStatus } : office
      );
      setOffices(updatedOffices);
    } catch (error) {
      console.error("Error toggling office status:", error);
    }
  };

  // Delete an office from the backend
  const handleDeleteOffice = async (id) => {
    if (window.confirm("Are you sure you want to delete this office?")) {
      try {
        await axios.delete(`http://localhost:5000/api/offices/${id}`);
        const updatedOffices = offices.filter((office) => office.id !== id);
        setOffices(updatedOffices);
      } catch (error) {
        console.error("Error deleting office:", error);
      }
    }
  };

  // Filter offices based on the search term
  const filteredOffices = offices.filter(
    (office) =>
      office.office.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (office.officeCode &&
        office.officeCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredOffices.length / officesPerPage);
  const paginatedOffices = filteredOffices.slice(
    (currentPage - 1) * officesPerPage,
    currentPage * officesPerPage
  );

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
              placeholder="Search Office or Office Code"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
            <button
              className="btn btn-primary"
              style={{ backgroundColor: "#870d0d", borderColor: "#870d0d" }}
              onClick={() => navigate("/add-office")}
            >
              Add Office
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Office Code</th>
                  <th>Office</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOffices.length > 0 ? (
                  paginatedOffices.map((office) => (
                    <tr key={office.id}>
                      <td>{office.id}</td>
                      <td>{office.officeCode || "N/A"}</td>
                      <td className="text-dark">{office.office}</td>
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={office.isActive ?? true} // Default to active if not set
                            onChange={() =>
                              handleToggleStatus(office.id, office.isActive)
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td>
                        <i
                          className="bi bi-pencil-square mx-2 action-icon"
                          onClick={() =>
                            navigate("/edit-office", { state: { office } })
                          }
                        />
                        <i
                          className="bi bi-trash action-icon"
                          onClick={() => handleDeleteOffice(office.id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No offices found.
                    </td>
                  </tr>
                )}
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
