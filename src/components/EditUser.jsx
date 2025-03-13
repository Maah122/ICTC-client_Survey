import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../global/NavBar";
import AdminSidebar from "../global/AdminSideBar";
import './AddUser.css';
import axios from 'axios';

const EditUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [officeOptions, setOfficeOptions] = useState([]);
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

  const fetchOffices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/offices");
      console.log("Fetched offices:", response.data); // ← Add this line
      setOfficeOptions(response.data);
    } catch (err) {
      console.error("Error loading offices:", err);
    }
  };

  useEffect(() => {
    fetchOffices(); // Call the fetch function for offices
  }, []);
  
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
    const office = officeOptions.find(o => o.name === selectedOffice);
    if (office && !selectedOffices.some(o => o.id === office.id)) {
      setSelectedOffices([...selectedOffices, office]);
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
        user_rights: userRights,
      };
      
      if (userRights === "Limited") {
        updatedUser.offices = selectedOffices.map(o => o.id);
      }    
      console.log("Updating user with ID:", editedUser.id);
  
      const response = await axios.put(
        `http://localhost:5000/api/update-user/${editedUser.id}`,
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
    setShowModal(false); // We just close the modal here
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
                      <i id="add-btn" style={{ cursor: 'pointer', textDecoration: 'none', fontStyle: 'normal', textAlign: 'center', lineHeight: '1', width: '80px', height: '30px'}} onClick={() => setShowModal(true)}>+ Add</i>
                      <ul>
                        {selectedOffices.map((office, index) => (
                          <li key={index}>
                            {office.name}
                            <i id="add-btn" style={{ cursor: 'pointer', textDecoration: 'none', fontStyle: 'normal', textAlign: 'center' }} onClick={() => removeOffice(office)}> - Remove</i>
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
                    <option key={office.id} value={office.name}>{office.name}</option>
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
