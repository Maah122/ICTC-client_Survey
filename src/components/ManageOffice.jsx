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
  const itemsPerPage = 3;
  const navigate = useNavigate();

  // Fetch offices with services and personnel
  useEffect(() => {
    const fetchData = async () => {
      try {
          const response = await fetch("http://localhost:5000/api/offices");
          const data = await response.json();
          setOffices(data); // ✅ Update state with latest data
      } catch (error) {
          console.error("Error fetching offices:", error);
      }
  };

    fetchData();
  }, []);

  // Delete Office
  const deleteOffice = async (id) => {
    if (window.confirm("Are you sure you want to delete this office?")) {
      try {
        await axios.delete(`http://localhost:5000/api/offices/${id}`);
        setOffices((prevOffices) => prevOffices.filter((office) => office.id !== id));
      } catch (error) {
        console.error("Error deleting office:", error);
      }
    }
  };

  // Navigate to Add Office Page
  const goToAddOfficePage = () => {
    navigate("/add-office");
  };

  // Navigate to Edit Office Page
  const goToEditOfficePage = (office) => {
    navigate("/edit-office", { state: { office } });
  };

  // Filter offices by search
  const filteredOffices = offices.filter((office) =>
    office.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredOffices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedOffices = filteredOffices.slice(startIndex, startIndex + itemsPerPage);


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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
            />
            <button className="btn btn-add-office" onClick={goToAddOfficePage}>
              Add Office
            </button>
          </div>

          {/* Table */}
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Office</th>
                <th>Services</th>
                <th>Personnel</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedOffices.map((office) => (
                <tr key={office.id}>
                  <td>{office.id}</td>
                  <td>{office.name}</td>
                  <td>
                      <div className="scrollable-container">
                        {office.services?.length ? (
                          office.services.map((service, index) => (
                            <div key={index} className="mb-1">{service.name}</div>
                          ))
                        ) : (
                          <div>N/A</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="scrollable-container">
                        {office.personnel?.length ? (
                          office.personnel.map((person, index) => (
                            <div key={index} className="mb-1">{person.name}</div>
                          ))
                        ) : (
                          <div>N/A</div>
                        )}
                      </div>
                    </td>

                  <td>
                    <i
                      className="bi bi-pencil-square"
                      style={{ cursor: "pointer", marginRight: "10px" }}
                      onClick={() => goToEditOfficePage(office)}
                    />
                    <i
                      className="bi bi-trash"
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => deleteOffice(office.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-primary mx-1"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="align-self-center mx-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-primary mx-1"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageOffice;