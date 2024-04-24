import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import TopNabvar from "../topNavbar/topNavbar";
import Sidebar from "../sidebar/Sidebar";
import axiosInstance from "../../api/Axios";
import ActiviyLog from '../../api/Activitylog'
import { useSelector } from 'react-redux'
import { TabView, TabPanel } from 'primereact/tabview';
import { DiffPatcher } from 'jsondiffpatch';
import "./UserForm.css";
// import { type } from "@testing-library/user-event/dist/type";
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
    pastExperience: [],
  };
  const initialGridState = {
    id: 0,
    companyName: "",
    startDate: "",
    endDate: "",
  };
  const [RoleList, setRoleList] = useState([]);
  const [formData, setFormData] = useState(userFormData);
  const [errors, setErrors] = useState({});
  const [gridList, setGridList] = useState([initialGridState]);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("");
  const [selectedOption, setSelectedOption] = useState({
  });
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [touched, setTouched] = useState(false);
  const [tempData, setTempData] = useState({});
  const navigate = useNavigate();
  const [company, setCompany] = useState({});
  const { id } = useParams();
  const [selectOptions, setSelectOptions] = useState({});
  const animatedComponents = makeAnimated();
  const [fields, setFields] = useState([]);
  let dynaminData = []
  dynaminData = useSelector((state) => state.counter.fields);
  useEffect(() => {
  console.log("Dynamic Form", dynaminData);
    if (dynaminData) {

const formattedFields = dynaminData.map((field) => {
  if (field.type === "select") {
      setSelectOptions(prevState => ({
          ...prevState,
          [field.name]: field.options
      }));
  }
  return {
      name: field.name,
      type: field.type
  };
});
setFields(formattedFields);
    }
  }, [dynaminData]);
  const additionalDataSave = async () => {
    try {
      const data = fields.map((field) => ({
        [field.name]: company[field.name] || null,
      }));
      console.log("Additional Data",data);
      setCompany({});
    } catch (error) {
      console.log(error);
    }
  };
  


  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    const selectedValues = selectedOption
      ? selectedOption.map((option) => option.value)
      : [];
    setFormData({
      ...formData,
      userRole: selectedValues,
    });
  };

  const handleEmailCheck = async (e) => {
    const email = e.target.value;
    const emailElm = document.getElementById("email");
    const isValid = isValidEmail(email);
    setIsEmailValid(isValid);
    if (email === "") {
      emailElm.classList.remove("is-invalid", "is-valid");
      return;
    }
    if (!isValid && touched) {
      emailElm.classList.add("is-invalid");
      emailElm.classList.remove("is-valid");
      return;
    } else {
      try {
        const { data } = await axiosInstance.get("/checkEmail", {
          params: { email, id, modelName: "Employee" },
        });
        const errorMessage = data.status ? "" : data.msg;
        setErrors({ ...errors, email: errorMessage });
        setTouched(true);
        emailElm.classList.toggle("is-invalid", !data.status);
        emailElm.classList.toggle("is-valid", data.status);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const RoleData = async () => {
    try {
      const response = await axiosInstance.get("/role");
      const formattedRoles = response.data.map((role) => ({
        value: role._id,
        label: role.role,
      }));
      setRoleList([...formattedRoles]);
    } catch (error) {
      console.error("Error fetching role data:", error.response);
      if (error.response && error.response.data.includes("jwt expired")) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    RoleData();
    if (id) {
      axiosInstance
        .get(`/emp/${id}`)
        .then((response) => {
          const data = response.data;
          setTempData(data);
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            address: data.address || "",
            state: data.state || "",
            city: data.city || "",
            zip: data.zip || "",
            jobRole: data.jobRole || "",
            color: data.color
          });
          setSelectedOption(data.userRole);
          const pastExperiences = data.pastExperience.map((experience) => ({
            id: experience.id,
            companyName: experience.companyName || "",
            startDate: experience.startDate || "",
            endDate: experience.endDate || "",
          }));
          setGridList(pastExperiences);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [id]);
  const handleFieldChange = (fieldName, value) => {
    setCompany({ ...company, [fieldName]: value });
  };
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    setErrors((old) => {
      return { ...old, [id]: "" };
    });
  };
  const handleSelectChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });

    setErrors((old) => {
      return { ...old, [id]: "" };
    });
  };

  const handleColorChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      color: value,
    });
  };

  function calculateChanges(oldData, newData) {
    const differ = new DiffPatcher();
    const delta = differ.diff(oldData, newData);

    return delta;
  }


  const handleSave = async () => {
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        let updatedFormData = { ...formData };


        if (JSON.stringify(selectedOption) !== JSON.stringify(formData.userRole)) {
          updatedFormData = {
            ...updatedFormData,
            userRole: selectedOption.map(option => option.value),
            pastExperience: [...gridList]
          };
        }

        if (id === undefined) {
          const res = await axiosInstance.post("/addEmp", updatedFormData);
          if (res.status === 200) {
            ActiviyLog.page = window.location.href;
            ActiviyLog.action = "User Added";
            ActiviyLog.dataType = "Employee";
            ActiviyLog.actionOnEmail = updatedFormData.email;
            await axiosInstance.post("/activityLog", ActiviyLog)
          }
          insertnotify();
          resetForm();
        }
        else {
          await axiosInstance.patch(`/emp/${id}`, updatedFormData);
          updatenotify();
          resetForm();
          navigate("/userlist");
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
      endDate: "",
    };
    setGridList([...gridList, newGrid]);
  };
  const handleGridInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedGridList = gridList.map((item, i) => {
      if (index === i) {
        return { ...item, [name]: value };
      }
      return item;
    });

    setGridList(updatedGridList);
    const updatedFormData = {
      ...formData,
      pastExperience: updatedGridList,
    };
    setFormData(updatedFormData);
  };

  const handleRemoveGrid = (index) => {
    const updatedGridList = [...gridList];
    updatedGridList.splice(index, 1);
    setGridList(updatedGridList);
    const updatedFormData = {
      ...formData,
      pastExperience: updatedGridList,
    };
    setFormData(updatedFormData);
  };

  const validateForm = (data) => {
    const errors = {};

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "jobRole",
      "address",
      "city",
      "state",
      "zip",
    ];
    requiredFields.forEach((field) => {
      if (!data[field]) {
        const fieldName =
          field === "firstName"
            ? "First name"
            : field === "lastName"
              ? "Last name"
              : field;
        errors[field] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
          } is required`;
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
    setSelectedOption('');
    setRoleList("");

    document.getElementById("email").classList.remove("is-invalid", "is-valid");
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
        <TabView>
          <TabPanel header="UserForm">
            <div className="m-0">
              <form autoComplete="off">
                <div className="row mx-3 mt-2 shadow-lg p-3">
                  <div className="col-6">
                    <div className={`mb-3 ${errors.firstName ? "has-error" : ""}`}>
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
                    <div className={`mb-3 ${errors.lastName ? "has-error" : ""}`}>
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
                    <div className={`mb-3 ${errors.email ? "has-error" : ""}`}>
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
                        onInput={handleEmailCheck}
                        placeholder="name@example.com"
                      />
                      {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="col-6">
                    <div className={`mb-3 ${errors.userRole ? "has-error" : ""}`}>
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
                    <div className={`mb-3 ${errors.address ? "has-error" : ""}`}>
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
                      {errors.address && (
                        <span className="error">{errors.address}</span>
                      )}
                    </div>
                  </div>

                  <div className="col-6">
                    <div className={`mb-3 ${errors.city ? "has-error" : ""}`}>
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
                      {errors.city && <span className="error">{errors.city}</span>}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={`mb-3 ${errors.state ? "has-error" : ""}`}>
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
                      {errors.state && <span className="error">{errors.state}</span>}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={`mb-3 ${errors.zip ? "has-error" : ""}`}>
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
                      {errors.zip && <span className="error">{errors.zip}</span>}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={`mb-3 ${errors.jobRole ? "has-error" : ""}`}>
                      <label htmlFor="jobRole" className="form-label">
                        Job Role
                      </label>{" "}
                      <span>*</span>
                      <select
                        className={`form-select ${errors.jobRole ? "is-invalid" : ""
                          }`}
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
                      <button
                        type="button"
                        className="btn btn-primary"
                        id="addCompany"
                        onClick={handleAddGrid}
                      >
                        Add Experience
                      </button>
                    </div>
                  </div>
                  <div>
                    <div>
                      {gridList.map((grid, index) => (
                        <div key={index} className="row">
                          <div className="col-4">
                            <label
                              className="form-label"
                              htmlFor={`companyName-${index}`}
                            >
                              Company Name:
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              id={`companyName-${index}`}
                              name={`companyName`}
                              placeholder="Enter Company name"
                              value={grid.companyName}
                              onChange={(e) => handleGridInputChange(index, e)}
                            />
                          </div>
                          <div className="col-3">
                            <label
                              className="form-label"
                              htmlFor={`startDate-${index}`}
                            >
                              Start Job Date:
                            </label>
                            <input
                              className="form-control"
                              type="date"
                              id={`startDate-${index}`}
                              name={`startDate`}
                              value={grid.startDate}
                              onChange={(e) => handleGridInputChange(index, e)}
                            />
                          </div>
                          <div className="col-3">
                            <label
                              className="form-label"
                              htmlFor={`endDate-${index}`}
                            >
                              End Job Date:
                            </label>
                            <input
                              className="form-control"
                              type="date"
                              id={`endDate-${index}`}
                              name={`endDate`}
                              value={grid.endDate}
                              onChange={(e) => handleGridInputChange(index, e)}
                            />
                          </div>
                          {gridList.length > 0 && (
                            <div className="col-2 mt-1 d-flex justify-content-end">
                              <i
                                type="button"
                                className="fa-solid fa-xmark remove"
                                onClick={() => handleRemoveGrid(index)}
                              ></i>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-4">
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-primary me-2"
                        onClick={resetForm}
                      >
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
            </div>
          </TabPanel>
          <TabPanel header="AdditionalForm" >
          <div className="me-4">
  {fields.length > 0 && (
    <div className="col-12 mt-2 mx-3 mt-2 shadow-lg p-3">
      <div className="row">
        {fields.map((field, index) => {
          return (
            <div className="col-6 mt-2" key={index}>
              <label htmlFor={field.name} className="form-label">{field.name}</label>
              {field.type === "select" ? (
                <div className="d-flex justify-content-between mt-2">
                  <select
                    className="form-select"
                    value={company[field.name] || ""}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}>
                    <option value="null">Select</option>
                    {selectOptions[field.name] && selectOptions[field.name].map((option, optionIndex) => (
                      <option key={optionIndex} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="d-flex justify-content-between mt-2">
                  <input
                    type={field.type}
                    className="form-control"
                    placeholder={field.name}
                    value={company[field.name] || ""}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {fields.length > 0 && (
        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-warning " onClick={additionalDataSave}>Save</button>
        </div>
      )}
    </div>
  )}
</div>

          </TabPanel>
        </TabView>
      </main>
    </>
  );
}
export default UserForm;
