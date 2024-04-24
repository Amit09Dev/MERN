import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/Axios";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "../topNavbar/topNavbar";

const View = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/emp/${id}`);
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        if (id) fetchData();
        console.log(id);
    }, [id]);

    const renderUserRoles = () => {
        if (!userData?.userRole) return null;

        const userRolesStr = userData.userRole.map((role) => role.label).join(", ");
        return formatKey(userRolesStr)
    };

    const renderPastExperience = () => {
        if (!userData?.pastExperience) return null;

        return userData.pastExperience.map((experience, index) => (
            <div className="row mt-3" key={index}>
                <div className="col-4">
                    <InputField label="Company" value={experience.companyName || ""} />
                </div>
                <div className="col-4">
                    <InputField label="Start Date" value={experience.startDate || ""} />
                </div>
                <div className="col-4">
                    <InputField label="End Date" value={experience.endDate || ""} />
                </div>
            </div>
        ));
    };



    function formatKey(key) {
        const words = key.replace(/_/g, ' ').split(/(?=[A-Z])/);
        return words.map(word => {
            return word ? word[0].toUpperCase() + word.slice(1) : word;
        }).join(' ');
    }

    return (
        <>
            <Sidebar />
            <TopNavbar />
            <main className="mt-1">
                <div className="container-fluid shadow-white-bg p-4 shadow">
                    <p className="fw-bold">User Details</p>
                    <hr />
                    <div className="row">
                        <div className="col-6">
                            <div className="row">
                                <InputField label="First Name" value={userData?.firstName || ""} />
                                <InputField label="Email" value={userData?.email || ""} />
                                <InputField label="State" value={userData?.state || ""} />
                                <InputField label="City" value={userData?.city || ""} />
                                <InputField label="Job Role" value={userData?.jobRole || ""} />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="row">
                                <InputField label="Last Name" value={userData?.lastName || ""} />
                                <InputField label="User Role" value={renderUserRoles()} />
                                <InputField label="Zip Code" value={userData?.zip || ""} />
                                <InputField label="Address" value={userData?.address || ""} />
                            </div>
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col-12">
                            <p className="fw-bold">Past Experience</p>
                            <hr />
                            {renderPastExperience()}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

const InputField = ({ label, value }) => (
    <div className="row my-2 align-items-center">
        <div className="col-4">
            <b>{label}:</b>
        </div>
        <div className="col-8 mt-1">
            <input type="text" className="form-control" value={value} readOnly />
        </div>
    </div>
);

export default View;
