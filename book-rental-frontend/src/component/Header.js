import { Link } from "react-router-dom";
import Logo_Nexbook from '../assets/img/logo_book.png';
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import jwt_decode from "jwt-decode";
import { usersActions } from "../store/usersReducer";
import { useHistory } from "react-router";
import SearchBar from "./SearchBar";
import { bagsActions } from "../store/bagsReducer";
import { getProfileImageByUserId } from "../service/Fetch";
import { dashboardActions } from "../store/dashboardReducer";
import { paginationActions } from "../store/paginationReducer";

import Profile_Image from "../assets/img/profile_blank.jpg"

const Header = () => {
    const jwtToken = useSelector((state) => state.users.token);
    const [jwtTokenDecoded, setJwtTokenDecoded] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(useSelector((state) => state.users.user.role));
    const userProfile = useSelector((state) => state.users.user);
    const countBook = useSelector((state) => state.bags.countBook);
    const [bookImage, setBookImage] = useState(
        {
            fileName: null,
            fileData: null,
            fileType: null,
            bookId: null
        });

    const dispatch = useDispatch();
    const history = useHistory();

    const toggleSidebar = () => {
        let element = document.body;
        element.classList.toggle("toggle-sidebar");
    }

    const logOut = () => {
        dispatch(usersActions.logout());
        dispatch(bagsActions.removeAllbook());
        dispatch(dashboardActions.cleanDashboard());
        dispatch(paginationActions.cleanPagination());
        history.push("/login");
    }

    useEffect(() => {
        if (jwtToken !== null) {
            const jwtDecoded = jwt_decode(jwtToken);
            setJwtTokenDecoded(jwtDecoded);
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }

        if (userProfile.id !== null) {
            getProfileImageByUserId(`getprofileimages/userid=${userProfile.id}`, jwtToken).then(res => {
                setBookImage(res.data)
            }).catch(err => {
                console.log(err.response);
                setBookImage(
                    { fileData: null })
            })
        }
    }, [jwtToken])

    const startHeader = () => {
        if (userRole === "ROLE_ADMIN" || userRole === "ROLE_STAFF") {
            document.body.classList.remove("toggle-sidebar");
        } else {
            document.body.classList.add("toggle-sidebar");
        }
    }
    startHeader();

    return (
        <>
            <header id="header" className="header fixed-top d-flex align-items-center">

                <div className="d-flex align-items-center justify-content-between">
                    {(userRole === "ROLE_ADMIN" || userRole === "ROLE_STAFF") ?
                        <i onClick={() => toggleSidebar()} className="bi bi-list toggle-sidebar-btn"></i>
                        :
                        <>
                        </>
                    }
                    <Link to="/" className="logo d-flex align-items-center ms-4">
                        <img src={Logo_Nexbook} alt="Logo NexBook" />
                        <span className="d-none d-lg-block">NexBook</span>
                    </Link>

                </div>
                {/* <!-- End Logo --> */}

                {(userRole !== "ROLE_ADMIN" && userRole !== "ROLE_STAFF") &&
                    <SearchBar />
                }

                <nav className="header-nav ms-auto">
                    <ul className="d-flex align-items-center">
                        {(userRole === "ROLE_ADMIN" || userRole === "ROLE_STAFF") ?
                            <>
                            </>
                            :
                            (userRole === "ROLE_USER" || userRole === "ROLE_MEMBER") ?
                                <>
                                    <li className="nav-item">
                                        <Link to="/user/dashboard" className="nav-link">Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/" className="nav-link">Book</Link>
                                    </li>
                                </>
                                :
                                <>
                                    <li className="nav-item">
                                        <Link to="/" className="nav-link">Book</Link>
                                    </li>
                                </>

                        }

                        {isLoggedIn === false ?
                            <>
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/register" className="nav-link">Register</Link>
                                </li>
                            </>
                            :
                            <>
                            </>
                        }

                        {(userRole === "ROLE_USER" || userRole === "ROLE_MEMBER") ?
                            <>
                                <li className="nav-item dropdown">
                                    <Link to="/user/bag" className="nav-link nav-icon">
                                        <i className="bi bi-book"></i>
                                        <span className="badge bg-primary badge-number">{countBook}</span>
                                    </Link>
                                </li>
                                {/* <!-- End Bag Nav --> */}

                                <li className="nav-item dropdown pe-3">

                                    <Link to="/user/profile_user" className="nav-link nav-profile d-flex align-items-center pe-0" data-bs-toggle="dropdown">
                                        {bookImage.fileData !== null ?
                                            <>
                                                <img style={{ height: "35px", maxWidth: "35px" }} src={`data:${bookImage.fileType};base64, ` + bookImage.fileData
                                                } alt={bookImage.fileName} className="rounded-circle" />
                                            </>
                                            :
                                            <>
                                                <img style={{ height: "35px", maxWidth: "35px" }} src={Profile_Image} alt="Profile" className="rounded-circle" />
                                            </>
                                        }
                                        {userProfile.firstName !== null &&
                                            <>
                                                <span className="d-none d-md-block dropdown-toggle ps-2">{userProfile.firstName} {userProfile.lastName.slice(0, 1)}.</span>
                                            </>
                                        }
                                    </Link>
                                    {/* <!-- End Profile Image Icon --> */}

                                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                                        <li className="dropdown-header">
                                            <h6>{userProfile.firstName} {userProfile.lastName}</h6>
                                            {userProfile.role !== null &&
                                                <>
                                                    <span>{userProfile.role.slice(5)}</span>
                                                </>
                                            }
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>

                                        <li>
                                            <Link to="/user/profile_user" className="dropdown-item d-flex align-items-center">
                                                <i className="bi bi-person"></i>
                                                <span>My Profile</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>

                                        <li>
                                            <Link to="/user/history" className="dropdown-item d-flex align-items-center">
                                                <i className="bi bi-journal-text"></i>
                                                <span>My History List</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>

                                        <li>
                                            <button onClick={() => logOut()} className="dropdown-item d-flex align-items-center">
                                                <i className="bi bi-box-arrow-right"></i>
                                                <span>Logout</span>
                                            </button>
                                        </li>

                                    </ul>
                                    {/* <!-- End Profile Dropdown Items --> */}
                                </li>
                                {/* <!-- End Profile Nav --> */}
                            </>
                            :
                            <>
                            </>
                        }


                    </ul>
                </nav>
                {/* <!-- End Icons Navigation --> */}

            </header>
            {/* <!-- End Header --> */}
        </>
    )
}

export default Header;