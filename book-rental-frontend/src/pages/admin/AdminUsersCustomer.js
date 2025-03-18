import { Link } from "react-router-dom";
import Header from '../../component/Header.js';
import Sidebar from '../../component/Sidebar.js'
import { useSelector, useDispatch } from "react-redux";
import { usersActions } from '../../store/usersReducer.js';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import { searchMemberAndUserByNameOrUsername } from "../../service/Fetch.js";
import { usersMemberUserActions } from "../../store/usersMemberUserReducer.js"
import AdminUserCustomerEditForm from "./AdminUserCustomerEditForm.js";
import swal from "sweetalert";
import { dashboardActions } from "../../store/dashboardReducer.js";
import { paginationActions } from "../../store/paginationReducer.js";

const AdminUsersCustomer = () => {
    const jwtToken = useSelector((state) => state.users.token);
    const [jwtTokenDecoded, setJwtTokenDecoded] = useState(null);
    const adminUser = useSelector((state) => state.users.user)
    const allUserValues = useSelector((state) => state.usersMemberUser.userMemberAndUser)
    const [keywordValue, setKeywordValue] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const pageSize = 10;
    const [pagination, setPagination] = useState({
        first: null,
        last: null,
        totalPages: null,
        empty: null,
        number: 0,
        size: pageSize
    })

    const dispatch = useDispatch();
    const history = useHistory();

    const logOut = () => {
        dispatch(usersActions.logout());
        dispatch(dashboardActions.cleanDashboard());
        dispatch(paginationActions.cleanPagination());
        history.push('/login');
    }

    const checkUserRole = (userRole) => {
        if (userRole === "ROLE_ADMIN" || userRole === "ROLE_STAFF") {
            history.push('/admin/customer');
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

        searchMemberAndUserByNameOrUsername(`admin/getmemberanduserpagination/key=${keywordValue}?pageNo=${pagination.number}&pageSize=${pagination.size}`, jwtToken).then(res => {
            dispatch(usersMemberUserActions.setUserMemberUser(res.data.content))
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
                    <h1>Customer Data</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Admin</Link></li>
                            <li className="breadcrumb-item">Users</li>
                            <li className="breadcrumb-item active">Customer Data</li>
                        </ol>
                    </nav>
                </div>
                {/* <!-- End Page Title --> */}

                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Customer Table</h5>

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
                                                                <td>{user.role.slice(5)}
                                                                </td>
                                                                <td className="d-flex justify-content-end">
                                                                    <button type="button" className="btn btn-warning ms-1" data-bs-toggle="modal" data-bs-target={`#editcustomerrole${user.id}`}><i className="bi bi-pencil-square float-end"></i></button>
                                                                    <AdminUserCustomerEditForm userData={user} />
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
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

export default AdminUsersCustomer;