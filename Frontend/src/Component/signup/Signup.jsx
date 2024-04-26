import './Signup.css';
import { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/Axios";
import { useFormik } from "formik";
import { SignUp } from './SignUpSchema';
function Signup() {
    const navigate = useNavigate();
    const initialValues = {
        email: "",
        password: "",
        confirmpassword: "",
    };
    const { values, errors, touched, handleBlur, handleSubmit, handleChange } = useFormik({
        initialValues: initialValues,
        validationSchema: SignUp,
        onSubmit: async (values, action) => {
            try {
                const result = await axiosInstance.post("/register", values)
                console.log(result.data);
                toast.success("Registered Successfully")
                navigate("/login")

            } catch (error) {
                toast.error(error.response.data.message);
                console.log(error);
            }
            action.resetForm();
        },
    });


    const clearToken = () => {
        localStorage.clear();
    }

    useEffect(() => {
        clearToken();
    }, [])



    return (
        <div className="container-fluid SignupContainer vh-100 d-flex justify-content-center  align-items-center">
            <div className="row bg-white formRow">
                <div className="col-6">
                    <h4 className='text-center signupText'>Signup</h4>
                    <form className="d-flex h-75 align-items-center" onSubmit={handleSubmit}>
                        <div className="signupDetails w-100 ps-3">
                            <div className="form-floating mb-3 mt-5">
                                <input type="email" className="form-control w-100" id="email" mailto:placeholder="name@example.com"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur} />
                                <label forhtml="email">Email address</label>
                                {errors.email && touched.email ? <p className="form-error">{errors.email}</p> : null}
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="password" placeholder="Password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur} />
                                <label forhtml="password">Password</label>
                                {errors.password && touched.password ? <p className="form-error">{errors.password}</p> : null}
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="confirmpassword" placeholder="Confirm Password"
                                    value={values.confirmpassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur} />
                                <label forhtml="confirmPassword">Confirm Password</label>
                                {errors.confirmpassword && touched.confirmpassword ? <p className="form-error">{errors.confirmpassword}</p> : null}
                            </div>
                            <button type='submit' className='btn btn-primary w-100 submitBtn'>Submit</button>
                            <p className='text-center mt-3 loginText'> Already a user? <Link to="/Login">Login</Link> </p>
                        </div>
                    </form>
                </div>
                <div className="col-6">
                    <img src="/img/signup.jpg" alt="Sign Up" />
                </div>
            </div>
        </div>
    )
}

export default Signup;