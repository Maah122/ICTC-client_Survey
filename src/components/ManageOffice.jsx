import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../global/NavBar";
import AdminSidebar from "../global/AdminSideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ManageOffice.css";

const ManageOffice = () => {
  const [offices, setOffices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Load offices from localStorage
  useEffect(() => {
    const storedOffices = JSON.parse(localStorage.getItem("offices")) || [];
    setOffices(storedOffices);
  }, []);

  // Delete Office
  const deleteOffice = (id) => {
    if (window.confirm("Are you sure you want to delete this office?")) {
      const updatedOffices = offices.filter((office) => office.id !== id);
      setOffices(updatedOffices);
      localStorage.setItem("offices", JSON.stringify(updatedOffices));
    }
  };

  // Navigate to Add Office Page
  const goToAddOfficePage = () => {
    navigate("/add-office");
  };

  // Navigate to Edit Office Page
  const goToEditOfficePage = (office) => {
    navigate("/edit-office", { state: { office } });
  };

  // Filter offices by search
  const filteredOffices = offices.filter((office) =>
    office.office.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="container mt-4">
          <h4>Manage Office</h4>
          <div className="d-flex align-items-center gap-2 mb-3">
            <input
              type="text"
              className="form-control w-auto flex-grow-1"
              placeholder="Search Office"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-add-office" onClick={goToAddOfficePage}>
              Add Office
            </button>
          </div>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Office</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffices.map((office) => (
                <tr key={office.id}>
                  <td>{office.id}</td>
                  <td>{office.office}</td>
                  <td>
                    <i
                      className="bi bi-pencil-square"
                      style={{ cursor: "pointer", marginRight: "10px" }}
                      onClick={() => goToEditOfficePage(office)}
                    />
                    <i
                      className="bi bi-trash"
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => deleteOffice(office.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOffice;
