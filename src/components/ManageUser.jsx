import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../global/NavBar";
import AdminSidebar from "../global/AdminSideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ManageUser.css";

const mockUsers = [
  { id: 1, office: "CCS", name:"John Doe", email: "john@example.com" },
  { id: 2, office: "CSM", name:"Jane Doe", email: "jane@example.com" },
  { id: 3, office: "CCS",  name:"Mark Doe",email: "mark@example.com" },
  { id: 4, office: "CASS",  name:"Alex Doe",email: "alex@example.com" },
  { id: 5, office: "CEBA",  name:"Austin Doe",email: "austin@example.com" },
  { id: 6, office: "Accounting Division", name:"Michael Doe", email: "michael@example.com" },
  { id: 7, office: "CED",  name:"Luna Doe",email: "luna@example.com" },
  { id: 8, office: "CCS", name:"John Doe", email: "john@example.com" },
  { id: 9, office: "CSM", name:"Jane Doe", email: "jane@example.com" },
  { id: 10, office: "CCS",  name:"Mark Doe",email: "mark@example.com" },
  { id: 11, office: "CASS",  name:"Alex Doe",email: "alex@example.com" },
  { id: 12, office: "CEBA",  name:"Austin Doe",email: "austin@example.com" },
  { id: 13, office: "Accounting Division", name:"Michael Doe", email: "michael@example.com" },
  { id: 14, office: "CED",  name:"Luna Doe",email: "luna@example.com" },
];

const ManageUser = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOffice, setSelectedOffice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const navigate = useNavigate();

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const goToAddUserPage = () => {
    navigate("/add-user");
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedOffice === "" || user.office === selectedOffice)
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
          <div className="d-flex justify-content-between mb-3">
            <input
              id="searchBar"
              type="text"
              className="form-control w-50"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="form-select w-25"
              value={selectedOffice}
              onChange={(e) => setSelectedOffice(e.target.value)}
            >
              <option value="">All Offices</option>
              {[...new Set(users.map((user) => user.office))].map((office) => (
                <option key={office} value={office}>
                  {office}
                </option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={goToAddUserPage}>
              Add User
            </button>
          </div>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Office</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.office}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="btn btn-warning me-2" onClick={() => navigate("/edit-user", { state: { user } })}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => deleteUser(user.id)}>
                      Delete
                    </button>
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
    </div>
  );
};

export default ManageUser;
