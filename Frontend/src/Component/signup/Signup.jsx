import './Signup.css';
import { Link } from "react-router-dom"
import { useState } from 'react';
import axios from "axios";

function Signup() {
    const baseUrl = "http://localhost:8000/api"
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setInputValue({
            ...inputValue,
            [id]: value,
        });
        setError({})
    };

    const verifyRegister = async () => {
        const result = validateInput(inputValue);
        console.log(inputValue)
        try {
            const signup = await axios.post(`${baseUrl}/register`, inputValue);
            console.log(signup);
        } catch (error) {
            console.error("Error:", error);
        }

    }

    const validateInput = (data) => {
        const errors = {};

        if ((data.email).trim() === "") {
            errors.email = "Email Address is required";
        }
        else if (data.email && !isValidEmail(data.email)) {
            errors.email = "Invalid email address";
        }

        if ((data.password).trim() === "") {
            errors.password = "Password is required"
        }

        if ((data.confirmPassword).trim() !== data.password) {
            errors.confirmPassword = "Confrim password and Password is not same"
        }
        setError(errors);
    }

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    return (
        <div className="container-fluid SignupContainer vh-100 d-flex justify-content-center  align-items-center">
            <div className="row bg-white formRow">
                <div className="col-6">
                    <h4 className='text-center signupText'>Signup</h4>
                    <div className="d-flex h-75 align-items-center">
                        <div className="signupDetails w-100 ps-3">
                            <div className="form-floating mb-3 mt-5">
                                <input type="email" className="form-control w-100" id="email" placeholder="name@example.com"
                                    value={inputValue.email}
                                    onChange={handleInputChange} />
                                <label forhtml="email">Email address</label>
                                {error.email && (<span className="error">{error.email}</span>)}
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="password" placeholder="Password"
                                    value={inputValue.password}
                                    onChange={handleInputChange} />
                                <label forhtml="password">Password</label>
                                {error.password && (<span className="error">{error.password}</span>)}
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm Password"
                                    value={inputValue.confirmPassword}
                                    onChange={handleInputChange} />
                                <label forhtml="confirmPassword">Confirm Password</label>
                                {error.confirmPassword && (<span className="error">{error.confirmPassword}</span>)}
                            </div>
                            <button className='btn btn-primary w-100 submitBtn' onClick={verifyRegister}>Submit</button>
                            <p className='text-center mt-3 loginText'> Already a user? <Link to="/Login">Login</Link> </p>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <img src="/img/signup.jpg" alt="Sign Up" />
                </div>
            </div>
        </div>
    )
}

export default Signup;