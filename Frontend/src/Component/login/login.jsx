import React from 'react';
import '../signup/Signup.css';
import { Link } from "react-router-dom"
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

//import { toast } from "react-toastify"
const LoginForm = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: ""
  })

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInputValue({
      ...inputValue,
      [id]: value,
    });
    setError((old) => {
      return { ...old, [id]: "" }
    });
  };

  const verifyLogin = async () => {
    const result = validateInput(inputValue);

    try {
      const res = await axios.post("http://localhost:8000/api/login", inputValue)
      localStorage.setItem("token", JSON.stringify(res.data))
      if(localStorage.getItem("token")){
        navigate("/UserForm");
      }
      
    }
    catch (error) {
      console.log(error);
      //toast.warn(error.data.message);
    }

    console.log(result);
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
    setError(errors);
  }


  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="container-fluid SignupContainer vh-100 d-flex justify-content-center  align-items-center">
      <div className="row bg-white formRow">
        <div className="col-6">
          <h4 className='text-center signupText'>Login</h4>
          <div className="d-flex h-75 align-items-center">
            <div className="signupDetails w-100">
              <div className='ps-3'>
                <div className="mb-3">
                  <label forhtml="email" className="form-label">Email Address:</label>
                  <input type="email" className="form-control" id="email" placeholder="name@example.com"
                    value={inputValue.email}
                    onChange={handleInputChange} />
                  {error.email && (<span className="error">{error.email}</span>)}
                </div>
                <div className="mb-3">
                  <label forhtml="password" className="form-label">Password:</label>
                  <input type="password" className="form-control" id="password"
                    value={inputValue.password}
                    onChange={handleInputChange} />
                  {error.password && (<span className="error">{error.password}</span>)}
                </div>
                <button className='btn btn-primary submitBtn w-100' onClick={verifyLogin}>Submit</button>
              </div>
              <p className='text-center mt-3 loginText'> Don't have Account? <Link to="/Signup">Register</Link> </p>
            </div>
          </div>
        </div>
        <div className="col-6">
          <img src="/img/login.jpg" alt="Sign Up" />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
