import { Link } from "react-router-dom";
import Header from '../../component/Header.js';
import Sidebar from '../../component/Sidebar.js'
import { useSelector, useDispatch } from "react-redux";
import { usersActions } from '../../store/usersReducer.js';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import { registerStaff, deleteStaff, searchAdminAndStaffByNameOrUsername } from "../../service/Fetch.js";
import { usersAdminStaffActions } from "../../store/usersAdminStaffReducer.js";
import AdminUserStaffEditForm from "./AdminUserStaffEditForm.js";
import swal from "sweetalert";
import { dashboardActions } from "../../store/dashboardReducer.js";
import { paginationActions } from "../../store/paginationReducer.js";

const AdminUsersStaff = () => {
    const jwtToken = useSelector((state) => state.users.token);
    const [jwtTokenDecoded, setJwtTokenDecoded] = useState(null);
    const allUserValues = useSelector((state) => state.usersAdminStaff.userAdminAndStaff)
    const [keywordValue, setKeywordValue] = useState("");
    const pageSize = 10;
    const [pagination, setPagination] = useState({
        first: null,
        last: null,
        totalPages: null,
        empty: null,
        number: 0,
        size: pageSize
    })

    const [addStaffValues, setStaffValues] = useState({
        firstName: null,
        lastName: null,
        email: null,
        userName: null,
        address: null,
        phoneNumber: null
    });

    const changeHandler = e => {
        setStaffValues({ ...addStaffValues, [e.target.name]: e.target.value })
    }

    const dispatch = useDispatch();
    const history = useHistory();

    const modalAddStaff = () => {
        return (
            <div className="modal fade" id="addStaff" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Staff</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className="row g-3 needs-validation" novalidate onSubmit={(e) => handlerAdd(e)}>
                                <div className="col-12">
                                    <label htmlFor="firstName" className="form-label required">First Name</label>
                                    <input type="text" name="firstName" className="form-control" id="firstName" onChange={changeHandler} required />
                                </div>

                                <div className="col-12">
                                    <label htmlFor="lastName" className="form-label">Last Name</label>
                                    <input type="text" name="lastName" className="form-control" id="lastName" onChange={changeHandler} />
                                </div>

                                <div className="col-12">
                                    <label htmlFor="email" className="form-label required">Email</label>
                                    <div className="input-group has-validation">
                                        <input type="email" name="email" className="form-control" id="email" onChange={changeHandler} required />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label htmlFor="userName" className="form-label required">Username</label>
                                    <input type="text" name="userName" className="form-control" id="userName" onChange={changeHandler} required />
                                </div>

                                <div className="col-12">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <input type="text" name="address" className="form-control" id="address" onChange={changeHandler} />
                                </div>

                                <div className="col-12">
                                    <label htmlFor="phoneNumber" className="form-label required">Phone Number</label>
                                    <input type="text" name="phoneNumber" className="form-control" id="phoneNumber" onChange={changeHandler} required />
                                </div>

                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary">Add</button>
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    const modalAlertDelete = (data) => {
        return (
            <div className="modal fade" id={`alert${data.id}`} tabindex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Warning</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are You Sure Want to Delete?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => handlerDelete(data)}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const handlerDelete = (staffData) => {
        deleteStaff("admin/deletestaff", staffData, jwtToken).then(res => {
            swal({
                text: res.data,
                icon: "success"
            }).then(() => {
                history.go(0)
            });
        }).catch(err => {
            if (typeof err.response.data === "string") {
                swal({
                    title: "Alert!",
                    text: err.response.data,
                    icon: "error"
                });
            } else {
                console.log(err.response);
                let message = "";
                err.response.data.message.map((dataError) => {
                    message = message + "\n" + dataError;
                });
                swal({
                    title: "Alert!",
                    text: message,
                    icon: "error"
                });
            }
        })

    }

    const handlerAdd = (e) => {
        e.preventDefault();
        registerStaff("admin/registerstaff", addStaffValues, jwtToken).then(res => {
            swal({
                text: res.data,
                icon: "success"
            }).then(() => {
                history.go(0);
            });
        }).catch(err => {
            if (typeof err.response.data === "string") {
                swal({
                    title: "Alert!",
                    text: err.response.data,
                    icon: "error"
                });
            } else {
                console.log(err.response);
                let message = "";
                err.response.data.message.map((dataError) => {
                    message = message + "\n" + dataError;
                });
                swal({
                    title: "Alert!",
                    text: message,
                    icon: "error"
                });
            }
        })

    }

    const logOut = () => {
        dispatch(usersActions.logout());
        dispatch(dashboardActions.cleanDashboard());
        dispatch(paginationActions.cleanPagination());
        history.push('/login');
    }

    const checkUserRole = (userRole) => {
        if (userRole === "ROLE_ADMIN" || userRole === "ROLE_STAFF") {
            history.push('/admin/staff');
        } else {
            alert(`Your Roles is ${userRole} that not qualified to access this pages`)
            logOut();
        }
    }

    const checkExpToken = (jwtExpTime) => {
        if (new Date().getTime() >= jwtExpTime * 1000) {
            swal({
                title: "Information!",
                text: "JWT expired AUTO Logout",
                icon: "info"
            });
            logOut();
        }
    }

    const changeKeyHandler = e => {
        setKeywordValue(e.target.value)
    }

    const [isSearch, setIsSearch] = useState(false);

    const handlerSearch = e => {
        e.preventDefault();
        setPagination({
            first: null,
            last: null,
            totalPages: null,
            empty: null,
            number: 0,
            size: pageSize
        })
        setIsSearch(!isSearch);
    }

    useEffect(() => {
        if (jwtToken !== null) {
            const jwtDecoded = jwt_decode(jwtToken);
            checkExpToken(jwtDecoded.exp);
            checkUserRole(jwtDecoded.role);
            setJwtTokenDecoded(jwtDecoded);
        } else {
            history.push("/");
        }

        searchAdminAndStaffByNameOrUsername(`admin/getadminandstaffpagination/key=${keywordValue}?pageNo=${pagination.number}&pageSize=${pagination.size}`, jwtToken).then(res => {
            dispatch(usersAdminStaffActions.setUserAdminStaff(res.data.content));
            setPagination({
                first: res.data.first,
                last: res.data.last,
                totalPages: res.data.totalPages,
                empty: res.data.empty,
                number: res.data.number,
                size: res.data.size
            });
        }).catch(err => {
            if (typeof err.response.data === "string") {
                swal({
                    title: "Alert!",
                    text: err.response.data,
                    icon: "error"
                });
            } else {
                console.log(err.response);
            }
        })

    }, [jwtToken, pagination.number, isSearch])

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Staff Data</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Admin</Link></li>
                            <li className="breadcrumb-item">Users</li>
                            <li className="breadcrumb-item active">Staff Data</li>
                        </ol>
                    </nav>
                </div>
                {/* <!-- End Page Title --> */}

                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Staff Table</h5>
                                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addStaff"><i className="bi bi-plus-square p-1"></i> Add </button>
                                    {modalAddStaff()}

                                    <div className="search-bar float-end">
                                        <form className="search-form d-flex align-items-center" onSubmit={handlerSearch}>
                                            <input type="text" name="query" placeholder="Search by Name..." title="Enter search keyword" onChange={changeKeyHandler} />
                                            <button type="button" className="btn btn-sm btn-primary py-1 ms-2" title="Search" onClick={(e) => handlerSearch(e)}><i className="bi bi-search"></i></button>
                                        </form>
                                    </div>

                                    {/* <!-- Table with stripped rows --> */}
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Full Name</th>
                                                <th scope="col">Username</th>
                                                <th scope="col">Address</th>
                                                <th scope="col">Phone</th>
                                                <th scope="col">Role</th>
                                                <th className="d-flex justify-content-end" scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allUserValues.id !== null &&
                                                <>
                                                    {allUserValues.map((user, index) => {
                                                        return (
                                                            <tr>
                                                                <th scope="row">{index + 1 + (pagination.number * 10)}</th>
                                                                <td>{user.firstName} {user.lastName}</td>
                                                                <td>{user.userName}</td>
                                                                <td>{user.address}</td>
                                                                <td>{user.phoneNumber}</td>
                                                                <td>{user.role.slice(5)}</td>
                                                                {jwtTokenDecoded !== null &&
                                                                    <td className="d-flex justify-content-end">
                                                                        {jwtTokenDecoded.role === "ROLE_ADMIN" &&
                                                                            <>
                                                                                {jwtTokenDecoded.sub === user.userName ?
                                                                                    <>
                                                                                        <Link to="/admin/profile_admin"><button type="button" className="btn btn-warning ms-1"><i className="bi bi-pencil-square"></i></button></Link>
                                                                                        <button type="button" className="btn btn-secondary ms-1" data-bs-toggle="modal" data-bs-target={`#alert${user.id}`} disabled><i className="bi bi-trash"></i></button>
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                        <button type="button" className="btn btn-warning ms-1" data-bs-toggle="modal" data-bs-target={`#editstaff${user.id}`}><i className="bi bi-pencil-square"></i></button>
                                                                                        <AdminUserStaffEditForm userData={user} />
                                                                                    </>
                                                                                }
                                                                            </>
                                                                        }
                                                                        {(user.role !== "ROLE_ADMIN" && jwtTokenDecoded.role === "ROLE_ADMIN") &&
                                                                            <>
                                                                                <button type="button" className="btn btn-danger ms-1" data-bs-toggle="modal" data-bs-target={`#alert${user.id}`}><i className="bi bi-trash"></i></button>
                                                                                {modalAlertDelete(user)}
                                                                            </>
                                                                        }
                                                                    </td>
                                                                }

                                                            </tr>
                                                        )
                                                    })
                                                    }
                                                </>
                                            }
                                        </tbody>
                                    </table>
                                    {/* <!-- End Table with stripped rows --> */}

                                    {/* Pagination */}
                                    <div className="section d-flex justify-content-center">

                                        {(!pagination.empty) &&
                                            <>
                                                <nav>
                                                    <ul className="pagination">

                                                        <li className={pagination.first ? "page-item disabled" : "page-item"}>
                                                            <div className="page-link" style={{ cursor: "pointer" }} onClick={() => setPagination({ ...pagination, number: pagination.number - 1 })}>Previous</div>
                                                        </li>

                                                        {Array.from(Array(pagination.totalPages), (event, index) => {
                                                            return (
                                                                <>
                                                                    <li className={pagination.number === index ? "page-item active" : "page-item"}>
                                                                        <div className="page-link" style={{ cursor: "pointer" }} onClick={() => setPagination({ ...pagination, number: index })}>{index + 1}</div>
                                                                    </li>
                                                                </>
                                                            );
                                                        })
                                                        }

                                                        <li className={pagination.last ? "page-item disabled" : "page-item"}>
                                                            <div className="page-link" style={{ cursor: "pointer" }} onClick={() => setPagination({ ...pagination, number: pagination.number + 1 })}>Next</div>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </>
                                        }
                                    </div>
                                    {/* End Pagination */}
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

            </main>
            {/* <!-- End #main --> */}
        </>
    )
}

export default AdminUsersStaff;