import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../global/NavBar";
import AdminSidebar from "../global/AdminSideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AddOffice.css"; // Reusing the same CSS

const EditOffice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { office } = location.state || {};

  const [officeName, setOfficeName] = useState(office?.office || "");
  const [services, setServices] = useState(office?.services || []);
  const [personnel, setPersonnel] = useState(office?.personnel || []);
  const [newService, setNewService] = useState("");
  const [newPersonnel, setNewPersonnel] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editType, setEditType] = useState("");

  useEffect(() => {
    if (!office) {
      navigate("/manageoffice"); // Redirect if no office data is provided
    }
  }, [office, navigate]);

  // Add or edit service
  const handleService = () => {
    if (!newService.trim()) return;

    if (editType === "service" && editIndex !== null) {
      const updatedServices = [...services];
      updatedServices[editIndex] = newService.trim();
      setServices(updatedServices);
      setEditIndex(null);
      setEditType("");
    } else {
      setServices([...services, newService.trim()]);
    }

    setNewService("");
  };

  // Edit existing service
  const editService = (index) => {
    setNewService(services[index]);
    setEditIndex(index);
    setEditType("service");
  };

  // Delete service
  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  // Add or edit personnel
  const handlePersonnel = () => {
    if (!newPersonnel.trim()) return;

    if (editType === "personnel" && editIndex !== null) {
      const updatedPersonnel = [...personnel];
      updatedPersonnel[editIndex] = newPersonnel.trim();
      setPersonnel(updatedPersonnel);
      setEditIndex(null);
      setEditType("");
    } else {
      setPersonnel([...personnel, newPersonnel.trim()]);
    }

    setNewPersonnel("");
  };

  // Edit existing personnel
  const editPersonnel = (index) => {
    setNewPersonnel(personnel[index]);
    setEditIndex(index);
    setEditType("personnel");
  };

  // Delete personnel
  const removePersonnel = (index) => {
    setPersonnel(personnel.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!officeName.trim()) {
      alert("Office name cannot be empty!");
      return;
    }

    const existingOffices = JSON.parse(localStorage.getItem("offices")) || [];
    const updatedOffices = existingOffices.map((o) =>
      o.id === office.id
        ? { ...o, office: officeName, services, personnel }
        : o
    );

    localStorage.setItem("offices", JSON.stringify(updatedOffices));

    navigate("/manageoffice");
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="container mt-4">
          <form onSubmit={handleSubmit} className="add-office-form">
            <h4>Edit Office</h4>

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

            {/* Services */}
            <div className="mb-3">
              <label className="form-label">Service Availability</label>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Enter service"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                />
                <button type="button" className="btn btn-add" onClick={handleService}>
                  {editType === "service" ? "Update" : "+ Add"}
                </button>
              </div>
              <ul className="list-group mt-2">
                {services.map((service, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between">
                    {service}
                    <div>
                      <i className="bi bi-pencil-square text-primary me-2" style={{ cursor: "pointer" }} onClick={() => editService(index)} />
                      <i className="bi bi-trash text-danger" style={{ cursor: "pointer" }} onClick={() => removeService(index)} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Personnel */}
            <div className="mb-3">
              <label className="form-label">Personnel You Transacted With</label>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Enter personnel name"
                  value={newPersonnel}
                  onChange={(e) => setNewPersonnel(e.target.value)}
                />
                <button type="button" className="btn btn-add" onClick={handlePersonnel}>
                  {editType === "personnel" ? "Update" : "+ Add"}
                </button>
              </div>
              <ul className="list-group mt-2">
                {personnel.map((person, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between">
                    {person}
                    <div>
                      <i className="bi bi-pencil-square text-primary me-2" style={{ cursor: "pointer" }} onClick={() => editPersonnel(index)} />
                      <i className="bi bi-trash text-danger" style={{ cursor: "pointer" }} onClick={() => removePersonnel(index)} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-add-office">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOffice;
