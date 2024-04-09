import React, { useState } from 'react';

function AddGrid({handleGridDataChange }) {
    const [gridData, setGridData] = useState({
        companyName: '',
        startDate: '',
        endDate: '',
    });
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setGridData(prevState => ({
            ...prevState,
            [name]: value
        }));
        handleGridDataChange(gridData);
        console.log(gridData);
    };
    return (
        <div className='row'>
                <div className="col-4">
                    <label className='form-label' htmlFor="companyName">Company Name:</label>
                    <input
                        className='form-control'
                        type="text"
                        id="companyName"
                        name="companyName"
                        placeholder='Enter Company name'
                        value={gridData.companyName}
                        onChange={onInputChange}
                    />
                </div>
                <div className="col-4">
                    <label className='form-label' htmlFor="startDate">Start Job Date:</label>
                    <input
                        className='form-control'
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={gridData.startDate}
                        onChange={onInputChange}
                    />
                </div>
                <div className="col-4">
                    <label className='form-label' htmlFor="endDate">End Job Date:</label>
                    <input
                        className='form-control'
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={gridData.endDate}
                        onChange={onInputChange}
                    />
                </div>
        </div>
    );
}

export default AddGrid;
