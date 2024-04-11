import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import TopNabvar from "../topNavbar/topNavbar";
import Sidebar from "../sidebar/Sidebar";
import axiosInstance from "../../api/Axios";
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
  const initialGridState = {
    id: 0,
    companyName: '',
    startDate: '',
    endDate: ''
  };
  const RoleList = [
    {id:0, value: 'User', label: 'User' },
    { id:1, value: 'Admin', label: 'Admin' },
    {id:2, value: 'Super Admin', label: 'Super Admin' }
  ]
  const [formData, setFormData] = useState(userFormData);
  const [errors, setErrors] = useState({});
  const [gridList, setGridList] = useState([initialGridState]);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const animatedComponents = makeAnimated();
<<<<<<< Updated upstream

=======
  const RoleList = [
    { id: 0, value: 'User', label: 'User' },
    { id: 1, value: 'Admin', label: 'Admin' },
    { id: 2, value: 'Super Admin', label: 'Super Admin' }
  ]
  const [selectedOption, setSelectedOption] = useState(null);
>>>>>>> Stashed changes
  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    const selectedValues = selectedOption ? selectedOption.map(option => option.value) : [];
    setFormData({
      ...formData,
      userRole: selectedValues,
    });
  };

  useEffect(() => {
    if (id) {
      axiosInstance.get(`/emp/${id}`)
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
            color: data.color,
          });
          const selectedRoles = data.userRole.map(role => RoleList.find(r => r.value === role));
          setSelectedOption(selectedRoles);
          const pastExperiences = data.pastExperience.map(experience => ({
            id: experience.id,
            companyName: experience.companyName || "",
            startDate: experience.startDate || "",
            endDate: experience.endDate || ""
          }));
          setGridList(pastExperiences);
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
  const handleSave = async () => {
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const updatedFormData = {
          ...formData,
        };
        console.log(updatedFormData);
        if (id === undefined) {
          await axiosInstance.post("/addEmp", updatedFormData);
          insertnotify();
          resetForm();
          console.log("Form data is valid:", updatedFormData);
        } else {
          const response = await axiosInstance.patch(`/emp/${id}`, updatedFormData);
          updatenotify();
          resetForm();
          navigate("/userlist");
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
    const newGrid = {
      id: gridList.length,
      companyName: "",
      startDate: "",
      endDate: ""
    };
    setGridList([...gridList, newGrid]);
  };
  const handleGridInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedGridList = [...gridList];
    updatedGridList[index][name] = value;
    setGridList(updatedGridList);
    const updatedFormData = {
      ...formData,
      pastExperience: updatedGridList
    };
    setFormData(updatedFormData);
  };

  const handleRemoveGrid = (index) => {
    const updatedGridList = [...gridList];
    updatedGridList.splice(index, 1);
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
    setGridList([initialGridState]);

  };
  const insertnotify = () => toast.success("Data insert Successfully");
  const updatenotify = () => toast.info("Data updated Successfully");
  return (
    <>
      <TopNabvar />
      <Sidebar />
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
                  defaultValue={[RoleList[0], RoleList[1]]}
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
              <div>
                {gridList.map((grid, index) => (
                  <div key={index} className='row'>
                    <div className="col-4">
                      <label className='form-label' htmlFor={`companyName-${index}`}>Company Name:</label>
                      <input
                        className='form-control'
                        type="text"
                        id={`companyName-${index}`}
                        name={`companyName`}
                        placeholder='Enter Company name'
                        value={grid.companyName}
                        onChange={(e) => handleGridInputChange(index, e)}
                      />
                    </div>
                    <div className="col-3">
                      <label className='form-label' htmlFor={`startDate-${index}`}>Start Job Date:</label>
                      <input
                        className='form-control'
                        type="date"
                        id={`startDate-${index}`}
                        name={`startDate`}
                        value={grid.startDate}
                        onChange={(e) => handleGridInputChange(index, e)}
                      />
                    </div>
                    <div className="col-3">
                      <label className='form-label' htmlFor={`endDate-${index}`}>End Job Date:</label>
                      <input
                        className='form-control'
                        type="date"
                        id={`endDate-${index}`}
                        name={`endDate`}
                        value={grid.endDate}
                        onChange={(e) => handleGridInputChange(index, e)}
                      />
                    </div>
                    {gridList.length > 1 && (
                      <div className="col-2 mt-1 d-flex justify-content-end">
                        <i type="button" className="fa-solid fa-xmark remove" onClick={() => handleRemoveGrid(index)}></i>
                      </div>
                    )}
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
