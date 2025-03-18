import { Link } from "react-router-dom";
import Header from '../../component/Header.js';
import Sidebar from '../../component/Sidebar.js'
import { useSelector, useDispatch } from "react-redux";
import { usersActions } from '../../store/usersReducer.js';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import { postCategory, getBookTypes, deleteBookTypes, searchBookTypesByName } from "../../service/Fetch.js";
import { bookTypesActions } from "../../store/bookTypesReducer.js"
import "../../assets/css/labelTextInput.css"
import AdminCategoryEditForm from "./AdminCategoryEditForm.js";
import swal from "sweetalert";
import { dashboardActions } from "../../store/dashboardReducer.js";
import { paginationActions } from "../../store/paginationReducer.js";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const AdminCategory = () => {
    const jwtToken = useSelector((state) => state.users.token);
    const bookTypes = useSelector((state) => state.bookTypes.bookTypes);
    const [jwtTokenDecoded, setJwtTokenDecoded] = useState(null);
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
            history.push('/admin/category');
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

    const [categoryValue, setCategoryValue] = useState({
        name: null,
        code: null
    });

    const changeHandler = e => {
        setCategoryValue({ ...categoryValue, [e.target.name]: e.target.value })
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

    const handlerAdd = (e) => {
        e.preventDefault();
        postCategory("admin/booktypes", categoryValue, jwtToken).then(res => {
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

    const modalAddCategory = () => {
        return (
            <div className="modal fade" id="addCategory" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Category</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className="row g-3 needs-validation" novalidate onSubmit={(e) => handlerAdd(e)}>
                                <div className="col-12">
                                    <label htmlFor="name" className="form-label required">Category</label>
                                    <input type="text" name="name" className="form-control" id="name" onChange={changeHandler} required />
                                </div>

                                <div className="col-12">
                                    <label htmlFor="code" className="form-label required">Category Book Code</label>
                                    <input type="code" name="code" className="form-control" id="code" onChange={changeHandler} required />
                                </div>

                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary" >Add</button>
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

    const handlerDelete = (bookType) => {
        deleteBookTypes("admin/deletebooktypes", bookType, jwtToken).then(res => {
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

    const exportPDF = async () => {
        const fetchData = await searchBookTypesByName(`admin/getbooktypes/key=${keywordValue}`, jwtToken);
        const unit = "pt";
        const size = "A4";
        const orientation = "potrait";

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(14);

        const title = "List Books Category";
        const headers = [["NO", "NAME", "CODE", "TOTAL BOOKS"]];

        const data = fetchData.data.map((booktype, index) =>
            [(index + 1),
            booktype.name,
            booktype.code,
            booktype.countBooks + " Books"
            ]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("REPORT BOOKS CATEGORY " + new Date() + ".pdf")
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

        searchBookTypesByName(`admin/getbooktypespagination/key=${keywordValue}?pageNo=${pagination.number}&pageSize=${pagination.size}`, jwtToken).then(res => {
            dispatch(bookTypesActions.setBookTypes(res.data.content));
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
        });

    }, [jwtToken, pagination.number, isSearch])

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Category</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Admin</Link></li>
                            <li className="breadcrumb-item">Books</li>
                            <li className="breadcrumb-item active">Category</li>
                        </ol>
                    </nav>
                </div>
                {/* <!-- End Page Title --> */}

                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Category Table</h5>

                                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addCategory"><i className="bi bi-plus-square p-1"></i> Add </button>
                                    {modalAddCategory()}
                                    <button type="button" className="btn btn-success ms-2" onClick={() => exportPDF()}><i className="fas fa-download fa-sm text-white-50"></i> Export PDF</button>

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
                                                <th scope="col">Name</th>
                                                <th scope="col">Code</th>
                                                <th scope="col">Total Books</th>
                                                <th className="d-flex justify-content-end" scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookTypes.id !== null &&
                                                <>
                                                    {bookTypes.map((category, index) => {
                                                        return (
                                                            <tr>
                                                                <th scope="row">{index + 1 + (pagination.number * 10)}</th>
                                                                <td>{category.name}</td>
                                                                <td>{category.code}</td>
                                                                <td className="ps-4">{category.countBooks} {category.countBooks > 1 ? "Books" : "Book"}</td>
                                                                <td className="d-flex justify-content-end">
                                                                    <button type="button" className="btn btn-warning ms-1" data-bs-toggle="modal" data-bs-target={`#editCategory${category.id}`}><i className="bi bi-pencil-square"></i></button>
                                                                    <AdminCategoryEditForm categoryData={category} />
                                                                    <button type="button" className="btn btn-danger ms-1" data-bs-toggle="modal" data-bs-target={`#alert${category.id}`}><i className="bi bi-trash"></i></button>
                                                                    {modalAlertDelete(category)}
                                                                </td>
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

export default AdminCategory;