      import React, { useState, useEffect } from "react";
      import { useNavigate, useLocation } from "react-router-dom";
      import { jwtDecode } from "jwt-decode";
      import { getUserFromToken } from "../utils/auth";
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
        const [officeName, setOfficeName] = useState(office?.name || "");
        const [services, setServices] = useState(Array.isArray(office?.services) ? office.services : []);
        const [personnel, setPersonnel] = useState(Array.isArray(office?.personnel) ? office.personnel : []);
        const [newService, setNewService] = useState("");
        const [newPersonnel, setNewPersonnel] = useState("");
        const [showServices, setShowServices] = useState(true);
        const [showPersonnel, setShowPersonnel] = useState(true);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

        const toggleServices = () => setShowServices(!showServices);
        const togglePersonnel = () => setShowPersonnel(!showPersonnel);
        const [editIndex, setEditIndex] = useState(null);
        const [editType, setEditType] = useState("");
        const [editValue, setEditValue] = useState("");
        const [servicePage, setServicePage] = useState(1);
        const [personnelPage, setPersonnelPage] = useState(1);
        const [isFieldInvalid, setIsFieldInvalid] = useState(false);
        const [isFieldInvalid2, setIsFieldInvalid2] = useState(false);


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

        useEffect(() => {
          if (!office) {
            navigate("/manageoffice");
          }
        }, [office, navigate]);

        useEffect(() => {
          console.log("Office data:", office);
          console.log("Services:", services);
          console.log("Personnel:", personnel);
        }, [office, services, personnel]);

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
            const updated = [...services];
            updated[editIndex] = { ...updated[editIndex], name: editValue.trim() };
            setServices(updated);
          } else if (editType === "personnel") {
            const updated = [...personnel];
            updated[editIndex] = { ...updated[editIndex], name: editValue.trim() };
            setPersonnel(updated);
          }
          cancelEdit();
        };
        
        const cancelEdit = () => {
          setEditIndex(null);
          setEditType("");
          setEditValue("");
        };

        const handleAddService = async () => {
          if (!newService.trim()) {
            setIsFieldInvalid2(true);
            alert("Enter a valid service before adding.");
            return;
          }

          try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/offices/${office.id}/services`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ serviceName: newService.trim() }),
            });

            if (!response.ok) throw new Error("Failed to add service");

            const data = await response.json();
            setServices(prev => [...prev, data]);
            setNewService("");
            setIsFieldInvalid2(false);
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };
        
        const handleAddPersonnel = async () => {
          if (!newPersonnel.trim()) {
            setIsFieldInvalid(true);
            alert("Enter a valid personnel before adding.");
            return;
          }

          try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/offices/${office.id}/personnel`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ personnelName: newPersonnel.trim() }),
            });

            if (!response.ok) throw new Error("Failed to add personnel");

            const data = await response.json();
            setPersonnel(prev => [...prev, data]);
            setNewPersonnel("");
            setIsFieldInvalid(false);
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };

        const handleSubmit = async (e) => {
          e.preventDefault();
        
          if (!officeName.trim()) {
            alert("Office name cannot be empty!");
            return;
          }
        
          try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/offices/${office.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                office_code,
                office_name: officeName,
                services: services.map(s => ({
                  id: s.id,
                  name: s.name,
                  status: s.status,
                })),
                personnel: personnel.map(p => ({
                  id: p.id,
                  name: p.name,
                  status: p.status,
                }))
              }),
            });
        
            if (!response.ok) throw new Error("Failed to update office");
        
            navigate("/manageoffice");
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };
        

        const handleServiceStatusChange = async (id, currentStatus) => {
          try {
            const newStatus = !currentStatus; // Toggle the status
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/offices/${office.id}/services/${id}/status`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: newStatus }),
            });
        
            if (!response.ok) throw new Error("Failed to update service status");
        
            setServices(prevServices =>
              prevServices.map(service =>
                service.id === id ? { ...service, status: newStatus } : service
              )
            );
          } catch (error) {
            setError(error.message);
          }
        };
        
        const handlePersonnelStatusChange = async (id, currentStatus) => {
          try {
            const newStatus = !currentStatus; // Toggle the status
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/offices/${office.id}/personnel/${id}/status`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: newStatus }),
            });
        
            if (!response.ok) throw new Error("Failed to update personnel status");
        
            setPersonnel(prev =>
              prev.map(p => (p.id === id ? { ...p, status: newStatus } : p))
            );
          } catch (error) {
            setError(error.message);
          }
        };
        
        // Pagination Helpers
        const paginate = (items, page) => items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
        const totalPages = (items) => (Array.isArray(items) ? Math.ceil(items.length / 20) : 0);

        return (
          <div className="edit-overlay">
            <Navbar />
            <div className="d-flex">
              <AdminSidebar />
              <div className="container mt-4">
                {error && <div className="alert alert-danger">{error}</div>}
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
                      disabled={isViewAll}
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
                      disabled={isViewAll}
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
        
                    <br />
                    {showServices && (
                      <>
                        {/* Only show the add service input if not in view mode */}
                        {!isViewAll && (
                          <div className="d-flex">
                            <input
                              type="text"
                              className={`form-control me-2 ${isFieldInvalid2 ? 'is-invalid' : ''}`}
                              placeholder="Enter service"
                              value={newService}
                              onChange={(e) => setNewService(e.target.value)}
                              disabled={loading}
                            />
                            <button 
                              type="button" 
                              className="btn btn-add" 
                              onClick={handleAddService}
                              disabled={loading}
                            >
                              {loading ? "Adding..." : "Add"}
                            </button>
                          </div>
                        )}
        
                        <ul className="list-group mt-2">
                          {paginate(services, servicePage).map((service, index) => {
                            const globalIndex = (servicePage - 1) * ITEMS_PER_PAGE + index;
                            return (
                              <li key={service.id} className="list-group-item d-flex justify-content-between align-items-center">
                                {editIndex === globalIndex && editType === "service" ? (
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
                                      disabled={loading}
                                    >
                                      {loading ? "Saving..." : "Save"}
                                    </button>
                                    <button 
                                      className="btn btn-sm ms-2" 
                                      style={{ backgroundColor: "gray", color: "white" }} 
                                      onClick={cancelEdit}
                                      disabled={loading}
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
                                        style={{ cursor: "pointer", display: isViewAll ? 'none' : 'block' }} // Hide edit icon in view mode
                                        onClick={() => startEditing("service", globalIndex, service.name)}
                                      />
                                      { !isViewAll && (
                                      <label className="switch">
                                      <input
                                        type="checkbox"
                                        checked={service.status} // Changed from status === "Active" to just status
                                        onChange={() => handleServiceStatusChange(service.id, service.status)}
                                      />
                                      <span className="slider round"></span>
                                    </label>
                                      )}
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
                    <br />
                    {showPersonnel && (
                      <>
                        {/* Only show the add personnel input if not in view mode */}
                        {!isViewAll && (
                          <div className="d-flex">
                            <input
                              type="text"
                              className={`form-control me-2 ${isFieldInvalid ? 'is-invalid' : ''}`}
                              placeholder="Enter personnel name"
                              value={newPersonnel}
                              onChange={(e) => setNewPersonnel(e.target.value)} 
                              disabled={loading}
                            />
                            <button 
                              type="button" 
                              className="btn btn-add" 
                              onClick={handleAddPersonnel}
                              disabled={loading}
                            >
                              {loading ? "Adding..." : "Add"}
                            </button>
                          </div>
                        )}
        
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
                                      disabled={loading}
                                    >
                                      {loading ? "Saving..." : "Save"}
                                    </button>
                                    <button 
                                      className="btn btn-sm ms-2" 
                                      style={{ backgroundColor: "gray", color: "white" }} 
                                      onClick={cancelEdit}
                                      disabled={loading}
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
                                        style={{ cursor: "pointer", display: isViewAll ? 'none' : 'block' }} // Hide edit icon in view mode
                                        onClick={() => startEditing("personnel", globalIndex, p.name)}
                                      />
                                      { !isViewAll && (
                                      <label className="switch">
                                      <input
                                        type="checkbox"
                                        checked={p.status} // Changed from status === "Active" to just status
                                        onChange={() => handlePersonnelStatusChange(p.id, p.status)}
                                      />
                                      <span className="slider round"></span>
                                    </label>
                                      
                                        )}
                                    </div>
                                  </>
                                )}
                              </li>
                            );
                          })}
                        </ul>
        
                        <div>
                          {Array.isArray(personnel) && totalPages(personnel) > 1 && (
                            <nav>
                              <ul className="pagination justify-content-center">
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
        
                  <button 
                    type="submit" 
                    className="btn btn-add-office"
                    disabled={loading || isViewAll} // Disable save button in view mode
                  >
                    {loading ? "Saving Changes..." : "Save Changes"}
                  </button>
                  <button
                    type="button" 
                    className="btn btn-secondary btn-cancel ms-3"
                    onClick={() => navigate("/manageoffice")}
                    disabled={loading}
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