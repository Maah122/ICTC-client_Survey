import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const AddUser = () => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    office: "",
  });

  const [userRights, setUserRights] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleUserRightsChange = (e) => setUserRights(e.target.value);

  const addUser = async () => {
    // Validation logic
    if (!newUser.name || !newUser.email || !newUser.username || !newUser.password || !newUser.office || !userRights) {
      alert("All fields are required. Please fill out the form completely.");
      return;
    }
  
    // Additional email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      alert("Please enter a valid email address.");
      return;
    }
  
    try {
      await axios.post("http://localhost:5000/api/adduser", {
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        password: newUser.password,
        office: newUser.office,
        userRights
      });
      setSuccessMessage("User Added Successfully!");
      setTimeout(() => navigate('/manageuser'), 2000);
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user. Please try again.");
    }
  };
  

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              <div className="form">
                <h4 className="mb-4 text-center">Add New User</h4>

                <div className="form-group">
                  <label className="label" htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter name"
                    required
                  />
                </div>

                <div className="form-group mt-3">
                  <label className="label" htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter email"
                    required
                  />
                </div>

                <div className="form-group mt-3">
                  <label className="label" htmlFor="username">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div className="form-group mt-3">
                  <label className="label" htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter password"
                    required
                  />
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="office">Select Office</label>
                  <select
                    name="office"
                    value={newUser.office}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  >
                    <option value="">Select Office</option>
                    {officeOptions.map((office) => (
                      <option key={office.id} value={office.officeName}>
                        {office.officeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group mt-3">
                  <label>User Rights:</label>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="userRights"
                        value="Admin"
                        checked={userRights === "Admin"}
                        onChange={handleUserRightsChange}
                        required
                      /> Admin
                    </label>
                    <label className="ms-3">
                      <input
                        type="radio"
                        name="userRights"
                        value="View all"
                        checked={userRights === "View all"}
                        onChange={handleUserRightsChange}
                      /> View all
                    </label>
                    <label className="ms-3">
                      <input
                        type="radio"
                        name="userRights"
                        value="Limited"
                        checked={userRights === "Limited"}
                        onChange={handleUserRightsChange}
                      /> Limited
                    </label>
                  </div>
                </div>

                <button onClick={addUser} className="btn btn-primary mt-4 w-100">
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
