import { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import TopNabvar from '../topNavbar/topNavbar';
import './Activity.css'
import axiosInstance from "src/api/Axios";

function Activity() {
    const [activityLog, setActivityLog] = useState([]);

    // const [first, setFirst] = useState(1);
    // const [rows, setRows] = useState(5);
    // const [totalRecords, setTotalRecords] = useState(1);
    useEffect(() => {
        getAllLogs();
    }, [])

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
                <div className="table-container">
                    <table className="table table-striped p-3 shadow-sm" id="tableContent">
                        <thead className="">
                            <tr>
                                <th scope="col">Action By</th>
                                <th scope="col">Page</th>
                                <th scope="col">Action</th>
                                <th scope="col">Action On</th>
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
                                        <td>{elem.loginEmployeeId[0]}</td>
                                        <td>{elem.page}</td>
                                        <td>{elem.action}</td>
                                        <td>{elem.actionOnId[0]}</td>
                                        <td>{(elem.timeStamp.split("GMT")[0]).trim()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    )
}

export default Activity
