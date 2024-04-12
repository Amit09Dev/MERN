import './Signup.css';
import { Link } from "react-router-dom"
import { useState,useEffect } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/Axios";

function Signup() {
    const navigate = useNavigate();
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

  useEffect(()=>{
    clearToken();
  },[])
    const clearToken = () => {
        if (localStorage.getItem("token")) {
            localStorage.removeItem("token");
        }
    }
    const verifyRegister = async () => {
        const result = validateInput(inputValue);
        try {
            const signup = await axiosInstance.post("/register", inputValue);
            if(signup.status === 200) {
                toast.success("Registered Succesfully")
                navigate("/login");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message);
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
        return errors;
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