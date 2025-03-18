import { Link } from "react-router-dom";
import Header from '../../component/Header.js';
import Sidebar from '../../component/Sidebar.js'
import { useSelector, useDispatch } from "react-redux";
import { usersActions } from '../../store/usersReducer.js';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import { useLocation } from "react-router";
import CurrencyFormat from 'react-currency-format';
import AdminBookEditForm from "./AdminBookEditForm.js";
import image_card from "../../assets/img/card.jpg";
import { getImageByBookId } from "../../service/Fetch.js";
import { dashboardActions } from "../../store/dashboardReducer.js";
import { paginationActions } from "../../store/paginationReducer.js";
import swal from "sweetalert";

const AdminBookDetail = () => {
    const jwtToken = useSelector((state) => state.users.token);
    const [jwtTokenDecoded, setJwtTokenDecoded] = useState(null);

    const dispatch = useDispatch();
    const history = useHistory();
    const bookData = useLocation();
    const [bookImage, setBookImage] = useState(
        {
            fileName: null,
            fileData: null,
            fileType: null,
            bookId: null
        });

    const logOut = () => {
        dispatch(usersActions.logout());
        dispatch(dashboardActions.cleanDashboard());
        dispatch(paginationActions.cleanPagination());
        history.push('/login');
    }

    const checkUserRole = (userRole) => {
        if (userRole === "ROLE_ADMIN" || userRole === "ROLE_STAFF") {
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

    useEffect(() => {
        if (jwtToken !== null) {
            const jwtDecoded = jwt_decode(jwtToken);
            checkExpToken(jwtDecoded.exp);
            checkUserRole(jwtDecoded.role);
            setJwtTokenDecoded(jwtDecoded);
        } else {
            history.push("/");
        }

        let bookId = bookData.state.data.id;
        getImageByBookId(`getimage/bookid=${bookId}`).then(res => {
            setBookImage(res.data)
        }).catch(err => {
            console.log(err.response);
        })

    }, [jwtToken])

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Book Detail</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Admin</Link></li>
                            <li className="breadcrumb-item">Books</li>
                            <li className="breadcrumb-item"><Link to="/admin/book">Books Data</Link></li>
                            <li className="breadcrumb-item active">Detail</li>
                        </ol>
                    </nav>
                </div>
                {/* <!-- End Page Title --> */}

                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">

                            {/* <!-- Card with an image on left --> */}
                            <div className="card mb-3">
                                <div className="row g-0">
                                    <div className="col-md-4 p-2 pt-3 text-center">
                                        <img style={{ height: "25vw", maxWidth: "100%" }} src={bookImage.fileName !== null &&
                                            `data:${bookImage.fileType};base64, ` + bookImage.fileData
                                        } className="img-fluid rounded-start" alt={bookImage.fileName} />
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">

                                            <h5 className="card-title">Book Details</h5>

                                            <div className="row pb-2">
                                                <div className="col-lg-3 col-md-4 label_detailbook">Book Code</div>
                                                <div className="col-lg-9 col-md-8">{bookData.state.data.id}</div>
                                            </div>

                                            <div className="row pb-2">
                                                <div className="col-lg-3 col-md-4 label_detailbook">Title</div>
                                                <div className="col-lg-9 col-md-8">{bookData.state.data.title}</div>
                                            </div>

                                            <div className="row pb-2">
                                                <div className="col-lg-3 col-md-4 label_detailbook">Author</div>
                                                <div className="col-lg-9 col-md-8">{bookData.state.data.author}</div>
                                            </div>

                                            <div className="row pb-2">
                                                <div className="col-lg-3 col-md-4 label_detailbook">Book Type</div>
                                                <div className="col-lg-9 col-md-8">{bookData.state.data.type.name}</div>
                                            </div>

                                            <div className="row pb-2">
                                                <div className="col-lg-3 col-md-4 label_detailbook">Stock</div>
                                                <div className="col-lg-9 col-md-8">{bookData.state.data.stock}</div>
                                            </div>

                                            <div className="row pb-2">
                                                <div className="col-lg-3 col-md-4 label_detailbook">Price / Day</div>
                                                <div className="col-lg-9 col-md-8">
                                                    <CurrencyFormat
                                                        value={bookData.state.data.price}
                                                        displayType={"text"}
                                                        thousandSeparator={true}
                                                        prefix={"Rp. "}
                                                    />
                                                </div>
                                            </div>

                                            <h5 className="card-title">Description</h5>
                                            <p className="card-text">{bookData.state.data.description}</p>
                                            <div className="d-grid gap-2 mt-3">
                                                <button className="btn btn-warning" type="button" data-bs-toggle="modal" data-bs-target={`#editBook${bookData.state.data.id}`} >Edit Book<i className="bi bi-pencil-square ms-2"></i></button>
                                                <AdminBookEditForm bookData={bookData.state.data} bookTypeData={bookData.state.dataType} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- End Card with an image on left --> */}

                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default AdminBookDetail;