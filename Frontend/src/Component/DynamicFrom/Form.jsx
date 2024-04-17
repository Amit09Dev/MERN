import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Sidebar from "../sidebar/Sidebar";
import TopNabvar from "../topNavbar/topNavbar";
import { toast } from "react-toastify";

const Form = () => {
    
    const [visible, setVisible] = useState(false);
    const [fields, setFields] = useState([]);
    const [fieldName, setFieldName] = useState("");
    const [fieldType, setFieldType] = useState("");
    const [formData, setFormData] = useState({
        companyName: "",
        companyEmail: "",
        companyAdditionalDetails:[]
        
    });
    const handleAddRow = () => {
        if (fieldName && fieldType) {
            const newField = { name: fieldName, type: fieldType };
            setFields([...fields, newField]);
            setVisible(false);
            setFieldName("");
            setFieldType(""); 
        }
    }
    const handleSubmit = () => {
        setFormData({
            companyName: "",
            companyEmail: "",
            ...fields.reduce((acc, field) => {
                acc[field.name] = ""; 
                return acc;
            }, {})
        });
        setFieldName("");
        setFieldType(""); 
        setFields([])
        console.log("form Data",formData);
        toast.success("Data Add Successfully")
    }
    
    return (
        <>
            <Sidebar />
            <TopNabvar />
            <main>
                <div className="row mt-2 mx-3 mb-2">
                  <div className="col-11"></div>
                  <div className="col-1 d-flex justify-content-end">
                    <button className="btn btn-success" onClick={handleSubmit} >Save</button>
                  </div>
                </div>
                <form >
                    <div className="row mx-3 mt-2 shadow-lg p-3">
                        <div className="col-6">
                            <label htmlFor="FName" className="form-label">
                                Company Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="fullName"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                placeholder="Company Name"
                            />
                        </div>
                        <div className="col-6">
                            <label htmlFor="FName" className="form-label">
                                Company Email
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="email"
                                value={formData.companyEmail}
                                onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                                placeholder="Company Email" />
                        </div>
                        <div className="col-12 mt-2">
                    <div className="row">
                        {fields.map((field, index) => {
                            return (
                                <div className="col-6" key={index}>
                                    <label htmlFor={field.name} className="form-label">{field.name}</label>
                                    <input 
                                        type={field.type} 
                                        className="form-control" 
                                        placeholder={field.name} 
                                        value={formData[field.name]} 
                                        onChange={(e) => {
                                            const updatedFormData = { ...formData, [field.name]: e.target.value };
                                          setFormData(updatedFormData)
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                        <div className="d-flex justify-content-end mt-2">
                            <button type="button" className="btn btn-primary"   onClick={() => setVisible(true)} >Add Row</button>
                            <Dialog visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                                <div className="m-0">
                                    <div className="row">
                                        <div className="col-12">
                                            <label className="form-label">
                                                Field Name
                                            </label>
                                            <input type="text" className="form-control" placeholder="Field Name" value={fieldName} onChange={(e) => setFieldName(e.target.value)} />
                                        </div>
                                        <div className="col-12 mt-2">
                                            <label className="form-label">
                                                Field Type
                                            </label>
                                            <select className="form-select" aria-label="Default select example" defaultValue="Choose..." onChange={(e) => setFieldType(e.target.value)}>
                                                <option  value="Choose">Choose...</option>
                                                <option value="text">Text</option>
                                                <option value="number">Number</option>
                                                <option value="date">Date</option>
                                                <option value="textarea">TextArea</option>
                                            </select>
                                        </div>
                                        <div className="col-12 mt-2 d-flex justify-content-end mt-2">
                                            <button  className="btn btn-success" onClick={handleAddRow}>Save</button>
                                        </div>
                                    </div>
                                </div>
                            </Dialog>
                        </div>
                    </div>
                </form>
            </main>
        </>
    )
}

export default Form;
