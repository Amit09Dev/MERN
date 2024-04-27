import { React, useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import Sidebar from '../sidebar/Sidebar';
import TopNabvar from '../topNavbar/topNavbar';
import axiosInstance from "src/api/Axios";
import { Paginator } from "primereact/paginator";
import { Dialog } from 'primereact/dialog';
import './Activity.css'

function Activity() {
    const [activityLog, setActivityLog] = useState([]);
    const [first, setFirst] = useState(1);
    const [rows, setRows] = useState(5);
    const [totalRecords, setTotalRecords] = useState(1);
    const [visible, setVisible] = useState(Array(activityLog.length).fill(false));
    const [RoleList, setRoleList] = useState([]);
    let pastExperienceCount = 0;
    const [searchValue, setSearchValue] = useState({
        actionOn: "",
        action: "",
        startDate: "",
        endDate: "",
    });
    const handleDialogVisibility = (index, visibility) => {
        const updatedVisible = [...visible];
        updatedVisible[index] = visibility;
        setVisible(updatedVisible);
    }
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setSearchValue({
            ...searchValue,
            [id]: value,
        });
    }
    const SearchResults = async() => {
        const data = {
            page: Math.floor(first / rows + 1),
            pageSize: rows,
            ...searchValue
        };
        console.log(data);
    try {
       const res= await axiosInstance.get("/allLogs",{
        params:data
       });
       setActivityLog(res.data.data);
       setTotalRecords(res.data.totalRecords);  

       
    } catch (error) {
        console.log(error);
    }

    }


    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };
    const navigate = useNavigate();


    const getData = async () => {
        const data = {
            page: Math.floor(first / rows + 1),
            pageSize: rows
        };
        try {
            const result = await axiosInstance.get("/allLogs", { params: data, });
            setActivityLog(result.data.data);
            result.data.totalRecords ? setTotalRecords(result.data.totalRecords) : setTotalRecords(1)
        } catch (error) {
            if (error.response && error.response.data.includes("jwt expired")) {
                navigate("/login");
            }
            else {
                console.log(error);
            }
        }
    };

    const RoleData = async () => {
        try {
            const response = await axiosInstance.get("/role");
            const formattedRoles = response.data.map((role) => ({
                [role._id]: role.role,
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
        RoleData()
        getData();
    }, [first, rows]);



    function generateEditData(data) {
        // console.log(data);
        const tableRows = data.map((entry) => {
            const pathParts = entry.path.split(".");
            const fieldName = formatKey(pathParts.pop());

            if (entry.path === "root.userRole") {
                return handleUserRole(entry);
            } else if (entry.path.startsWith("root.pastExperience")) {
                return handlePastExperience(entry);
            } else if (entry.path.startsWith("root.additionalInfo")) {
                return handleAdditionalInfo(entry);
            }
            else {
                return (
                    <tr key={entry.path}>
                        <td>{fieldName}</td>
                        <td>{entry.oldVal || "-"}</td>
                        <td>{entry.newVal || "-"}</td>
                    </tr>
                );
            }
        }).flat();

        return (
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Values</th>
                        <th>From</th>
                        <th>To</th>
                    </tr>
                </thead>
                <tbody>{tableRows}</tbody>
            </table>
        );
    }

    function handleUserRole(entry) {
        const oldRoles = entry.oldVal.map(roleId => RoleList.find(obj => obj[roleId])?.[roleId] || "Role not found").join(", ");
        const newRoles = entry.newVal.map(roleId => RoleList.find(obj => obj[roleId])?.[roleId] || "Role not found").join(", ");
        const pathParts = entry.path.split(".");
        const fieldName = formatKey(pathParts.pop());
        return (
            <tr key={entry.path}>
                <td>{fieldName}</td>
                <td>{oldRoles}</td>
                <td>{newRoles}</td>
            </tr>
        );
    }

    function extractNumber(string) {
        const match = string.match(/\d+/g);
        if (match) {
            return match[0];
        } else {
            return null;
        }
    }

    function handlePastExperience(entry) {
        const pathParts = entry.path.split(".");
        const fieldName = formatKey(pathParts.pop());
        return (
            <tr key={entry.path}>
                <td>{`${fieldName} ( ${Number(extractNumber(entry.path)) + 1} )`} </td>
                <td>{entry.oldVal || '-'}</td>
                <td>{entry.newVal || '-'}</td>
            </tr>
        );
    }


    function handleAdditionalInfo(entry) {
        const pathParts = entry.path.split(".");
        const fieldName = pathParts.pop();

        if (entry.note === "Deleted") {
            return (
                <tr key={entry.path}>
                    <td>{fieldName}</td>
                    <td colSpan={2} style={{ color: "red" }}>Deleted</td>
                </tr>
            );
        } else if (entry.note === "Added") {
            if (typeof entry.newVal === 'object' && entry.newVal !== null) {
                const properties = Object.entries(entry.newVal)
                    .filter(([key, value]) => value !== null)
                    .map(([key, value]) => (
                        <tr key={key}>
                            <td>{key}</td>
                            <td> - </td>
                            <td style={{ color: "green" }}>{value}</td>
                        </tr>
                    ));
                return properties.length > 0 ? properties : null;
            } else {
                return (
                    <tr key={entry.path}>
                        <td>{fieldName}</td>
                        <td> - </td>
                        <td style={{ color: "green" }}>{entry.newVal}</td>
                    </tr>
                );
            }
        } else {
            return (
                <tr key={entry.path}>
                    <td>{fieldName}</td>
                    <td>{entry.oldVal || '-'}</td>
                    <td>{entry.newVal || '-'}</td>
                </tr>
            );
        }
    }



    function formatKey(key) {
        const words = key.replace(/_/g, ' ').split(/(?=[A-Z])/);
        return words.map(word => {
            return word ? word[0].toUpperCase() + word.slice(1) : word;
        }).join(' ');
    }


    return (
        <>
            <Sidebar />
            <TopNabvar />
            <main>
                <div className="table-container-activity p-2">
                    <div className="container-fluid">
                        <div className="row my-3">
                            <div className="col-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="actionOn"
                                    placeholder="Action on"
                                    value={searchValue.actionOn}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="action"
                                    placeholder="Action"
                                    value={searchValue.action}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-2">
                                <input
                                    type="date"
                                    className="form-control"
                                    id="startDate"
                                    value={searchValue.startDate}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                            <div className="col-2">
                                <input
                                    type="date"
                                    className="form-control"
                                    id="endDate"
                                    value={searchValue.endDate}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                            <div className="col-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary w-100"
                                    onClick={SearchResults}>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                    <table className="table table-striped p-3 shadow-sm" id="tableContent">
                        <thead className="">
                            <tr>
                                <th scope="col">Action On</th>
                                <th scope="col">Action</th>
                                <th scope="col">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activityLog.length === 0 ? (
                                <tr>
                                    <td colSpan="12" className="fs-5 text-center">
                                        No records found{" "}
                                    </td>
                                </tr>
                            ) : (
                                activityLog.map((elem, index) => (
                                    <tr key={index}>
                                        <td>{elem.actionOnEmail}</td>

                                        <td>
                                            {elem.action === "Employe Edited" ? (
                                                <>
                                                    <div className='d-flex align-items-center'>
                                                        <p className='m-0'>Employe Edited </p>
                                                        <i className="bi bi-box-arrow-up-right cursor-pointer ms-2 text-white py-1 px-2 rounded-2"
                                                            style={{ backgroundColor: "#06b6d4", fontSize: "14px" }}
                                                            role='button'
                                                            onClick={() => handleDialogVisibility(index, true)}></i>
                                                    </div>
                                                    <Dialog key={index} header="User Edited" visible={visible[index]} style={{ width: '50vw' }} onHide={() => handleDialogVisibility(index, false)}>
                                                        {generateEditData(elem.data)}
                                                    </Dialog>
                                                </>
                                            ) : elem.action === "Employe Added" ? (
                                                <>
                                                    <div className='d-flex align-items-center'>
                                                        <p className='m-0'>Employe Added </p>
                                                        <Link to={`/view/${elem.actionOnId}`}>
                                                            <i className="bi bi-eye cursor-pointer ms-2 text-white py-1 px-2 rounded-2"
                                                                style={{ backgroundColor: "#06b6d4", fontSize: "14px" }}></i>
                                                        </Link>
                                                    </div>
                                                </>
                                            ) : (
                                                <p>{elem.action}</p>
                                            )}
                                        </td>
                                        <td>{(elem.timeStamp.split("GMT")[0]).trim()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                    <Paginator
                        className='position-absolute bottom-0 start-50 translate-middle'
                        first={first}
                        rows={rows}
                        totalRecords={totalRecords}
                        rowsPerPageOptions={[5, 10, 20]}
                        onPageChange={onPageChange}
                        template={{ layout: `PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown` }}
                    />
                </div>
            </main>
        </>
    )
}

export default Activity
