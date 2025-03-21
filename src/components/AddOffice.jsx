import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../global/NavBar";
import AdminSidebar from "../global/AdminSideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AddOffice.css";

const ITEMS_PER_PAGE = 20;

const AddOffice = () => {
  const navigate = useNavigate();

  const [officeCode, setOfficeCode] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [services, setServices] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [newService, setNewService] = useState("");
  const [newPersonnel, setNewPersonnel] = useState("");
  const [showServices, setShowServices] = useState(true);
  const [showPersonnel, setShowPersonnel] = useState(true);
  const toggleServices = () => setShowServices(!showServices);
  const togglePersonnel = () => setShowPersonnel(!showPersonnel);

  // State for editing
  const [editIndex, setEditIndex] = useState(null);
  const [editType, setEditType] = useState("");
  const [editValue, setEditValue] = useState("");

  // Pagination state
  const [servicePage, setServicePage] = useState(1);
  const [personnelPage, setPersonnelPage] = useState(1);

  // Start editing a service/personnel
  const startEditing = (type, index, value) => {
    setEditType(type);
    setEditIndex(index);
    setEditValue(value);
  };

  // Handle edit change
  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  // Save edited service/personnel
  const saveEdit = () => {
    if (editType === "service") {
      const updatedServices = [...services];
      updatedServices[(servicePage - 1) * ITEMS_PER_PAGE + editIndex] = editValue.trim();
      setServices(updatedServices);
    } else if (editType === "personnel") {
      const updatedPersonnel = [...personnel];
      updatedPersonnel[(personnelPage - 1) * ITEMS_PER_PAGE + editIndex] = editValue.trim();
      setPersonnel(updatedPersonnel);
    }
    cancelEdit();
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditIndex(null);
    setEditType("");
    setEditValue("");
  };

  // Add new service
  const handleAddService = () => {
    if (newService.trim()) {
      setServices([...services, newService.trim()]);
      setNewService("");
    }
  };

  // Add new personnel
  const handleAddPersonnel = () => {
    if (newPersonnel.trim()) {
      setPersonnel([...personnel, newPersonnel.trim()]);
      setNewPersonnel("");
    }
  };

  // Delete a service
  const handleDeleteService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  // Delete a personnel
  const handleDeletePersonnel = (index) => {
    const updatedPersonnel = personnel.filter((_, i) => i !== index);
    setPersonnel(updatedPersonnel);
  };

  // Save office details
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!officeName.trim()) {
      alert("Office name cannot be empty!");
      return;
    }

    const existingOffices = JSON.parse(localStorage.getItem("offices")) || [];
    const newOffice = {
      id: existingOffices.length + 1,
      officeCode,
      office: officeName,
      services,
      personnel,
    };

    localStorage.setItem("offices", JSON.stringify([...existingOffices, newOffice]));
    navigate("/manageoffice");
  };

  // Pagination Helpers
  const paginate = (items, page) => items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = (items) => Math.ceil(items.length / ITEMS_PER_PAGE);

  return (
    <div className="add-overlay">
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="container mt-4">
          <form onSubmit={handleSubmit} className="add-office-form">
            <h4>Add Office</h4>

            {/* Office Code */}
            <div className="mb-3">
              <label className="form-label">Office Code</label>
              <input type="text" className="form-control" value={officeCode} onChange={(e) => setOfficeCode(e.target.value)} required />
            </div>

            {/* Office Name */}
            <div className="mb-3">
              <label className="form-label">Office Name</label>
              <input type="text" className="form-control" value={officeName} onChange={(e) => setOfficeName(e.target.value)} required />
            </div>

            {/* Services Section */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <label className="form-label">Service Availability</label>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={toggleServices}
                >
                  {showServices ? "▼ Hide" : "▶ Show"}
                </button>
              </div>

              <br />

              {showServices && (
                <>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control me-2"
                      placeholder="Enter service"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                    />
                    <button type="button" className="btn btn-add" onClick={handleAddService}>
                      Add
                    </button>
                  </div>

                  <ul className="list-group mt-2">
                    {paginate(services, servicePage).map((service, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {editIndex === index && editType === "service" ? (
                          <>
                            <input type="text" className="form-control" value={editValue} onChange={handleEditChange} autoFocus />
                            <button 
                            className="btn btn-sm ms-2" 
                            style={{ backgroundColor: "#870d0d", color: "white" }} 
                            onClick={saveEdit}
                          >
                            Save
                          </button>

                          <button 
                            className="btn btn-sm ms-2" 
                            style={{ backgroundColor: "gray", color: "white" }} 
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                          </>
                        ) : (
                          <>
                            <span>{service}</span>
                            <div>
                              <i
                                className="bi bi-pencil-square text-dark me-2"
                                style={{ cursor: "pointer" }}
                                onClick={() => startEditing("service", index, service)}
                              />
                              <i
                                className="bi bi-trash text-dark"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleDeleteService(index)}
                              />
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}


              {/* Services Section Pagination */}
              {totalPages(services) > 1 && (
                <nav>
                  <ul className="pagination justify-content-center">
                    {/* Previous Button (Hidden if only 1 page) */}
                    {totalPages(services) > 1 && servicePage > 1 && (
                      <li className="page-item">
                        <button 
                          className="page-link" 
                          onClick={(e) => {
                            e.preventDefault();
                            setServicePage(servicePage - 1);
                          }}
                        >
                          Previous
                        </button>
                      </li>
                    )}

                    {/* First Page */}
                    <li className={`page-item ${servicePage === 1 ? "active" : ""}`}>
                      <button 
                        className="page-link" 
                        onClick={(e) => {
                          e.preventDefault();
                          setServicePage(1);
                        }}
                      >
                        1
                      </button>
                    </li>

                    {/* Left Ellipsis */}
                    {servicePage > 4 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}

                    {/* Middle Pages */}
                    {Array.from({ length: 4 }, (_, i) => servicePage - 1 + i)
                      .filter((p) => p > 1 && p < totalPages(services))
                      .map((p) => (
                        <li key={p} className={`page-item ${servicePage === p ? "active" : ""}`}>
                          <button 
                            className="page-link" 
                            onClick={(e) => {
                              e.preventDefault();
                              setServicePage(p);
                            }}
                          >
                            {p}
                          </button>
                        </li>
                      ))}

                    {/* Right Ellipsis */}
                    {servicePage < totalPages(services) - 4 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}

                    {/* Last Page */}
                    {totalPages(services) > 1 && (
                      <li className={`page-item ${servicePage === totalPages(services) ? "active" : ""}`}>
                        <button 
                          className="page-link" 
                          onClick={(e) => {
                            e.preventDefault();
                            setServicePage(totalPages(services));
                          }}
                        >
                          {totalPages(services)}
                        </button>
                      </li>
                    )}

                    {/* Next Button (Hidden if only 1 page) */}
                    {totalPages(services) > 1 && servicePage < totalPages(services) && (
                      <li className="page-item">
                        <button 
                          className="page-link" 
                          onClick={(e) => {
                            e.preventDefault();
                            setServicePage(servicePage + 1);
                          }}
                        >
                          Next
                        </button>
                      </li>
                    )}
                  </ul>
                </nav>
              )}

            </div>

{/* Personnel Section */}
<div className="mb-3">
  <div className="d-flex justify-content-between align-items-center">
    <label className="form-label">Personnel You Transacted With</label>
    <button
      type="button"
      className="btn btn-sm btn-outline-secondary"
      onClick={togglePersonnel}
    >
      {showPersonnel ? "▼ Hide" : "▶ Show"}
    </button>
  </div>

  <br />

  {showPersonnel && (
    <>
      <div className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Enter personnel name"
          value={newPersonnel}
          onChange={(e) => setNewPersonnel(e.target.value)}
        />
        <button type="button" className="btn btn-add" onClick={handleAddPersonnel}>
          Add
        </button>
      </div>

      <ul className="list-group mt-2">
        {paginate(personnel, personnelPage).map((person, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            {editIndex === index && editType === "personnel" ? (
              <>
                <input type="text" className="form-control" value={editValue} onChange={handleEditChange} autoFocus />
                <button 
                className="btn btn-sm ms-2" 
                style={{ backgroundColor: "#870d0d", color: "white" }} 
                onClick={saveEdit}
              >
                Save
              </button>

              <button 
                className="btn btn-sm ms-2" 
                style={{ backgroundColor: "gray", color: "white" }} 
                onClick={cancelEdit}
              >
                Cancel
              </button>
              </>
            ) : (
              <>
                <span>{person}</span>
                <div>
                  <i
                    className="bi bi-pencil-square text-dark me-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => startEditing("personnel", index, person)}
                  />
                  <i
                    className="bi bi-trash text-dark"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeletePersonnel(index)}
                  />
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

     
    </>
  )}
</div>


{/* Personnel Section Pagination */}
{totalPages(personnel) > 1 && (
  <nav>
    <ul className="pagination justify-content-center">
      {/* Previous Button (Hidden if only 1 page) */}
      {totalPages(personnel) > 1 && personnelPage > 1 && (
        <li className="page-item">
          <button 
            className="page-link" 
            onClick={(e) => {
              e.preventDefault();
              setPersonnelPage(personnelPage - 1);
            }}
          >
            Previous
          </button>
        </li>
      )}

      {/* First Page */}
      <li className={`page-item ${personnelPage === 1 ? "active" : ""}`}>
        <button 
          className="page-link" 
          onClick={(e) => {
            e.preventDefault();
            setPersonnelPage(1);
          }}
        >
          1
        </button>
      </li>

      {/* Left Ellipsis */}
      {personnelPage > 4 && (
        <li className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      )}

      {/* Middle Pages */}
      {Array.from({ length: 4 }, (_, i) => personnelPage - 1 + i)
        .filter((p) => p > 1 && p < totalPages(personnel))
        .map((p) => (
          <li key={p} className={`page-item ${personnelPage === p ? "active" : ""}`}>
            <button 
              className="page-link" 
              onClick={(e) => {
                e.preventDefault();
                setPersonnelPage(p);
              }}
            >
              {p}
            </button>
          </li>
        ))}

      {/* Right Ellipsis */}
      {personnelPage < totalPages(personnel) - 4 && (
        <li className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      )}

      {/* Last Page */}
      {totalPages(personnel) > 1 && (
        <li className={`page-item ${personnelPage === totalPages(personnel) ? "active" : ""}`}>
          <button 
            className="page-link" 
            onClick={(e) => {
              e.preventDefault();
              setPersonnelPage(totalPages(personnel));
            }}
          >
            {totalPages(personnel)}
          </button>
        </li>
      )}

      {/* Next Button (Hidden if only 1 page) */}
      {totalPages(personnel) > 1 && personnelPage < totalPages(personnel) && (
        <li className="page-item">
          <button 
            className="page-link" 
            onClick={(e) => {
              e.preventDefault();
              setPersonnelPage(personnelPage + 1);
            }}
          >
            Next
          </button>
        </li>
      )}
    </ul>
  </nav>
)}
          <br></br>

            <button type="submit" className="btn btn-add-office">Create Office</button>
            <button
              type="button"
              className="btn btn-secondary btn-cancel ms-3"
              onClick={() => navigate("/manageoffice")}
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
