import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../global/NavBar";
import AdminSidebar from "../global/AdminSideBar";
import './AddUser.css';
import axios from 'axios';

const officeOptions = [
  { id: 1, officeName: "Accounting Division" },
  { id: 2, officeName: "Alumni and Endowment Fund Center" },
  { id: 3, officeName: "CED - Integrated Development School" },
  { id: 4, officeName: "Center for Advanced Education and Lifelong Learning" },
  { id: 5, officeName: "Center for Information and Communication Technology" },
  { id: 6, officeName: "College of Education" },
  { id: 7, officeName: "Hostel" },
  { id: 8, officeName: "HR Management Division" },
  { id: 9, officeName: "Infrastructure Services Division" },
  { id: 10, officeName: "Knowledge and Technology Transfer Office" },
  { id: 11, officeName: "Legal Services Office" },
  { id: 12, officeName: "MSU-IIT Center for Resiliency" },
];

const EditUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state || {};

  const [editedUser, setEditedUser] = useState(user || {
    id: "",
    name: "",
    email: "",
    password: "",
    office: "",
  });

  const [userRights, setUserRights] = useState(user?.rights || "");
  const [showModal, setShowModal] = useState(false);
  const [selectedOffices, setSelectedOffices] = useState(user?.offices || []);
  const [selectedOffice, setSelectedOffice] = useState("");
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleUserRightsChange = (e) => {
    const value = e.target.value;
    setUserRights(value);
    if (value === "Limited") setShowModal(true);
  };

  const addOffice = () => {
    if (selectedOffice && !selectedOffices.includes(selectedOffice)) {
      setSelectedOffices([...selectedOffices, selectedOffice]);
      setSelectedOffice("");
    }
  };

  const removeOffice = (office) => {
    setSelectedOffices(selectedOffices.filter((o) => o !== office));
  };

  const saveUser = async () => {
    try {
      const updatedUser = {
        name: editedUser.name,
        email: editedUser.email,
        password: editedUser.password,
        userRights: userRights
      };
  
      const response = await axios.put(
        `http://localhost:5000/api/updateuser/${editedUser.id}`, 
        updatedUser
      );
  
      console.log("User Updated:", response.data);
      alert("User updated successfully!");
      navigate("/manageuser");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  const saveUserRights = () => {
    console.log("User rights updated for selected offices:", selectedOffices);
    setShowModal(false);
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <h4 className="mb-4 text-center">Edit User</h4>
              <div className="form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editedUser.name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter name"
                  />
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter email"
                  />
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={editedUser.password}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter new password"
                  />
                </div>

                <div className="form-group mt-3">
                  <label>User Rights:</label>
                  <div>
                    <label>
                      <input type="radio" name="userRights" value="Admin" checked={userRights === "Admin"} onChange={handleUserRightsChange} /> Admin
                    </label>
                    <label className="ms-3">
                      <input type="radio" name="userRights" value="View all" checked={userRights === "View all"} onChange={handleUserRightsChange} /> View all
                    </label>
                    <label className="ms-3">
                      <input type="radio" name="userRights" value="Limited" checked={userRights === "Limited"} onChange={handleUserRightsChange} /> Limited
                    </label>
                  </div>
                  {userRights === "Limited" && (
                    <div className="mt-3">
                      <label>Selected Offices:</label>
                      <i id="add-btn"className="bi bi-plus-circle" style={{ cursor: 'pointer' }} onClick={() => setShowModal(true)}></i>
                      <ul>
                        {selectedOffices.map((office, index) => (
                          <li key={index}>
                            {office}
                            <i id="add-btn"className="bi bi-trash" style={{ cursor: 'pointer' }} onClick={() => removeOffice(office)}></i>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div> 

                <button onClick={saveUser} className="btn btn-success mt-4 w-100">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Offices for Limited Access</h5>
              </div>
              <div className="modal-body">
                <select className="form-control" value={selectedOffice} onChange={(e) => setSelectedOffice(e.target.value)}>
                  <option value="">Select Office</option>
                  {officeOptions.map((office) => (
                    <option key={office.id} value={office.officeName}>{office.officeName}</option>
                  ))}
                </select>
                <button className="btn btn-success mt-3" onClick={addOffice}>Add Office</button>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={saveUserRights}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUser;
