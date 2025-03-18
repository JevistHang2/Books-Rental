import { Link } from "react-router-dom";
import Header from '../../component/Header.js';
import Sidebar from '../../component/Sidebar.js'
import { useSelector, useDispatch } from "react-redux";
import { usersActions } from '../../store/usersReducer.js';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import { postBook, getBookTypes, deleteBook, searchBooksByTitleOrAuthor, addBookImage } from "../../service/Fetch.js";
import { bookTypesActions } from "../../store/bookTypesReducer.js"
import { booksActions } from "../../store/booksReducer.js";
import "../../assets/css/labelTextInput.css"
import CurrencyFormat from 'react-currency-format';
import AdminBookEditForm from "./AdminBookEditForm.js";
import swal from "sweetalert";
import { dashboardActions } from "../../store/dashboardReducer.js";
import { paginationActions } from "../../store/paginationReducer.js";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const AdminBook = () => {
    const jwtToken = useSelector((state) => state.users.token);
    const [jwtTokenDecoded, setJwtTokenDecoded] = useState(null);
    const bookTypes = useSelector((state) => state.bookTypes.bookTypes);
    const books = useSelector((state) => state.books.books);
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
            history.push('/admin/book');
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

    const [bookValue, setBookValue] = useState({
        title: null,
        author: null,
        type: {
            id: null
        },
        stock: null,
        price: null,
        description: null
    });

    const changeHandler = e => {
        setBookValue({ ...bookValue, [e.target.name]: e.target.value })
    }

    const changeCategoryHandler = e => {
        setBookValue({ ...bookValue, [e.target.name]: { id: e.target.value } })
    }

    const [bookImageFile, setBookImageFile] = useState(null);

    const changeImageHandler = e => {
        let file = e.target.files[0];
        setBookImageFile(file)
    }

    const handlerAdd = (e) => {
        e.preventDefault()

        postBook("admin/books", bookValue, jwtToken).then(res => {
            let formData = new FormData();
            formData.append("book", JSON.stringify(res.data));
            formData.append("file", bookImageFile);
            addBookImage("admin/addbookimages", formData, jwtToken).then(res => {
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
    }

    const handlerDetail = (book) => {
        history.push(`/admin/book/detail/${book.id}`, { data: book, dataType: bookTypes })
    }

    const [keywordValue, setKeywordValue] = useState("");

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

    const modalAddBookForm = () => {
        return (
            <div className="modal fade" id="addBook" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Books</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className="row g-3 needs-validation" novalidate onSubmit={(e) => handlerAdd(e)}>
                                <div className="col-12">
                                    <label htmlFor="title" className="form-label required">Title</label>
                                    <input type="text" name="title" className="form-control" id="title" onChange={changeHandler} required />
                                </div>

                                <div className="col-12">
                                    <label htmlFor="author" className="form-label required">Author</label>
                                    <input type="text" name="author" className="form-control" id="author" onChange={changeHandler} required />
                                </div>

                                <div className="col-12">
                                    <label htmlFor="type" className="form-label required">Category</label>
                                    <select className="form-control form-select" aria-label="" name="type" id="type" onChange={changeCategoryHandler}>
                                        <option defaultValue>Choose Category</option>
                                        {bookTypes.id !== null &&
                                            <>
                                                {bookTypes.map((category) =>
                                                    <option value={category.id}>{category.name}</option>
                                                )}
                                            </>
                                        }
                                    </select>
                                </div>

                                <div className="col-12">
                                    <label htmlFor="stock" className="form-label required">Stock</label>
                                    <input type="number" min="0" name="stock" className="form-control" id="stock" onChange={changeHandler} required />
                                </div>

                                <div className="col-12">
                                    <label htmlFor="price" className="form-label required">Price/Day</label>
                                    <input type="number" min="0" name="price" className="form-control" id="price" onChange={changeHandler} required />
                                </div>

                                <div className="col-12">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea type="text" name="description" className="form-control" id="description" onChange={changeHandler} />
                                </div>

                                <div className="col-12">
                                    <label htmlFor="formFileMultiple" className="form-label required">Image Book</label>
                                    <input className="form-control" type="file" accept='image/*' name="bookImage" id="bookImage" onChange={changeImageHandler} required></input>
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

    const handlerDelete = (book) => {
        deleteBook("admin/deletebook", book, jwtToken).then(res => {
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

    const exportPDF = async () => {
        const fetchData = await searchBooksByTitleOrAuthor(`getbooks/key=${keywordValue}`);
        const unit = "pt";
        const size = "A4";
        const orientation = "landscape";

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(14);

        const title = "List Books";
        const headers = [["NO", "TITLE", "AUTHOR", "TYPE", "STOCK", "PRICE","DESCRIPTION"]];

        const data = fetchData.data.map((book, index) =>
            [(index + 1),
            book.title,
            book.author,
            book.type.name,
            book.stock,
            "Rp." + book.price,
            book.description
            ]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("REPORT BOOKS " + new Date() + ".pdf")
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

        getBookTypes("getbooktypes").then(res => {
            dispatch(bookTypesActions.setBookTypes(res.data));
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
        });

        searchBooksByTitleOrAuthor(`getbookspagination/key=${keywordValue}?pageNo=${pagination.number}&pageSize=${pagination.size}`).then(res => {
            dispatch(booksActions.setBooks(res.data.content));
            setPagination({
                first: res.data.first,
                last: res.data.last,
                totalPages: res.data.totalPages,
                empty: res.data.empty,
                number: res.data.number,
                size: res.data.size
            })
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
                    <h1>Book Data</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Admin</Link></li>
                            <li className="breadcrumb-item">Books</li>
                            <li className="breadcrumb-item active">Book Data</li>
                        </ol>
                    </nav>
                </div>
                {/* <!-- End Page Title --> */}

                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Books Table</h5>
                                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addBook"><i className="bi bi-plus-square p-1"></i> Add </button>
                                    {modalAddBookForm()}
                                    <button type="button" className="btn btn-success ms-2" onClick={() => exportPDF()}><i className="fas fa-download fa-sm text-white-50"></i> Export PDF</button>

                                    <div className="search-bar float-end">
                                        <form className="search-form d-flex align-items-center" onSubmit={handlerSearch}>
                                            <input type="text" name="query" placeholder="Search by Title, Author..." title="Enter search keyword" onChange={changeKeyHandler} />
                                            <button type="button" className="btn btn-sm btn-primary py-1 ms-2" title="Search" onClick={(e) => handlerSearch(e)}><i className="bi bi-search"></i></button>
                                        </form>
                                    </div>

                                    {/* <!-- Table with stripped rows --> */}
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Title</th>
                                                <th scope="col">Author</th>
                                                <th scope="col">Type</th>
                                                <th scope="col">Stock</th>
                                                <th scope="col">Price/day</th>
                                                <th className="d-flex justify-content-end" scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {books.map((book, index) => {
                                                return (
                                                    <tr>
                                                        <th scope="row">{index + 1 + (pagination.number * 10)}</th>
                                                        <td>{book.title}</td>
                                                        <td>{book.author}</td>
                                                        <td>{book.type.name}</td>
                                                        <td>{book.stock}</td>
                                                        <td>
                                                            <CurrencyFormat
                                                                value={book.price}
                                                                displayType={"text"}
                                                                thousandSeparator={true}
                                                                prefix={"Rp. "}
                                                            />
                                                        </td>
                                                        <td className="d-flex justify-content-end">
                                                            <button type="button" className="btn btn-info ms-1" onClick={() => handlerDetail(book)}><i className="bi bi-file-text"></i></button>
                                                            <button type="button" className="btn btn-warning ms-1" data-bs-toggle="modal" data-bs-target={`#editBook${book.id}`}><i className="bi bi-pencil-square"></i></button>
                                                            <AdminBookEditForm bookData={book} bookTypeData={bookTypes} />
                                                            <button type="button" className="btn btn-danger ms-1" data-bs-toggle="modal" data-bs-target={`#alert${book.id}`}><i className="bi bi-trash"></i></button>
                                                            {modalAlertDelete(book)}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            }
                                        </tbody>
                                    </table>
                                    {/* <!-- End Table with stripped rows --> */}

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

export default AdminBook;