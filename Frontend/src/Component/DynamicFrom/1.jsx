import { useState, useCallback } from "react";
import { Dialog } from 'primereact/dialog';
import Sidebar from "../sidebar/Sidebar";
import TopNabvar from "../topNavbar/topNavbar";
import { toast } from "react-toastify";
import axiosInstance from "src/api/Axios";

const Form = () => {

    const [visible, setVisible] = useState(false);
    const [fields, setFields] = useState([]);
    const [fieldName, setFieldName] = useState("");
    const [fieldType, setFieldType] = useState("");
    const [company, setCompany] = useState({});
    const [formData, setFormData] = useState({
        companyName: "",
        companyEmail: "",
        companyAdditionalDetails: [],
    });

    const handleAddRow = () => {
        if (fieldName && fieldType) {
            const newField = { name: fieldName, type: fieldType };
            setFields([...fields, newField]);
            setVisible(false);
            setFieldName("");
            setFieldType("");
        }
    };

    const handleRemoveField = (index) => {
        const updatedFields = [...fields];
        updatedFields.splice(index, 1);
        setFields(updatedFields);
    };

    const handleFieldChange = (fieldName, value) => {
        setCompany({ ...company, [fieldName]: value });
    };

    useCallback(() => {
    }, [fields, company])

    const handleSubmit = async () => {
        try {
            const data = {
                companyName: formData.companyName,
                companyEmail: formData.companyEmail,
                companyAdditionalDetails: fields.map(field => ({
                    name: field.name,
                    type: field.type,
                    value: company[field.name] || "",
                })),
            };
            console.log(data);
            await axiosInstance.post("/companyData", data)
            handleReset();
        } catch (error) {
            console.log(error);
        }
    };

    const handleReset = () => {
        setFields([]);
        setFieldName("");
        setFieldType("");
        setCompany({});
        setFormData({
            companyName: "",
            companyEmail: "",
            companyAdditionalDetails: [],
        });
    };

    return (
        <>
            <Sidebar />
            <TopNabvar />
            <main>
                <div className="d-flex justify-content-end me-3">
                    <button className="btn btn-success" onClick={handleSubmit}>Save</button>
                </div>
                <form>
                    <div className="row mx-3 mt-2 shadow-lg p-3">
                        <div className="col-6">
                            <label htmlFor="fullName" className="form-label">
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
                            <label htmlFor="email" className="form-label">
                                Company Email
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="email"
                                value={formData.companyEmail}
                                onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                                placeholder="Company Email"
                            />
                        </div>
                        <div className="col-12 mt-2">
                            <div className="row">
                                {fields.map((field, index) => {
                                    return (
                                        <div className="col-6" key={index}>
                                            <label htmlFor={field.name} className="form-label">{field.name}</label>
                                            <div className="input-group">
                                                <input
                                                    type={field.type}
                                                    className="form-control"
                                                    placeholder={field.name}
                                                    value={company[field.name] || ""}
                                                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                                />
                                                <i className="bi bi-trash ms-1 pointer text-white fs-5 removeField" role="button"
                                                    style={{ backgroundColor: '#e12638', padding: '3px 6px' }} onClick={() => handleRemoveField(index)}></i>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-2">
                            <button type="button" className="btn btn-primary" onClick={() => setVisible(true)}>Add Row</button>
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
                                                <option value="Choose">Choose...</option>
                                                <option value="text">Text</option>
                                                <option value="number">Number</option>
                                                <option value="date">Date</option>
                                                <option value="textarea">TextArea</option>
                                            </select>
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
