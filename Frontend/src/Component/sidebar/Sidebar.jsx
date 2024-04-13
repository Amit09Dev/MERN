import React from "react";
import "./sidebar.css"
import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <nav className="text-white h-100 custom-nav border-end p-0 px-lg-2 d-none d-lg-block position-fixed top-0 sidebar">
            <div className="row">
                <img src="https://reactjs.org/logo-og.png" alt="React Logo" />
            </div>
            <ul className="list-unstyled mt-3 px-2">
                <li className="d-flex align-items-center my-2">
                    <i className="bi bi-person-check-fill me-2"></i>
                    <Link to="/userform">DashBoard</Link>
                    <i className="fa-angle-right fa ms-auto fa-xs fa me-2"></i>

                </li>
                <li className="d-flex align-items-center my-2">
                    <i className="bi bi-person-check-fill me-2"></i>
                    <Link to="/userlist">User List</Link>
                    <i className="fa-angle-right fa ms-auto fa-xs fa me-2"></i>
                </li>
                <li className="d-flex align-items-center my-2">
                    <i className="bi bi-layout-split me-2"></i>
                    <Link >Pages</Link>
                    <i className="fa-angle-right fa ms-auto fa-xs fa me-2"></i>
                </li>
                <li className="d-flex align-items-center my-2">
                    <i className="bi bi-shield-check me-2"></i>
                    <Link  >Authentications</Link>
                    <i className="fa-angle-right fa ms-auto fa-xs fa me-2"></i>
                </li>
                <li className="d-flex align-items-center my-2">
                    <i className="bi bi-layout-text-window me-2"></i>
                    <Link  >Wizard Examples</Link>
                    <i className="fa-angle-right fa ms-auto fa-xs fa me-2"></i>
                </li>
                <li className="d-flex align-items-center my-2">
                    <i className="bi bi-box-arrow-in-down me-2"></i>
                    <Link >Modal Examples</Link>
                </li>
                <li className="d-flex align-items-center my-2">
                    <i className="bi bi-card-heading me-2"></i>
                    <Link  >Cards</Link>
                    <i className="fa-angle-right fa ms-auto fa-xs fa me-2"></i>
                </li>
                <li className="d-flex align-items-center my-2">
                    <i className="bi bi-archive me-2"></i>
                    <Link  >User Interface</Link>
                    <i className="fa-angle-right fa ms-auto fa-xs fa me-2"></i>
                </li>
                <li className="d-flex align-items-center my-2">
                    <i className="bi bi-archive me-2"></i>
                    <Link  >Extended UI</Link>
                    <i className="fa-angle-right fa ms-auto fa-xs fa me-2"></i>
                </li>
                <li className="d-flex align-items-center my-2">
                    <i className="bi bi-layout-text-sidebar me-2"></i>
                    <Link  >Icons</Link>
                    <i className="fa-angle-right fa ms-auto fa-xs fa me-2"></i>
                </li>
                <li className="d-flex align-items-center my-2">
                    <i className="bi bi-archive me-2"></i>
                    <Link  >Forms Elements</Link>
                    <i className="fa-angle-right fa ms-auto fa-xs fa me-2"></i>
                </li>
                <li className="d-flex align-items-center my-2">
                    <i className="bi bi-file-text me-2"></i>
                    <Link  >Form Layouts</Link>
                    <i className="fa-angle-right fa ms-auto fa-xs fa me-2"></i>
                </li>
                <li className="d-flex align-items-center my-2">
                    <i className="bi bi-layout-text-sidebar me-2"></i>
                    <Link  >Form Wizard</Link>
                    <i className="fa-angle-right fa ms-auto fa-xs fa me-2"></i>
                </li>
                <li className="d-flex align-items-center my-2">
                    <i className="bi bi-pencil-square me-2"></i>
                    <Link  >Form Validation</Link>
                    <i className="fa-angle-right fa ms-auto fa-xs fa me-2"></i>
                </li>
                <li className="d-flex align-items-center my-2">
                    <i className="bi bi-table me-2"></i>
                    <Link  >Tables</Link>
                    <i className="fa-angle-right fa ms-auto fa-xs fa me-2"></i>
                </li>
                <li className="d-flex align-items-center my-2">
                    <i className="bi bi-grid-3x3 me-2"></i>
                    <Link  >Datatables</Link>
                    <i className="fa-angle-right fa ms-auto fa-xs fa me-2"></i>
                </li>
                <li className="d-flex align-items-center my-2">
                    <i className="bi bi-graph-up me-2"></i>
                    <Link  >Charts</Link>
                    <i className="fa-angle-right fa ms-auto fa-xs fa me-2"></i>
                </li>
            </ul>
        </nav>

    )
}

export default Sidebar;
