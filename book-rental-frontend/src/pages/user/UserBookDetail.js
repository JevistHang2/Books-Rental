import { Link } from "react-router-dom";
import Header from '../../component/Header.js';
import { useSelector, useDispatch } from "react-redux";
import { usersActions } from '../../store/usersReducer.js';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import { useLocation } from "react-router";
import CurrencyFormat from 'react-currency-format';
import image_card from "../../assets/img/card.jpg";
import { bagsActions } from "../../store/bagsReducer.js";
import { getImageByBookId } from "../../service/Fetch.js";
import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";
import { dashboardActions } from "../../store/dashboardReducer.js";
import { paginationActions } from "../../store/paginationReducer.js";
import swal from "sweetalert";

const UserBookDetail = () => {
    const jwtToken = useSelector((state) => state.users.token);
    const [jwtTokenDecoded, setJwtTokenDecoded] = useState(null);
    const userRole = useSelector((state) => state.users.user.role);

    const dispatch = useDispatch();
    const history = useHistory();
    const bookData = useLocation();
    const userData = useSelector((state) => state.users.user);
    const [bookImage, setBookImage] = useState(
        {
            fileName: null,
            fileData: null,
            fileType: null,
            bookId: null
        });

    const logOut = () => {
        dispatch(usersActions.logout());
        dispatch(bagsActions.removeAllbook());
        dispatch(dashboardActions.cleanDashboard());
        dispatch(paginationActions.cleanPagination());
        history.push('/login');
    }

    const checkUserRole = (userRole) => {
        if (userRole === "ROLE_MEMBER" || userRole === "ROLE_USER") {
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

    const handlerAddBook = () => {
        dispatch(bagsActions.addBook(bookData.state.data))
        dispatch(bagsActions.addUser(userData))
    }

    useEffect(() => {
        if (jwtToken !== null) {
            const jwtDecoded = jwt_decode(jwtToken);
            checkExpToken(jwtDecoded.exp);
            checkUserRole(jwtDecoded.role);
            setJwtTokenDecoded(jwtDecoded);
        } else {
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
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Book Detail</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Books</Link></li>
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
                                            {jwtTokenDecoded !== null &&
                                                <div className="d-grid gap-2 mt-3">
                                                    <button className="btn btn-info" type="button" onClick={() => handlerAddBook()}>Add Book<i className="bi bi-book-fill ms-2"></i></button>
                                                </div>
                                            }
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

export default UserBookDetail;