import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
<<<<<<< Updated upstream
import TopNabvar from "../topNavbar/topNavbar";
import Sidebar from "../sidebar/Sidebar";
import axiosInstance from "../../api/Axios";
=======
import axiosInstance from "../../api/Axios";
import TopNabvar from "../topNavbar/topNavbar";
import Sidebar from "../sidebar/Sidebar";
import makeAnimated from 'react-select/animated';
import Select from 'react-select';

>>>>>>> Stashed changes

function UserData() {
  const deletenotify = () => toast.error("Data delete Successfully");
  const [users, setUsers] = useState([]);

  const [inputValue, setInputValue] = useState({
    userName: "",
    userRole: [],
    startDate: "",
    endDate: "",
  });
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const animatedComponents = makeAnimated();
  const RoleList = [
    { value: 'User', label: 'User' },
    { value: 'Admin', label: 'Admin' },
    { value: 'Super Admin', label: 'Super Admin' }
  ]

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInputValue({
      ...inputValue,
      [id]: value,
    });
    console.log(inputValue)
  };

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    const selectedValues = selectedOption ? selectedOption.map(option => option.value) : [];
    setInputValue({
      ...inputValue,
      userRole: selectedValues,
    });
  };

  const SearchResults = () => {
    if (inputValue.firstName === "" && inputValue.email === "" && inputValue.startDate === "" && inputValue.endDate === "") {
      toast.warn("Enter Some Value to Search");
      return
    }
    else {
      const updatedFormData = {
        ...inputValue,
      };
      console.log(updatedFormData);
    }
  }

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/emp");
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axiosInstance.delete(`/emp/${id}`);
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
<<<<<<< Updated upstream
      <TopNabvar/>
      <Sidebar/>
      <div className="MainContainer">
        <div className="row mt-3 g-0">
          <nav aria-label="breadcrumb">
            <div className="row g-0">
              <div className="col-4">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">User</li>
                  <li className="breadcrumb-item">
                    <i className="bi bi-house f-4"></i>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    User List
                  </li>
                </ol>
              </div>
              <div className="col-4"></div>
              <div className="col-4">

              </div>
            </div>
          </nav>
        </div>
        <div className="row mx-1 g-0">
=======
      <TopNabvar />
      <Sidebar />
      <div className="MainContainer">
        <div className="container-fluid">
          <div className="row my-3">
            <div className="col-3">
              <input type="text" className="form-control" id="userName" placeholder="Full Name"
                value={inputValue.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-3">
              <Select
                isMulti
                name="Roles"
                id="userRole"
                components={animatedComponents}
                options={RoleList}
                className="basic-multi-select"
                classNamePrefix="select"
                value={selectedOption}
                onChange={handleChange}
              />
            </div>
            <div className="col-2">
              <input type="date" className="form-control" id="startDate" value={inputValue.startDate}
                onChange={(e) => handleInputChange(e)} />
            </div>
            <div className="col-2">
              <input type="date" className="form-control" id="endDate"
                value={inputValue.endDate}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
            <div className="col-2">
              <button type="button" className="btn btn-outline-primary w-100" onClick={SearchResults}>Search</button>
            </div>
          </div>
        </div>
        <div className="row mt-3 g-0">
          <nav aria-label="breadcrumb">
            <div className="row g-0">
              <div className="col-4">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">User</li>
                  <li className="breadcrumb-item">
                    <i className="bi bi-house f-4"></i>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    User List
                  </li>
                </ol>
              </div>
              <div className="col-4"></div>
              <div className="col-4">
              </div>
            </div>
          </nav>
        </div>
        <div className="row g-0 mx-1">
>>>>>>> Stashed changes
        </div>
        <table className="table table-striped p-3 shadow-sm">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Address</th>
              <th scope="col">State</th>
              <th scope="col">City</th>
              <th scope="col">CompanyName</th>
<<<<<<< Updated upstream
              <th scope="col">startDate</th>
              <th scope="col">EndDate</th>
=======
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
>>>>>>> Stashed changes
              <th scope="col">Job Role</th>
              <th scope="col">User Role</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="3"></td>
                <td colSpan="6" className="fs-5 text-center">No records found </td>
                <td colSpan="3"></td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index}>
                  <td>{user.firstName + " " + user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{user.state}</td>
                  <td>{user.city}</td>
                  <td>
                    {user.pastExperience.map((experience, expIndex) => (
                      <div key={expIndex}>{experience.companyName}</div>
                    ))}
                  </td>
                  <td>
                    {user.pastExperience.map((experience, expIndex) => (
                      <div key={expIndex}>{experience.startDate}</div>
                    ))}
                  </td>
                  <td>
                    {user.pastExperience.map((experience, expIndex) => (
                      <div key={expIndex}>{experience.endDate}</div>
                    ))}
                  </td>
                  <td>{user.jobRole}</td>
<<<<<<< Updated upstream
                  <td>
                    {user.userRole.map((role, roleIndex) => (
                      <div key={roleIndex}>{role}</div>
                    ))}
                  </td>
=======
                  <td>{user.userRole}</td>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      </div>
=======

      </div>

>>>>>>> Stashed changes
    </>
  );
}

export default UserData;
