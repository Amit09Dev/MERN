import React from "react";
import { Link } from "react-router-dom";

function TopNabvar() {
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
            <Link to="/" className="btn btn-outline-success btn-sm">
              <i className="fas fa-sign-out-alt fa-fw me-3"></i>
              <span className="d-none d-md-inline">Sign Out</span>
            </Link>
          </li>
        </div>
      </nav>
    </>
  );
}
export default TopNabvar;
