import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Sidebar from '../sidebar/Sidebar';
import TopNabvar from '../topNavbar/topNavbar';
import './Activity.css'
import axiosInstance from "src/api/Axios";
import { Paginator } from "primereact/paginator";


function Activity() {
    const [activityLog, setActivityLog] = useState([]);
    const [first, setFirst] = useState(1);
    const [rows, setRows] = useState(5);
    const [totalRecords, setTotalRecords] = useState(1);
    const [searchValue, setSearchValue] = useState({
        actionOn: "",
        action: "",
        startDate: "",
        endDate: "",
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setSearchValue({
            ...searchValue,
            [id]: value,
        });
    }
    const SearchResults = () => {
        console.log(searchValue);
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
            const result = await axiosInstance.get("/allLogs", {
                params: data,
            });
            console.log(result);
            setActivityLog(result.data.data);
            setTotalRecords(result.data.totalRecords);
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data.includes("jwt expired")) {
                navigate("/login");
            }
        }
    };

    useEffect(() => {
        getData();
    }, [first, rows]);

    const getAllLogs = async () => {
        try {
            let result = await axiosInstance.get("/allLogs")
            console.log(result.data);
            setActivityLog(result.data);
        }
        catch (error) {
            console.log(error);
        }
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
                                <th scope="col">Page</th>
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
                                        <td>{elem.actionOnId}</td>
                                        <td>{elem.page}</td>
                                        <td>{elem.action}</td>
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
