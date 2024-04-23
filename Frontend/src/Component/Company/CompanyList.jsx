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
          <table className="table table-striped p-3 shadow-sm" id="tableContent">
            <thead className="">
              <tr>
                <th scope="col">Company Name</th>
                <th scope="col">Email</th>
                {tablehader.map((header, index) => (
                  <th key={index} scope="col">{header.fieldName}</th>
                ))}
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {company.map((companyItem) => (
                <tr key={companyItem._id}>
                  <td>{companyItem.companyName}</td>
                  <td>{companyItem.email}</td>
                  {tablehader.map((header) => (
                    <td key={header._id}>
                      {companyItem.companyAdditionalDetails.find(detail => detail.name === header.fieldName)?.value}
                    </td>
                  ))}
                  <td>
                    <div>
                      <FontAwesomeIcon icon={faEdit} className="btn mr-2 me-2" />
                      <FontAwesomeIcon icon={faTrashAlt} className="btn" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default CompanyList;
