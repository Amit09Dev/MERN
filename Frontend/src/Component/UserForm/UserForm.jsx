import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AddGrid from '../AddGrid/AddGrid.jsx';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Sidebar from "../sidebar/Sidebar.jsx";
import TopNabvar from "../topNavbar/topNavbar.jsx";

function UserForm() {
  const userFormData = {
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    state: "",
    city: "",
    zip: "",
    jobRole: "",
    userRole: [],
    color: "#000000",
    pastExperience: []
  };
  const [formData, setFormData] = useState(userFormData);
  const [errors, setErrors] = useState({});
  const [gridList, setGridList] = useState([{ id: 0 }]);
  const navigate = useNavigate();
  const { id } = useParams();
  const animatedComponents = makeAnimated();
  const RoleList = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'superAdmin', label: 'Super Admin' }
  ]
  const [selectedOption, setSelectedOption] = useState(null);
  // grid data
  const [gridData, setGridData] = useState({
    companyName: '',
    startDate: '',
    endDate: '',
  });

  const handleGridSave = () => {
    setGridData({
      companyName: '',
      startDate: '',
      endDate: ''
    });
  };

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8000/api/user/${id}`)
        .then((response) => {
          const data = response.data;
          console.log("updated data ", data);
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            address: data.address || "",
            state: data.state || "",
            city: data.city || "",
            zip: data.zip || "",
            jobRole: data.jobRole || "",
            userRole: data.userRole || "",
            color: data.color
          });
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    setErrors((old) => {
      return { ...old, [id]: "" }
    });
  };

  const handleSelectChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    setErrors((old) => {
      return { ...old, [id]: "" }
    });
  };

  const handleColorChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      color: value,
    });
  };
  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    console.log(selectedOption);
  };
  const handleSave = async () => {
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const allGridData = gridList.map(grid => grid.gridData);
        const updatedFormData = {
          ...formData,
          pastExperience: allGridData,
          userRole: selectedOption
        };
        console.log("updatewala bhaui", updatedFormData);

        if (id === undefined) {
          const response = await axios.post(
            "http://localhost:8000/api/create",
            updatedFormData
          );
          insertnotify();
          resetForm();
          console.log("Form data is valid:", updatedFormData);
        } else {
          const response = await axios.patch(
            `http://localhost:8000/api/user/${id}`,
            updatedFormData
          );
          updatenotify();
          resetForm();
          navigate("/UserData");
          console.log("Response:", response.data);
          console.log("Form data is valid:", updatedFormData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleAddGrid = () => {
    const newGridList = [...gridList, { id: gridList.length, gridData: { companyName: '', startDate: '', endDate: '' } }];
    setGridList(newGridList);
  };

  const handleRemoveGrid = (id) => {
    const updatedGridList = gridList.filter(grid => grid.id !== id);
    setGridList(updatedGridList);
  };

  const handleGridDataChange = (id, gridData) => {
    const updatedGridList = gridList.map(grid => {
      if (grid.id === id) {
        return { ...grid, gridData };
      }
      return grid;
    });
    setGridList(updatedGridList);
  };

  const validateForm = (data) => {
    const errors = {};

    const requiredFields = ['firstName', 'lastName', 'email', 'jobRole', 'userRole', 'address', 'city', 'state', 'zip'];

    requiredFields.forEach(field => {
      if (!data[field]) {
        const fieldName = field === 'firstName' ? 'First name' : field === 'lastName' ? 'Last name' : field;
        errors[field] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
    });

    if (data.email && !isValidEmail(data.email)) {
      errors.email = "Invalid email address";
    }

    if (data.zip && !isValidZip(data.zip)) {
      errors.zip = "Enter Zip in number";
    }

    return errors;
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const isValidZip = (zip) => {
    return /^[0-9]{6}$/i.test(zip);
  };

  const resetForm = () => {
    if (id) {
      navigate("/userForm");
    }
    setFormData(userFormData);
    setErrors({});

  };
  const insertnotify = () => toast.success("Data insert Successfully");
  const updatenotify = () => toast.info("Data updated Successfully");
  return (

    <>
      <Sidebar />
      <TopNabvar />
      <main className="mt-1">
        <div className="row mt-3 mx-3 ">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">User</li>
              <li className="breadcrumb-item">
                <i className="bi bi-house f-4"></i>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                User Form
              </li>
            </ol>
          </nav>
        </div>
        <form autoComplete="off">
          <div className="row mx-3 mt-2 shadow-lg p-3">

            <div className="col-6">
              <div className={`mb-3 ${errors.firstName ? 'has-error' : ''}`}>
                <label htmlFor="FName" className="form-label">
                  First Name
                </label>{" "}
                <span>*</span>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter the First Name"
                ></input>
                {errors.firstName && (
                  <span className="error">{errors.firstName}</span>
                )}
              </div>
            </div>

            <div className="col-6">
              <div className={`mb-3 ${errors.lastName ? 'has-error' : ''}`}>
                <label htmlFor="LName" className="form-label">
                  Last Name
                </label>{" "}
                <span>*</span>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter the Last Name"
                ></input>
                {errors.lastName && (
                  <span className="error">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="col-6">
              <div className={`mb-3 ${errors.email ? 'has-error' : ''}`}>
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Email address
                </label>{" "}
                <span>*</span>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                ></input>
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
            </div>

            <div className="col-6">
              <div className={`mb-3 ${errors.userRole ? 'has-error' : ''}`}>
                <label htmlFor="userRole" className="form-label">
                  User Role
                </label>
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
                {errors.userRole && (
                  <span className="error">{errors.userRole}</span>
                )}
              </div>
            </div>


            <div className="col-6">
              <div className={`mb-3 ${errors.address ? 'has-error' : ''}`}>
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter Address"
                ></input>
                {errors.address && <span className="error">{errors.address}</span>}
              </div>
            </div>

            <div className="col-6">
              <div className={`mb-3 ${errors.city ? 'has-error' : ''}`}>
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="enter City"
                ></input>
                {errors.city && (
                  <span className="error">{errors.city}</span>
                )}
              </div>
            </div>
            <div className="col-6">
              <div className={`mb-3 ${errors.state ? 'has-error' : ''}`}>
                <label htmlFor="state" className="form-label">
                  State
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter the State"
                ></input>
                {errors.state && (
                  <span className="error">{errors.state}</span>
                )}
              </div>
            </div>
            <div className="col-6">
              <div className={`mb-3 ${errors.zip ? 'has-error' : ''}`}>
                <label htmlFor="zip" className="form-label">
                  Zip Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  placeholder="Enter Zip"
                ></input>
                {errors.zip && (
                  <span className="error">{errors.zip}</span>
                )}
              </div>
            </div>
            <div className="col-6">
              <div className={`mb-3 ${errors.jobRole ? 'has-error' : ''}`}>
                <label htmlFor="jobRole" className="form-label">
                  Job Role
                </label>{" "}
                <span>*</span>
                <select
                  className={`form-select ${errors.jobRole ? 'is-invalid' : ''}`}
                  id="jobRole"
                  value={formData.jobRole}
                  onChange={handleSelectChange}
                >
                  <option value="">Select Job Role</option>
                  <option value="Fitter">Fitter</option>
                  <option value="Technician">Technician</option>
                  <option value="Labour">Labour</option>
                </select>
                {errors.jobRole && (
                  <span className="error">{errors.jobRole}</span>
                )}
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className={`mb-3 w-75`}>
                  <label htmlFor="color" className="form-label">
                    Color
                  </label>{" "}
                  <input
                    type="color"
                    className="form-control"
                    id="color"
                    value={formData.color}
                    onChange={handleColorChange}
                  />
                </div>
                <button type="button" className="btn btn-primary" id="addCompany" onClick={handleAddGrid}>Add Experience</button>
              </div>
            </div>
            <div>
              <div className="row">
                <p>Past Experience</p>
                {gridList.map(grid => (
                  <div className="col-12" key={grid.id}>
                    <div className="row">
                      <div className="col-11">
                        <AddGrid handleGridDataChange={data => handleGridDataChange(grid.id, data)} />
                      </div>
                      <div className="col-1">
                        {gridList.length > 1 && (
                          <i className="fa-solid fa-xmark remove ms-2" onClick={() => handleRemoveGrid(grid.id)}></i>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-10"></div>
              <div className="col-2 d-flex justify-content-end">
                <button type="button" className="btn btn-primary me-2"
                  onClick={resetForm}>
                  Reset Form
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSave}
                >
                  Submit
                </button>
              </div>
            </div>

          </div>
        </form>
      </main>
    </>
  );
}
export default UserForm;
