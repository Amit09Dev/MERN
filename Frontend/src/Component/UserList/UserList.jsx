import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faEye } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../api/Axios";
import TopNabvar from "../topNavbar/topNavbar";
import Sidebar from "../sidebar/Sidebar";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { PrimeReactProvider } from "primereact/api";
import { Paginator } from "primereact/paginator";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import "./UserList.css"



function UserData() {

  const [users, setUsers] = useState([]);
  const [first, setFirst] = useState(1);
  const [rows, setRows] = useState(5);
  const [totalRecords, setTotalRecords] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const animatedComponents = makeAnimated();
  const navigate = useNavigate();
  const [RoleList, setRoleList] = useState([]);


  const [inputValue, setInputValue] = useState({
    fullName: "",
    userRole: [],
    startDate: "",
    endDate: "",
  });

  const handleView = (id) => {
    navigate(`/View/${id}`);
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };


  const getData = async () => {
    const data = {
      page: Math.floor(first / rows + 1),
      pageSize: rows,
      ...inputValue
    };
    try {
      const result = await axiosInstance.get("/emp", {
        params: data,
      });
      console.log(result.data.data);
      setUsers(result.data.data);
      setTotalRecords(result.data.totalRecords);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.message && error.response.data.message.includes("jwt expired")) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    RoleData();
    getData();
  }, [first, rows]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInputValue({
      ...inputValue,
      [id]: value,
    });
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
      console.error("Error fetching role data:", error);
    }
  };
  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    const selectedValues = selectedOption
      ? selectedOption.map((option) => option.label)
      : [];
    setInputValue({
      ...inputValue,
      userRole: selectedValues,
    });
  };

  const SearchResults = async () => {
    if (
      inputValue.fullName === "" &&
      inputValue.userRole === "" &&
      inputValue.startDate === "" &&
      inputValue.endDate === ""
    ) {
      toast.warn("Enter Value to Search");
      return;
    } else {
      const data = {
        fullName: inputValue.fullName,
        page: Math.floor((first / rows + 1)),
        pageSize: rows,
        ...inputValue
      };
      try {
        const search = await axiosInstance.get("/emp", {
          params: data,
        });
        setUsers(search.data.data);
        setTotalRecords(search.data.totalRecords);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // const fetchData = async () => {
  //   const data = {
  //     fullName: inputValue.fullName,
  //     page: Math.floor((first / rows + 1)),
  //     pageSize: rows,
  //     ...inputValue
  //   };
  //   try {
  //     const response = await axiosInstance.get("/emp", {
  //       params: data,
  //     });
  //     console.log(response.data);
  //     setUsers(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const confirmDelete = (id) => {
    confirmDialog({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: () => deleteUser(id),
    });
  };

  const deleteUser = async (id) => {
    try {
      await axiosInstance.delete(`/emp/${id}`);
      getData();
      toast.success("Data delete Successfully");
      // await fetchData();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const getUserId = (id) => {
    navigate(`/userForm/${id}`);
  };

  function formatKey(key) {
    const words = key.replace(/_/g, ' ').split(/(?=[A-Z])/);
    return words.map(word => {
      return word ? word[0].toUpperCase() + word.slice(1) : word;
    }).join(' ');
  }

  return (
    <PrimeReactProvider value={{ unstyled: false }}>
      <TopNabvar />
      <Sidebar />
      <div className="MainContainer">
        <div className="container-fluid">
          <div className="row my-3">
            <div className="col-3">
              <input
                type="text"
                className="form-control"
                id="fullName"
                placeholder="Full Name"
                value={inputValue.fullName}
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
              <input
                type="date"
                className="form-control"
                id="startDate"
                value={inputValue.startDate}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
            <div className="col-2">
              <input
                type="date"
                className="form-control"
                id="endDate"
                value={inputValue.endDate}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
            <div className="col-2">
              <button
                type="button"
                className="btn btn-outline-primary w-100"
                onClick={SearchResults}
              >
                Search
              </button>
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
              <div className="col-4"></div>
            </div>
          </nav>
        </div>

        <div className="table-container">
          <table className="table table-striped p-3 shadow-sm" id="tableContent">
            <thead className="">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Address</th>
                <th scope="col">State</th>
                <th scope="col">City</th>
                <th scope="col">Company Name</th>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
                <th scope="col">Job Role</th>
                <th scope="col">User Role</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="12" className="fs-5 text-center">
                    No records found{" "}
                  </td>
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
                    <td>
                      {user.userRole.map((role, roleIndex) => (
                        <div key={roleIndex}>{formatKey(role)}</div>
                      ))}
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
                          onClick={() => confirmDelete(user._id)}
                        />
                        <Link to={`/view/${user._id}`}>
                          <FontAwesomeIcon
                            icon={faEye}
                            className="btn mr-2 me-2"
                            onClick={() => handleView(user._id)}
                          />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <ConfirmDialog />
        </div>
      </div>
      <div className="position-absolute bottom-0 start-50 translate-middle">
        <Paginator
          first={first}
          rows={rows}
          totalRecords={totalRecords}
          rowsPerPageOptions={[5, 10, 20]}
          onPageChange={onPageChange}
          template={{ layout: `PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown` }}
        />
      </div>
    </PrimeReactProvider>
  );
}

export default UserData;
