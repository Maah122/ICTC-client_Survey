import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../global/NavBar";
import AdminSidebar from "../global/AdminSideBar";
import './AddUser.css';

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
  const [showModal, setShowModal] = useState(false);
  const [selectedOffices, setSelectedOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
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

  const addUser = () => {
    console.log("New User Added:", newUser, "Selected Offices:", selectedOffices);
    setSuccessMessage("User Added Successfully!");
    setTimeout(() => navigate('/manageuser'), 2000);
  };
  const saveUserRights = () => {
    console.log("User rights saved for selected offices:", selectedOffices);
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
              {successMessage && <div className="alert alert-success">{successMessage}
                </div>}
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
                  />
                </div>
                {/* <div className="form-group mt-3">
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
                </div> */}

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
                            
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button onClick={addUser} className="btn btn-primary mt-4 w-100">Add User</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Offices for Limited Access</h5>
                <button className="btn-close" style={{ animation: 'none' }}onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <select className="form-control" value={selectedOffice} onChange={(e) => setSelectedOffice(e.target.value)}>
                  <option value="">Select Office</option>
                  {officeOptions.map((office) => (
                    <option key={office.id} value={office.officeName}>{office.officeName}</option>
                  ))}
                </select>
                <div className="mt-3">
                <h6 className="selected-offices">Selected Offices:</h6>
                <ul>
                  {selectedOffices.map((office, index) => (
                    <li className="offices" key={index}>{office}
                    <i id="add-btn"className="bi bi-trash" style={{ cursor: 'pointer' }} onClick={() => removeOffice(office)}></i>
                    </li>
                  ))}
                </ul>
              </div>
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

export default AddUser;
