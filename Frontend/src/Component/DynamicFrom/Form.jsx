import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import Sidebar from "../sidebar/Sidebar";
import TopNabvar from "../topNavbar/topNavbar";
import { toast } from "react-toastify";
import axiosInstance from "src/api/Axios";
import ActiviyLog from "src/api/Activitylog";
import { addData } from "src/store/FormSlice";
import { useRef } from "react";


const Form = () => {
    const [visible, setVisible] = useState(false);
    const [fields, setFields] = useState([]);
    const [fieldName, setFieldName] = useState("");
    const [fieldType, setFieldType] = useState("");
    const [company, setCompany] = useState({});
    const [selectOptions, setSelectOptions] = useState({});
    const [newOption, setNewOption] = useState("");
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        companyName: "",
        email: "",
        email: "",
        companyAdditionalDetails: [],
        companyFieldsName: [],
        companyFieldsName: []
    });



    const handleAddOption = () => {
        if (newOption.trim() !== "") {
            const updatedOptionsMap = { ...selectOptions };
            updatedOptionsMap[fieldName] = [...(updatedOptionsMap[fieldName] || []), newOption.trim()];
            setSelectOptions(updatedOptionsMap);
            setNewOption("");
        }
    };

    const handleRemoveField = (fieldName, index) => {
        const updatedFields = [...fields];
        updatedFields.splice(index, 1);
        setFields(updatedFields);
    };

    const handleFieldChange = (fieldName, value) => {
        setCompany({ ...company, [fieldName]: value });
    };

    const handleSubmit = async () => {
        // try {
        //     const data = {
        //         companyName: formData.companyName,
        //         email: formData.email,
        //         companyFieldsName: [],
        //         email: formData.email,
        //         companyFieldsName: [],
        //         companyAdditionalDetails: fields.map(field => ({
        //             name: field.name,
        //             type: field.type,
        //             value: company[field.name] || null,
        //         })),
        //     };
        //     data.companyAdditionalDetails.forEach(elem => data.companyFieldsName.push(elem["name"]))

        //     const result = await axiosInstance.post("/companyData", data)
        //     if (result.status === 200) {
        //         ActiviyLog.page = window.location.href;
        //         ActiviyLog.action = "Company added";
        //         ActiviyLog.actionOnEmail = data.email
        //         ActiviyLog.dataType = "company"
        //         console.log(ActiviyLog);
        //         const comanyActivity = await axiosInstance.post("/activityLog", ActiviyLog);
        //     }
        handleReset();
        console.log("Comapny Activity", ActiviyLog);
        console.log("Comapny fields", fields);
        dispatch(addData(fields));
    }


    const handleReset = () => {
        setFields([]);
        setFieldName("");
        setFieldType("");
        setCompany({});
        setFormData({
            companyName: "",
            email: "",
            email: "",
            companyAdditionalDetails: [],
        });
        setSelectOptions("");
        setNewOption("");
    };

    useEffect(() => {
        if (visible === false) {
            setFieldName("");
            setFieldType("");
            setNewOption("");
        }
    }, [visible]);

    const handleAddRow = () => {
        if (fieldName && fieldType) {
            const existingFieldIndex = fields.findIndex(field => field.name === fieldName);
            if (existingFieldIndex !== -1) {
                const updatedFields = [...fields];
                updatedFields[existingFieldIndex] = { ...updatedFields[existingFieldIndex], type: fieldType };
                setFields(updatedFields);
            } else {
                const newField = { name: fieldName, type: fieldType };
                setFields([...fields, newField]);
            }
            setVisible(false);
            setFieldName("");
            setFieldType("");
        }
    };
    const handleRemoveOption = (fieldName, index) => {
        const updatedOptionsMap = { ...selectOptions };
        updatedOptionsMap[fieldName].splice(index, 1);
        setSelectOptions(updatedOptionsMap);
    };
    return (
        <>
            <Sidebar />
            <TopNabvar />
            <main>

                <div className="row mt-2 mx-3 mb-2">
                    <div className="col-11"></div>
                    <div className="col-1 d-flex justify-content-end">
                        <button className="btn btn-success" onClick={handleSubmit}>Save</button>
                    </div>
                </div>
                <form>
                    <div className="row mx-3 mt-2 shadow-lg p-3">
                        <h3 className="text-center">Make Dynamic Form</h3>
                        <div className="col-12 mt-2">
                            <div className="row">
                                {fields.map((field, index) => {
                                    return (
                                        <div className="col-6" key={index}>
                                            <label htmlFor={field.name} className="form-label">{field.name}</label>
                                            {field.type === "select" ? (
                                                <div className="d-flex justify-content-between">
                                                    <select
                                                        className="form-select"
                                                        value={company[field.name] || ""}
                                                        onChange={(e) => handleFieldChange(field.name, e.target.value)}>
                                                        <option value="null">Select</option>
                                                        {selectOptions[field.name] && selectOptions[field.name].map((option, optionIndex) => (
                                                            <option key={optionIndex} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                    <i className="bi bi-trash ms-1 fs-5 text-white pointer rounded-2" role="button" onClick={() => handleRemoveField(field.name, index)} style={{ backgroundColor: '#dc3545', padding: '4px 8px' }}></i>
                                                </div>
                                            ) : (
                                                <div className="d-flex justify-content-between">
                                                    <input
                                                        type={field.type}
                                                        className="form-control"
                                                        placeholder={field.name}
                                                        value={company[field.name] || ""}
                                                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                                    />


                                                    <i className="bi bi-trash ms-1 fs-5 text-white pointer rounded-2" role="button" onClick={() => handleRemoveField(field.name, index)}
                                                        style={{ backgroundColor: '#dc3545', padding: '4px 8px' }}></i>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mt-2">
                            <button type="button" className="btn btn-primary" onClick={() => setVisible(true)}>Add Row</button>
                            <Dialog header="Add New Field:" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                                <div className="m-0">
                                    <div className="row">
                                        <div className="col-12">
                                            <label className="form-label">Field Name</label>
                                            <input type="text" className="form-control" placeholder="Field Name" value={fieldName} onChange={(e) => setFieldName(e.target.value)} />
                                        </div>
                                        <div className="col-12 mt-2">
                                            <label className="form-label">Field Type</label>
                                            <select className="form-select" aria-label="Default select example" defaultValue="Choose..." onChange={(e) => setFieldType(e.target.value)}>
                                                <option value="Choose">Choose...</option>
                                                <option value="text">Text</option>
                                                <option value="number">Number</option>
                                                <option value="date">Date</option>
                                                <option value="textarea">TextArea</option>
                                                <option value="select">Select</option>
                                            </select>
                                            {fieldType === "select" && (
                                                <div className="mt-2">
                                                    <ul className="list-group mt-2">
                                                        {selectOptions[fieldName] && selectOptions[fieldName].map((option, index) => (
                                                            <li key={index} className="list-group-item d-flex justify-content-between">{option}
                                                                <i className="bi bi-x-lg" role="button" onClick={() => handleRemoveOption(fieldName, index)}></i>
                                                            </li>
                                                        ))}
                                                    </ul>

                                                    <div className="d-flex justify-content-between my-4">
                                                        <input type="text" className="form-control" placeholder="New Option" value={newOption} onChange={(e) => setNewOption(e.target.value)} />

                                                    </div>
                                                    <div>
                                                        <button className="btn btn-primary" role="button" onClick={handleAddOption}>Add Option</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-12 mt-2 d-flex justify-content-end mt-2">
                                            <button className="btn btn-success" onClick={handleAddRow}>Save</button>
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
