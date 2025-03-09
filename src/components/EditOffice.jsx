import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../global/NavBar";
import axios from "axios";
import AdminSidebar from "../global/AdminSideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AddOffice.css"; // Reusing the same CSS

const EditOffice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const office = location.state?.office || null;

  const [officeName, setOfficeName] = useState(office?.name || "");
  const [services, setServices] = useState(office?.services || []);
  const [personnel, setPersonnel] = useState(office?.personnel || []);  
  const [newService, setNewService] = useState("");
  const [newPersonnel, setNewPersonnel] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editType, setEditType] = useState("");

  // Pagination state
  const [currentServicePage, setCurrentServicePage] = useState(1);
  const [servicesPerPage] = useState(5); // Number of services per page
  const [currentPersonnelPage, setCurrentPersonnelPage] = useState(1);
  const [personnelPerPage] = useState(5); // Number of personnel per page

  useEffect(() => {
    if (office?.id) {
      // Fetch office details (only name)
      axios.get(`http://localhost:5000/api/offices/${office.id}`)
        .then(res => {
          setOfficeName(res.data.office); // Ensure the API returns { office: "Office Name" }
        })
        .catch(err => console.error("Error fetching office name:", err));
  
      // Fetch services separately
      axios.get(`http://localhost:5000/api/office/${office.id}/services`)
        .then(res => {
          setServices(res.data); // Ensure API returns a list of services
        })
        .catch(err => console.error("Error fetching services:", err));
    }
  }, [office]);
  

  // Add or edit service
  const handleService = () => {
    if (!newService.trim()) return;

    if (editType === "service" && editIndex !== null) {
      const updatedServices = [...services];
      const serviceId = updatedServices[editIndex].id; // Get the ID of the service being edited

      // Update the service in the backend
      axios.put(`http://localhost:5000/api/offices/${office.id}/services/${serviceId}`, {
        serviceName: newService.trim(),
      })
      .then(() => {
        updatedServices[editIndex].name = newService.trim(); // Update the local state
        setServices(updatedServices);
        setEditIndex(null);
        setEditType("");
      })
      .catch((error) => {
        console.error("Error updating service:", error);
        alert("Failed to update service.");
      });
    } else {
      setServices([...services, newService.trim()]);
    }

    setNewService("");
  };

  // Edit existing service
  const editService = (index) => {
    setNewService(services[index].name); // Set the name for editing
    setEditIndex(index);
    setEditType("service");
  };

  // Delete service
  const removeService = (index) => {
    const serviceId = services[index].id; // Get the ID of the service to delete

    axios.delete(`http://localhost:5000/api/offices/${office.id}/services/${serviceId}`)
      .then(() => {
        setServices(services.filter((_, i) => i !== index)); // Update local state
      })
      .catch((error) => {
        console.error("Error deleting service:", error);
        alert("Failed to delete service.");
      });
  };

  // Add or edit personnel
  const handlePersonnel = () => {
    if (!newPersonnel.trim()) return;

    if (editType === "personnel" && editIndex !== null) {
      const updatedPersonnel = [...personnel];
      const personnelId = updatedPersonnel[editIndex].id; // Get the ID of the personnel being edited

      // Update the personnel in the backend
      axios.put(`http://localhost:5000/api/offices/${office.id}/personnel/${personnelId}`, {
        personnelName: newPersonnel.trim(),
      })
      .then(() => {
        updatedPersonnel[editIndex].name = newPersonnel.trim(); // Update the local state
        setPersonnel(updatedPersonnel);
        setEditIndex(null);
        setEditType("");
      })
      .catch((error) => {
        console.error("Error updating personnel:", error);
        alert("Failed to update personnel.");
      });
    } else {
      setPersonnel([...personnel, newPersonnel.trim()]);
    }

    setNewPersonnel("");
  };

  // Edit existing personnel
  const editPersonnel = (index) => {
    setNewPersonnel(personnel[index].name); // Set the name for editing
    setEditIndex(index);
    setEditType("personnel");
  };

  // Delete personnel
  const removePersonnel = (index) => {
    const personnelId = personnel[index].id; // Get the ID of the personnel to delete

    axios.delete(`http://localhost:5000/api/offices/${office.id}/personnel/${personnelId}`)
      .then(() => {
        setPersonnel(personnel.filter((_, i) => i !== index)); // Update local state
      })
      .catch((error) => {
        console.error("Error deleting personnel:", error);
        alert("Failed to delete personnel.");
      });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!officeName.trim()) {
      alert("Office name cannot be empty!");
      return;
    }

    try {
      if (!office?.id) {
        alert("Invalid office data.");
        return;
      }

      await axios.put(`http://localhost:5000/api/offices/${office.id}`, {
        office: officeName,
        services,
        personnel,
      });

      alert("Office updated successfully!");
      navigate("/manageoffice");
    } catch (error) {
      console.error("Error updating office:", error);
      alert("Failed to update office.");
    }
  };

  // Pagination logic for services
  const indexOfLastService = currentServicePage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);

  // Pagination logic for personnel
  const indexOfLastPersonnel = currentPersonnelPage * personnelPerPage;
  const indexOfFirstPersonnel = indexOfLastPersonnel - personnelPerPage;
  const currentPersonnel = personnel.slice(indexOfFirstPersonnel, indexOfLastPersonnel);

  // Change page for services
  const paginateServices = (pageNumber) => setCurrentServicePage(pageNumber);

  // Change page for personnel
  const paginatePersonnel = (pageNumber) => setCurrentPersonnelPage(pageNumber);

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
              <label htmlFor="officeName" className="form-label"></label>
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
                {currentServices.map((service, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between">
                    {service.name}
                    <div>
                      <i className="bi bi-pencil-square text-primary me-2" style={{ cursor: "pointer" }} onClick={() => editService(index + indexOfFirstService)} />
                      <i className="bi bi-trash text-danger" style={{ cursor: "pointer" }} onClick={() => removeService(index + indexOfFirstService)} />
                    </div>
                  </li>
                ))}
              </ul>
              <nav>
                <ul className="pagination">
                  {Array.from({ length: Math.ceil(services.length / servicesPerPage) }, (_, i) => (
                    <li key={i} className={`page-item ${currentServicePage === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => paginateServices(i + 1)}>
 {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
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
                {currentPersonnel.map((person, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between">
                    {person.name}
                    <div>
                      <i className="bi bi-pencil-square text-primary me-2" style={{ cursor: "pointer" }} onClick={() => editPersonnel(index + indexOfFirstPersonnel)} />
                      <i className="bi bi-trash text-danger" style={{ cursor: "pointer" }} onClick={() => removePersonnel(index + indexOfFirstPersonnel)} />
                    </div>
                  </li>
                ))}
              </ul>
              <nav>
                <ul className="pagination">
                  {Array.from({ length: Math.ceil(personnel.length / personnelPerPage) }, (_, i) => (
                    <li key={i} className={`page-item ${currentPersonnelPage === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => paginatePersonnel(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
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