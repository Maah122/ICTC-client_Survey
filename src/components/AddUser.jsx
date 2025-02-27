import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import Navbar from "../global/NavBar";
import AdminSidebar from "../global/AdminSideBar";
import './AddUser.css';

// The office options for the dropdown
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

  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const addUser = () => {
    console.log("New User Added:", newUser);

    setSuccessMessage("User Added Successfully!");

    setTimeout(() => {
      navigate('/manageuser');
    }, 2000);
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <h4 className="mb-4 text-center">Add New User</h4>

              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}

              <div className="form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
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
                  value={newUser.email}
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
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter password"
                />
              </div>

              <div className="form-group mt-3">
                <label htmlFor="office">Select Office</label>
                <select
                  name="office"
                  value={newUser.office}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">Select Office</option>
                  {officeOptions.map((office) => (
                    <option key={office.id} value={office.officeName}>
                      {office.officeName}
                    </option>
                  ))}
                </select>
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
