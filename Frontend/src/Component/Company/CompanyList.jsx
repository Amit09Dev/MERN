import React, { useState, useEffect } from "react";
import TopNavbar from "../topNavbar/topNavbar";
import Sidebar from "../sidebar/Sidebar";
import axiosInstance from "../../api/Axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
const CompanyList = () => {
  const [company, setCompany] = useState([]);
  const [tablehader, setTableHader] = useState([]);
  const getCompanyList = async () => {
    try {
      const result = await axiosInstance.get("/showCompanyData");
      setCompany(result.data.company);
      setTableHader(result.data.companyField);
      // console.log("tableheader", result.data.companyField)
      // console.log("company", result.data.company)
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCompanyList();
  }, []);

  return (
    <>
      <TopNavbar />
      <Sidebar />
      <main>
        <div className="table-container">
     
        </div>
      </main>
    </>
  );
};

export default CompanyList;
