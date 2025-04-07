import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../global/NavBar";
import AdminSidebar from "../global/AdminSideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AddOffice.css";
import "./EditOffice.css";

const ITEMS_PER_PAGE = 20;

const EditOffice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { office } = location.state || {};

  const [office_code, setOfficeCode] = useState(office?.office_code || "");
  const [officeName, setOfficeName] = useState(office?.office || "");
  const [services, setServices] = useState(Array.isArray(office?.services) ? office.services : []);
  const [personnel, setPersonnel] = useState(Array.isArray(office?.personnel) ? office.personnel : []);
  const [newService, setNewService] = useState("");
  const [newPersonnel, setNewPersonnel] = useState("");
  const [showServices, setShowServices] = useState(true);
  const [showPersonnel, setShowPersonnel] = useState(true);
  const toggleServices = () => setShowServices(!showServices);
  const togglePersonnel = () => setShowPersonnel(!showPersonnel);


  const [editIndex, setEditIndex] = useState(null);
  const [editType, setEditType] = useState("");
  const [editValue, setEditValue] = useState("");

  // Pagination state
  const [servicePage, setServicePage] = useState(1);
  const [personnelPage, setPersonnelPage] = useState(1);
  const [isFieldInvalid, setIsFieldInvalid] = useState(false);
  const [isFieldInvalid2, setIsFieldInvalid2] = useState(false);

  useEffect(() => {
    if (!office) {
      navigate("/manageoffice");
    }
  }, [office, navigate]);

  const startEditing = (type, index, value) => {
    setEditType(type);
    setEditIndex(index);
    setEditValue(value);
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const saveEdit = () => {
    if (editType === "service") {
      const updatedServices = [...services];
      updatedServices[editIndex] = { ...updatedServices[editIndex], name: editValue.trim() };
      setServices(updatedServices);
    } else if (editType === "personnel") {
      setPersonnel((prevPersonnel) =>
        prevPersonnel.map((person, index) =>
          index === editIndex ? { ...person, name: editValue.trim() } : person
        )
      );
    }
    cancelEdit();
  };
  
  

  const cancelEdit = () => {
    setEditIndex(null);
    setEditType("");
    setEditValue("");
  };

  const handleAddService = () => {
    if (newService.trim()) {
      setServices(prev =>
        Array.isArray(prev)
          ? [...prev, { id: Date.now(), name: newService.trim(), status: "Inactive" }]
          : [{ id: Date.now(), name: newService.trim(), status: "Inactive" }]
      );
      setNewService("");
    }

    if (!newService.trim()) {
      setIsFieldInvalid2(true);
      alert("Enter a valid service before adding.");
      return;
    }
    // Handle adding the service here...
    setIsFieldInvalid(false); // Reset the error state if the input is valid
  };
  
  const handleAddPersonnel = () => {
    if (newPersonnel.trim()) {
      setPersonnel(prev =>
        Array.isArray(prev)
          ? [...prev, { id: Date.now(), name: newPersonnel.trim(), status: "Inactive" }]
          : [{ id: Date.now(), name: newPersonnel.trim(), status: "Inactive" }]
      );
      setNewPersonnel("");
    }
      if (!newPersonnel.trim()) {
      setIsFieldInvalid(true);
      alert("Enter a valid personnel before adding.");
      return;
    }
    // Handle adding the service here...
    setIsFieldInvalid(false); // Reset the error state if the input is valid
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!officeName.trim()) {
      alert("Office name cannot be empty!");
      return;
    }
  
    const existingOffices = JSON.parse(localStorage.getItem("offices")) || [];
  
    const updatedOffices = existingOffices.map((o) =>
      o.id === office.id
        ? {
            ...o,
            office_code: office_code,
            office: officeName,
            services: Array.isArray(services) ? services : [],
            personnel: Array.isArray(personnel) ? personnel : []
          }
        : o
    );
  
    localStorage.setItem("offices", JSON.stringify(updatedOffices));
    navigate("/manageoffice");
  };
  

  // Pagination Helpers
  const paginate = (items, page) => items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = (items) => (Array.isArray(items) ? Math.ceil(items.length / 20) : 0);


  const handleStatusChange = (id, newStatus) => {
    return setServices(prevServices =>
      prevServices.map(service =>
        service.id === id ? { ...service, status: newStatus } : service
      )
    );
  };
  
const handlePersonnelStatusChange = (id, newStatus) => {
  setPersonnel(prev =>
    prev.map(p => (p.id === id ? { ...p, status: newStatus } : p))
  );
};


  return (
    <div className="edit-overlay">
      <Navbar />
      <div className="d-flex">
      <AdminSidebar />

        <div className="container mt-4">
          <form onSubmit={handleSubmit} className="add-office-form">
            <h4>Edit Office</h4>

            {/* Office Code */}
            <div className="mb-3">
              <label className="form-label">Office Code</label>
              <input
                type="text"
                className="form-control"
                value={office_code}
                onChange={(e) => setOfficeCode(e.target.value)}
                required
              />
            </div>

            {/* Office Name */}
            <div className="mb-3">
              <label className="form-label">Office Name</label>
              <input
                type="text"
                className="form-control"
                value={officeName}
                onChange={(e) => setOfficeName(e.target.value)}
                required
              />
            </div>

{/* Services Section */}
<div className="mb-3">
  <div className="d-flex justify-content-between align-items-center">
    <label className="form-label">Services</label>
    <button
      type="button"
      className="btn btn-sm btn-outline-secondary"
      onClick={toggleServices}
    >
      {showServices ? "▼ Hide" : "▶ Show"}
    </button>
  </div>

   <br></br> 
  {showServices && (
    <>
  <div className="d-flex">
      <input
        type="text"
        className={`form-control me-2 ${isFieldInvalid2 ? 'is-invalid' : ''}`}
        placeholder="Enter service"
        value={newService}
        onChange={(e) => setNewService(e.target.value)}
        
      />
      <button 
        type="button" 
        className="btn btn-add" 
        onClick={handleAddService}
      >
        Add
      </button>
    </div>

      <ul className="list-group mt-2">
  {paginate(services, servicePage).map((service, index) => {
    const globalIndex = (servicePage - 1) * ITEMS_PER_PAGE + index;
    return (
      <li key={service.id} className="list-group-item d-flex justify-content-between align-items-center">
        {editIndex === globalIndex && editType === "service" ? (
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
            <span>{service.name}</span>

            <div className="d-flex align-items-center ms-2">
              <i
                className="bi bi-pencil-square text-dark me-2"
                style={{ cursor: "pointer" }}
                onClick={() => startEditing("service", globalIndex, service.name)}
              />
              <label className="switch">
                <input
                  type="checkbox"
                  checked={service.status === "Active"}
                  onChange={() => handleStatusChange(service.id, service.status === "Active" ? "Inactive" : "Active")}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </>

        )}
      </li>
    );
  })}
</ul>


        <div>
        {Array.isArray(services) && totalPages(services) > 1 && (
        <nav>
        <ul className="pagination justify-content-center">
          {/* Previous Button */}
          {servicePage > 1 && (
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

          {/* Ellipsis & Middle Pages */}
          {servicePage > 4 && <li className="page-item disabled"><span className="page-link">...</span></li>}
          {Array.isArray(services) &&
            Array.from({ length: 4 }, (_, i) => servicePage - 1 + i)
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
          {servicePage < totalPages(services) - 4 && <li className="page-item disabled"><span className="page-link">...</span></li>}

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

          {/* Next Button */}
          {servicePage < totalPages(services) && (
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
        </>     
      )}    
      </div>

{/* Personnel Section */}
<div className="mb-3">
  <div className="d-flex justify-content-between align-items-center">
    <label className="form-label">Personnel</label>
    <button
      type="button"
      className="btn btn-sm btn-outline-secondary"
      onClick={togglePersonnel}
    >
      {showPersonnel ? "▼ Hide" : "▶ Show"}
    </button>
  </div>
<br></br>
  {showPersonnel && (
    <>
      <div className="d-flex">
        <input
          type="text"
          className={`form-control me-2 ${isFieldInvalid ? 'is-invalid' : ''}`}
          placeholder="Enter personnel name"
          value={newPersonnel}
          onChange={(e) => setNewPersonnel(e.target.value)} 
        />
        <button type="button" className="btn btn-add" onClick={handleAddPersonnel}>
          Add
        </button>
      </div>

      <ul className="list-group mt-2">
        {paginate(personnel, personnelPage).map((p, index) => {
          const globalIndex = (personnelPage - 1) * ITEMS_PER_PAGE + index;
          return (
            <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
              {editIndex === globalIndex && editType === "personnel" ? (
                <>
                  <input
                    type="text"
                    className="form-control"
                    value={editValue}
                    onChange={handleEditChange}
                    autoFocus
                  />
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
                  <span>{p.name}</span>
                  <div className="d-flex align-items-center ms-2">
                    <i
                      className="bi bi-pencil-square text-dark me-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => startEditing("personnel", globalIndex, p.name)}
                    />
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={p.status === "Active"}
                        onChange={() => handlePersonnelStatusChange(p.id, p.status === "Active" ? "Inactive" : "Active")}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>

      {/* Pagination Controls */}
      <div>
        {Array.isArray(personnel) && totalPages(personnel) > 1 && (
          <nav>
            <ul className="pagination justify-content-center">
              {/* Previous Button */}
              {personnelPage > 1 && (
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

              {/* Ellipsis & Middle Pages */}
              {personnelPage > 4 && <li className="page-item disabled"><span className="page-link">...</span></li>}
              {Array.isArray(personnel) &&
                Array.from({ length: 4 }, (_, i) => personnelPage - 1 + i)
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
              {personnelPage < totalPages(personnel) - 4 && <li className="page-item disabled"><span className="page-link">...</span></li>}

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

              {/* Next Button */}
              {personnelPage < totalPages(personnel) && (
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
      </div>
    </>
  )}
</div>




            <button type="submit" className="btn btn-add-office">Save Changes</button>
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

export default EditOffice;
