import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { usersActions } from "../store/usersReducer";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { useState, useEffect } from "react";
import { dashboardActions } from "../store/dashboardReducer";
import { paginationActions } from "../store/paginationReducer";

const Sidebar = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const jwtToken = useSelector((state) => state.users.token);
    const [jwtTokenDecoded, setJwtTokenDecoded] = useState(jwtToken);

    const logOut = () => {
        dispatch(usersActions.logout());
        dispatch(dashboardActions.cleanDashboard())
        dispatch(paginationActions.cleanPagination());
        history.push('/login');
    }

    useEffect(() => {
        if (jwtToken !== null) {
            const jwtDecoded = jwt_decode(jwtToken);
            setJwtTokenDecoded(jwtDecoded);
        }
    }, [jwtToken])

    return (
        <>
            <aside id="sidebar" className="sidebar">

                <ul className="sidebar-nav" id="sidebar-nav">

                    <li className="nav-item">
                        <Link to="/admin/dashboard" className="nav-link collapsed">
                            <i className="bi bi-grid"></i>
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    {/* <!-- End Dashboard Nav --> */}
                    <li className="nav-item">
                        <Link to="/" className="nav-link collapsed" data-bs-target="#books-nav" data-bs-toggle="collapse">
                            <i className="bi bi-book-half"></i><span>Books</span><i className="bi bi-chevron-down ms-auto"></i>
                        </Link>
                        <ul id="books-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                            <li>
                                <Link to="/admin/book">
                                    <i className="bi bi-circle"></i><span>Book Data</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/category">
                                    <i className="bi bi-circle"></i><span>Category</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    {/* <!-- End Books Nav --> */}

                    <li className="nav-item">
                        <Link to="/" className="nav-link collapsed" data-bs-target="#users-nav" data-bs-toggle="collapse">
                            <i className="bi bi-people"></i><span>Users</span><i className="bi bi-chevron-down ms-auto"></i>
                        </Link>
                        <ul id="users-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                            {jwtTokenDecoded !== null &&
                                <>
                                    {jwtTokenDecoded.role === "ROLE_ADMIN" &&
                                        <li>
                                            <Link to="/admin/staff">
                                                <i className="bi bi-circle"></i><span>Staff</span>
                                            </Link>
                                        </li>
                                    }
                                </>
                            }
                            <li>
                                <Link to="/admin/customer">
                                    <i className="bi bi-circle"></i><span>Customer</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    {/* <!-- End Users Nav --> */}

                    <li className="nav-item">
                        <Link to="/admin/rental" className="nav-link collapsed">
                            <i className="bi bi-bag-check-fill"></i>
                            <span>Rentals</span>
                        </Link>
                    </li>
                    {/* <!-- End Rentals Nav --> */}

                    <li className="nav-item">
                        <Link to="/admin/history" className="nav-link collapsed">
                            <i className="bi bi-journal-text"></i>
                            <span>History</span>
                        </Link>
                    </li>
                    {/* <!-- End History Nav --> */}

                    <li className="nav-heading">Profile Pages</li>

                    <li className="nav-item">
                        <Link to="/admin/profile_admin" className="nav-link collapsed">
                            <i className="bi bi-person"></i>
                            <span>Profile</span>
                        </Link>
                    </li>
                    {/* <!-- End Profile Page Nav --> */}

                    <li className="nav-item">
                        <div onClick={() => logOut()} className="nav-link collapsed" style={{ cursor: 'pointer' }}>
                            <i className="bi bi-box-arrow-left"></i>
                            <span>Logout</span>
                        </div>
                    </li>
                    {/* <!-- End Login Page Nav --> */}

                </ul>
            </aside >
            {/* <!-- End Sidebar--> */}
        </>
    )
}

export default Sidebar;