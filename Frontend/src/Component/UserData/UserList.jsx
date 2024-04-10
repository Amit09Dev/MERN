import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import TopNabvar from "../topNavbar/topNavbar";
import Sidebar from "../sidebar/Sidebar";

function UserList() {
  const deletenotify = () => toast.error("Data delete Successfully");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/user/${id}`);
      deletenotify();
      await fetchData();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const getUserId = (id) => {
    navigate(`/userForm/${id}`);
  };

  return (
    <>
    <TopNabvar/>
    <Sidebar/>
      <div className="MainContainer">
        <div className="row mt-3 g-0">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">User</li>
              <li className="breadcrumb-item">
                <i className="bi bi-house f-4"></i>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                User List
              </li>
            </ol>
          </nav>
        </div>
        <div className="row mx-1">
        </div>
        <table className="table table-striped p-3 shadow-sm">
          <thead>
            <tr>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Email</th>
              <th scope="col">Address</th>
              <th scope="col">State</th>
              <th scope="col">City</th>
              <th scope="col">Zip</th>
              <th scope="col">Job Role</th>
              <th scope="col">User Role</th>
              <th scope="col">Color</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="3"></td>
                <td colSpan="6" className="fs-5 text-center ">No records found </td>
                <td colSpan="3"></td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{user.state}</td>
                  <td>{user.city}</td>
                  <td>{user.zip}</td>
                  <td>{user.jobRole}</td>
                  <td>{user.userRole}</td>
                  <td>
                    <i style={{ background: `${user.color}` }} className="px-3 py-1 rounded-circle"></i>
                  </td>
                  <td>
                    <div>
                      <Link to={`/userForm/${user._id}`}>
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="btn mr-2 me-2"
                          onClick={() => getUserId(user._id)}
                        />
                      </Link>
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        className="btn"
                        onClick={() => deleteUser(user._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </>
  );
}

export default UserList;
