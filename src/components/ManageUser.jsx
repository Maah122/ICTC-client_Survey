import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../global/NavBar";
import AdminSidebar from "../global/AdminSideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ManageUser.css";


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
const mockUsers = [
  { id: 1, office: "CCS", name:"John Doe", email: "john@example.com", rights: "View all" },
  { id: 2, office: "CSM", name:"Jane Doe", email: "jane@example.com", rights: "Limited" },
  { id: 3, office: "CCS",  name:"Mark Doe",email: "mark@example.com", rights: "Limited" },
  { id: 4, office: "CASS",  name:"Alex Doe",email: "alex@example.com" , rights: "Limited"},
  { id: 5, office: "CEBA",  name:"Austin Doe",email: "austin@example.com", rights: "Limited" },
  { id: 6, office: "Accounting Division", name:"Michael Doe", email: "michael@example.com", rights: "Limited" },
  { id: 7, office: "CED",  name:"Luna Doe",email: "luna@example.com", rights: "Limited" },
  { id: 8, office: "CCS", name:"John Doe", email: "john@example.com", rights: "Limited" },
  { id: 9, office: "CSM", name:"Jane Doe", email: "jane@example.com" , rights: "Limited"},
  { id: 10, office: "CCS",  name:"Mark Doe",email: "mark@example.com" , rights: "Limited"},
  { id: 11, office: "CASS",  name:"Alex Doe",email: "alex@example.com", rights: "Limited" },
  { id: 12, office: "CEBA",  name:"Austin Doe",email: "austin@example.com" , rights: "Limited"},
  { id: 13, office: "Accounting Division", name:"Michael Doe", email: "michael@example.com", rights: "Limited"},
  { id: 14, office: "CED",  name:"Luna Doe",email: "luna@example.com" , rights: "Limited"},
];

const ManageUser = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOffice, setSelectedOffice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [filterOffice, setFilterOffice] = useState("");

  const addOffice = () => {
    if (selectedOffice && !currentUser?.offices?.includes(selectedOffice)) {
      const updatedOffices = [...(currentUser.offices || []), selectedOffice];
  
      const updatedUser = {
        ...currentUser,
        office: updatedOffices.join(", "), // Update the office field
        offices: updatedOffices,           // Keep track of selected offices
      };
  
      setCurrentUser(updatedUser);
  
      // Update the users list to reflect the new offices
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === currentUser.id ? updatedUser : user))
      );
  
      setSelectedOffice(""); // Clear selection
    }
  };
  
  
  
  
  const handleUserRightsChange = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };
  const saveUserRights = () => {
    setUsers(users.map((user) => (user.id === currentUser.id ? currentUser : user)));
    setShowModal(false);
  };

  const deleteUser = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    
    if (isConfirmed) {
      setUsers(users.filter((user) => user.id !== id));
      alert("User deleted successfully!");
    }
  };
  
  const goToAddUserPage = () => {
    navigate("/add-user");
  };
  const removeOffice = (office) => {
    setSelectedOffice(selectedOffice.filter((o) => o !== office));
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterOffice === "" || user.office.includes(filterOffice))
  );
  

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="container mt-4">
          <h4>Manage Users</h4>
          <div id="category" className="d-flex justify-content-between mb-3">
            <input
              id="searchBar"
              type="text"
              className="form-control w-25"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              id="officeBar"
              className="form-select"
              value={selectedOffice}
              onChange={(e) => setFilterOffice(e.target.value)}
            >
              <option value="">All Offices</option>
              {[...new Set(users.map((user) => user.office))].map((office) => (
                <option key={office} value={office}>
                  {office}
                </option>
              ))}
            </select>
            <button id="add-btn" className="btn btn-primary" onClick={goToAddUserPage}>
              Add User
            </button>
          </div>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Office</th>
                <th>Name</th>
                <th>Email</th>
                <th>User Rights</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="ellipsis" style={{ maxWidth: "200px" }} title={user.office}>
                    {user.office}
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.rights}</td>
                  <td>
                    {/* <button id="edit-btn"className="btn btn-warning me-2" onClick={() => navigate("/edit-user", { state: { user } })}>
                      Edit
                    </button>
                    <button id="delete-btn"className="btn btn-danger" onClick={() => deleteUser(user.id)}>
                      Delete
                    </button> */}
                    <i id="delete-btn"class="bi bi-pencil-square" style = {{ cursor: 'pointer'}} onClick={() => navigate("/edit-user", { state: { user } })} ></i>
                    <i id="edit-btn" class="bi bi-trash" style={{ cursor: 'pointer', color: 'red' }} onClick={() => deleteUser(user.id)} ></i>
                    <i class="bi bi-gear" style={{ cursor: 'pointer' }} onClick={() => handleUserRightsChange(user)}></i>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav>
            <ul className="pagination justify-content-center">
              {[...Array(Math.ceil(filteredUsers.length / usersPerPage))].map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {showModal && (
  <div className="modal show d-block" tabIndex="-1">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Manage User Rights</h5>
          <button className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>
        <div className="modal-body">
          <label>User Rights:</label>
          <div>
            <label>
              <input
                type="radio"
                name="userRights"
                value="Admin"
                checked={currentUser?.rights === "Admin"}
                onChange={(e) => setCurrentUser({ ...currentUser, rights: e.target.value })}
              />{" "}
              Admin
            </label>
            <label className="ms-3">
              <input
                type="radio"
                name="userRights"
                value="View all"
                checked={currentUser?.rights === "View all"}
                onChange={(e) => setCurrentUser({ ...currentUser, rights: e.target.value })}
              />{" "}
              View all
            </label>
            <label className="ms-3">
              <input
                type="radio"
                name="userRights"
                value="Limited"
                checked={currentUser?.rights === "Limited"}
                onChange={(e) => setCurrentUser({ ...currentUser, rights: e.target.value })}
              />{" "}
              Limited
            </label>
          </div>

          {currentUser?.rights === "Limited" && (
            <>
              <h2 id="modal-sub-title"className="mt-4">Select Offices for Limited Access:</h2>
              <select
                className="form-control"
                value={selectedOffice}
                onChange={(e) => setSelectedOffice(e.target.value)}
              >
                <option value="">Select Office</option>
                {officeOptions.map((office) => (
                  <option key={office.id} value={office.officeName}>
                    {office.officeName}
                  </option>
                ))}
              </select>
              <div className="mt-3">
                <h6 className="selected-offices">Selected Offices:</h6>
                <ul>
                  {currentUser?.offices?.map((office, index) => (
                    <li className="offices"key={index}>{office}
                    <i id="add-btn"className="bi bi-trash" style={{ cursor: 'pointer' }} onClick={() => removeOffice(office)}></i>
                    </li>
                  ))}
                  
                </ul>
                
              </div>
              <button className="btn btn-success mt-3" onClick={addOffice}>
                Add Office
              </button>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
            Close
          </button>
          <button className="btn btn-primary" onClick={saveUserRights}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ManageUser;
