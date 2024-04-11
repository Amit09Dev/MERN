import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function TopNabvar() {
  const navigate = useNavigate();
  const signout = () => {
    localStorage.setItem("token", "");
    navigate("/login")
    toast.success("User Logged out");
  }

  return (
    <>
      <nav className="navbar bg-body-tertiary shadow-sm topNav">
        <div className="container-fluid">
          <form className="" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            ></input>
          </form>
          <li>
            <button type="button" onClick={signout} className="btn btn-outline-success btn-sm">
              <i className="fas fa-sign-out-alt fa-fw me-3"></i>
              <span className="d-none d-md-inline">Sign Out</span>
            </button>
          </li>
        </div>
      </nav>
    </>
  );
}
export default TopNabvar;
