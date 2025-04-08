import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../global/NavBar";
import AdminSidebar from "../global/AdminSideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ManageOffice.css";

const ManageOffice = () => {
  const [offices, setOffices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const officesPerPage = 20;
  const [expandedOffice, setExpandedOffice] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch latest offices from localStorage
  const fetchOffices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/offices");
      console.log("Fetched offices:", response.data); // ✅ Debugging line
      setOffices(response.data);
    } catch (error) {
      console.error("Error fetching offices:", error);
    }
  };
  

  useEffect(() => {
    fetchOffices();
  }, []);

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

  const toggleOfficeDetails = (id) => {
    setExpandedOffice(expandedOffice === id ? null : id);
  };

  const filteredOffices = offices.filter((office) =>
    (office.office_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (office.office_id?.toString().toLowerCase() || "").includes(searchTerm.toLowerCase())
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
            placeholder="Search Office or Office Code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="table-responsive" style={{ minWidth: "95%" }}>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Office Code</th>
                <th>Office</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOffices.map((office) => (
                <React.Fragment key={office.id}>
                  <tr>
                  <td>{office.id}</td>
                  <td>{office.office_code ? office.office_code : "No Code"}</td>


                  <td
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontWeight: "bold",
                      color: "black",
                    }}
                    onClick={() => toggleOfficeDetails(office.id)}
                  >
                    {office.name}
                  </td>

                    <td>
                      <i
                        className="bi bi-pencil-square"
                        style={{ cursor: "pointer", marginRight: "10px" }}
                        onClick={() => goToEditOfficePage(office)}
                      />
                      <i
                        className="bi bi-trash"
                        style={{ cursor: "pointer"}}
                        onClick={() => deleteOffice(office.id)}
                      />
                    </td>
                  </tr>

                  {expandedOffice === office.id && (
                    <tr>
                      <td colSpan="4">
                        <div className="row">
                          <div className="col">
                            <h5>Service Availability</h5>
                            <table className="table table-bordered">
                              <tbody>
                              {office.services?.length > 0 ? (
                                office.services.map((service, index) => (
                                  <tr key={index}>
                                    <td>{typeof service === "object" ? service.name || JSON.stringify(service) : service}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td>No services listed</td>
                                </tr>
                              )}

                              </tbody>
                            </table>
                          </div>
                          <div className="col">
                            <h5>Personnel You Transacted With</h5>
                            <table className="table table-bordered">
                              <tbody>
                              {office.personnel?.length > 0 ? (
                                office.personnel.map((person, index) => (
                                  <tr key={index}>
                                    <td>{typeof person === "object" ? person.name || JSON.stringify(person) : person}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td>No personnel listed</td>
                                </tr>
                              )}

                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

            {/* Pagination (Hidden if only one page) */}
            {totalPages > 1 && (
              <nav>
                <ul className="pagination justify-content-center">

                  {/* Previous Button (Hidden if on the first page) */}
                  {currentPage > 1 && (
                    <li className="page-item">
                      <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                        Previous
                      </button>
                    </li>
                  )}

                  {/* First Page */}
                  {currentPage > 4 && (
                    <>
                      <li className="page-item">
                        <button className="page-link" onClick={() => setCurrentPage(1)}>1</button>
                      </li>
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    </>
                  )}

                  {/* Dynamic Middle Pages */}
                  {Array.from({ length: 5 }, (_, i) => currentPage - 2 + i)
                    .filter((p) => p > 0 && p <= totalPages)
                    .map((p) => (
                      <li key={p} className={`page-item ${currentPage === p ? "active" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(p)}>
                          {p}
                        </button>
                      </li>
                    ))}

                  {/* Last Page */}
                  {currentPage < totalPages - 3 && (
                    <>
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                      <li className="page-item">
                        <button className="page-link" onClick={() => setCurrentPage(totalPages)}>
                          {totalPages}
                        </button>
                      </li>
                    </>
                  )}

                  {/* Next Button (Hidden if on the last page) */}
                  {currentPage < totalPages && (
                    <li className="page-item">
                      <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                        Next
                      </button>
                    </li>
                  )}

                </ul>
              </nav>
            )}

        </div>
      </div>
    </div>
  );
};

export default ManageOffice;