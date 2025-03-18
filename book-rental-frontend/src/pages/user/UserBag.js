import { Link } from "react-router-dom";
import Header from '../../component/Header.js';
import { useSelector, useDispatch } from "react-redux";
import { usersActions } from '../../store/usersReducer.js';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import Profile_Image from "../../assets/img/profile_blank.jpg"
import { bagsActions } from "../../store/bagsReducer.js";
import { checkoutRental, getRentalDetailsByUserId, getBookByBookId, getProfileImageByUserId } from "../../service/Fetch.js";
import CurrencyFormat from 'react-currency-format';
import swal from "sweetalert";
import { dashboardActions } from "../../store/dashboardReducer.js";
import { paginationActions } from "../../store/paginationReducer.js";

const UserBag = () => {
    const jwtToken = useSelector((state) => state.users.token);
    const [jwtTokenDecoded, setJwtTokenDecoded] = useState(null);
    const userProfile = useSelector((state) => state.users.user);
    const bookOnBag = useSelector((state) => state.bags.bags.books);
    const bags = useSelector((state) => state.bags.bags);
    const countBook = useSelector((state) => state.bags.countBook);
    const [rentalDetails, setRentalDetails] = useState(null);
    const [bookImage, setBookImage] = useState(
        {
            fileName: null,
            fileData: null,
            fileType: null,
            bookId: null
        });

    const dispatch = useDispatch();
    const history = useHistory();

    const logOut = () => {
        dispatch(usersActions.logout());
        dispatch(bagsActions.removeAllbook());
        dispatch(dashboardActions.cleanDashboard());
        dispatch(paginationActions.cleanPagination());
        history.push('/login');
    }

    const checkUserRole = (userRole) => {
        if (userRole === "ROLE_MEMBER" || userRole === "ROLE_USER") {
            history.push('/user/bag');
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

    const handlerRemove = (index) => {
        swal({
            title: "Information!",
            text: "Success Remove  Book From Bag",
            icon: "success"
        }).then(() => {
            dispatch(bagsActions.removeBook(index));
            history.go(0)
        });
    }

    const handlerRent = async () => {
        const usersBag = bags.users;
        const dataRental = {
            user: usersBag,
            books: bookOnBag
        };

        checkoutRental("user/checkout", dataRental, jwtToken).then(res => {
            swal({
                text: res.data,
                icon: "success"
            }).then(() => {
                dispatch(bagsActions.removeAllbook());
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

    const dayStatus = (startDate) => {
        let todayDate = new Date();
        let formatStartDate = new Date(startDate);
        let totalDay = todayDate - formatStartDate;
        let formatTotalDay = totalDay / 86400000;
        return Math.floor(formatTotalDay) + 1;
    }

    const modalAlertRemove = (data) => {
        return (
            <div className="modal fade" id={`alert${data}`} tabindex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Warning</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are You Sure Want to Remove Book From Bag?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                            <button type="button" className="btn btn-danger" onClick={() => handlerRemove(data)}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const modalAlertRent = () => {
        return (
            <div className="modal fade" id="alertRent" tabindex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirmation</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are You Sure Want To Rent These Book?
                            {bookOnBag.map((bookData, index) => {
                                return (
                                    <>
                                        <div>✔ Book Title = {bookData.title}</div>
                                    </>
                                )
                            })}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => handlerRent()}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const modalInformation = () => {
        return (
            <div className="modal fade" id="alertInformation" tabindex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Information Rules</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {userProfile.role === "ROLE_USER" ?
                                <>
                                    <div className="text-center"><h5>Rental</h5></div>
                                    <div>- Maximum Rent : 2 Books</div>
                                    <div>- Limit for Type Novel : 2 Books</div>
                                    <div>- Limit for Type Ensiklopedia : 1 Book</div>
                                    <div>- Limit for each Type for Novel & Comic : 1 Book</div>
                                    <br />
                                    <div className="text-center"><h5>Fine</h5></div>
                                    <div>- Max Days of Rental : 5 Days</div>
                                    <div>- When Rental Date Exceeded, Fine price = Rp 1.000/Day</div>
                                </>
                                :
                                <>
                                    <div className="text-center"><h5>Rental</h5></div>
                                    <div>- Maximum Rent : 5 Books</div>
                                    <div>- Limit for Type Novel : 4 Books</div>
                                    <div>- Limit for Type Comic : 3 Books</div>
                                    <div>- Limit for Type Ensiklopedia : 2 Books</div>
                                    <div>- Limit for Type Novel & Comic : 3 Novels & 2 Comics</div>
                                    <div>- Limit for each Type are 1 Book</div>
                                    <br />
                                    <div className="text-center"><h5>Fine</h5></div>
                                    <div>- Max Days of Rental : 5 Days</div>
                                    <div>- When Rental Date Exceeded, Fine price = Rp 1.000/Day</div>
                                </>
                            }

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const modalInformationDayStatus = () => {
        return (
            <div className="modal fade" id="alertInformationDayStatus" tabindex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Information Day Status</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="text-center"><h5>Color Mean</h5></div>
                            <div>- Blue : 1 - 3 Days ( Safe )</div>
                            <div>- Yellow : 4 -5 Days ( Warning : Return The Book Quickly )</div>
                            <div>- Red : More than 5 Days ( Alert : Fined )</div>
                            <br />
                            <div className="text-center"><h5>Fine</h5></div>
                            <div>- Max Days of Rental : 5 Days</div>
                            <div>- When Rental Date Exceeded, Fine price = Rp 1.000/Day</div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const countFinePrice = (startRentalDate) => {
        let finePrice = 0;
        let countDayRental = dayStatus(startRentalDate);
        if (countDayRental > 5) {
            finePrice = (countDayRental - 5) * 1000;
        }
        return finePrice;
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

        getRentalDetailsByUserId(`user/getuserrentaldetails/userid=${userProfile.id}`, jwtToken).then(res => {
            setRentalDetails(res.data)
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

        let data = { bookData: null, arrayBook: null }
        bookOnBag.map((book, index) => {
            if (book.id !== null) {
                getBookByBookId(`/user/getbooks/bookid=${book.id}`, jwtToken).then(res => {
                    data = { bookData: res.data, arrayBook: index }
                    dispatch(bagsActions.updateBookOnBag(data));
                })
            }
        })

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

    return (
        <>
            <Header />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Book Bag</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/user/dashboard">User</Link></li>
                            <li className="breadcrumb-item active">Bag</li>
                        </ol>
                    </nav>
                </div>

                <section className="section profile">


                    <div className="d-flex justify-content-center">
                        {/* User Card Image & Name */}
                        <div className="card col-10">
                            <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
                                {bookImage.fileData !== null ?
                                    <>
                                        <img style={{ height: "120px", width: "120px" }} src={`data:${bookImage.fileType};base64, ` + bookImage.fileData
                                        } alt={bookImage.fileName} className="rounded-circle" />
                                    </>
                                    :
                                    <>
                                        <img style={{ height: "120px", width: "120px" }} src={Profile_Image} alt="Profile" className="rounded-circle" />
                                    </>
                                }
                                {userProfile.firstName !== null &&
                                    <>
                                        <h2>{userProfile.firstName} {userProfile.lastName}</h2>
                                        <h3>{userProfile.role.slice(5)}</h3>
                                    </>
                                }
                            </div>
                        </div>
                        {/* End User Card Image & Name */}
                    </div>

                    <div className="d-flex justify-content-center">
                        <div className="row col-10">
                            {/* Card Profile Detail */}
                            <div className="card col-4">
                                <div className="card-body">
                                    <div className="profile-overview">
                                        <h5 className="card-title">Profile</h5>

                                        <div className="row">
                                            <div className="col-lg-4 col-md-4 label ">Full Name</div>
                                            <div className="col-lg-8 col-md-8">{userProfile.firstName} {userProfile.lastName}</div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-4 col-md-4 label">Address</div>
                                            <div className="col-lg-8 col-md-8">{userProfile.address}</div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-4 col-md-4 label">Phone</div>
                                            <div className="col-lg-8 col-md-8">{userProfile.phoneNumber}</div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-4 col-md-4 label">Email</div>
                                            <div className="col-lg-8 col-md-8">{userProfile.email}</div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-4 col-md-4 label">Role Status</div>
                                            {userProfile.role !== null &&
                                                <div className="col-lg-8 col-md-8">{userProfile.role.slice(5)}</div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* End Card Profile Detail */}

                            {/* Table On Rental Book */}
                            <div className="col-8">
                                <div className="card">
                                    <div className="card-body pt-3">
                                        <div className="col-12 d-flex flex-row justify-content-between">
                                            <h5 className="card-title">On Rental Books</h5>
                                            <div type="button" className="btn btn-lg text-primary" data-bs-toggle="modal" data-bs-target="#alertInformationDayStatus"><i className="bi bi-info-circle"></i></div>
                                        </div>
                                        {modalInformationDayStatus()}
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Book Title</th>
                                                    <th scope="col">Type</th>
                                                    <th className="text-center" scope="col">Price/Day</th>
                                                    <th scope="col">Day Status</th>
                                                    <th className="text-center" scope="col">Fine Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rentalDetails !== null &&
                                                    <>
                                                        {rentalDetails.map((rental, index) => {
                                                            return (
                                                                <tr>
                                                                    <td>{index + 1}</td>
                                                                    <td>{rental.bookTitles}</td>
                                                                    <td>{rental.bookTypesName}</td>
                                                                    <td className="text-center">
                                                                        <CurrencyFormat
                                                                            value={rental.rentalPrice}
                                                                            displayType={"text"}
                                                                            thousandSeparator={true}
                                                                            prefix={"Rp. "}
                                                                        />
                                                                    </td>
                                                                    <td className="text-center"
                                                                        style={dayStatus(rental.startRentalDate) >= 6 ?
                                                                            { color: "#F50C07", fontWeight: "bold" } :
                                                                            dayStatus(rental.startRentalDate) >= 4 ?
                                                                                { color: "#F5AB18", fontWeight: "bold" } :
                                                                                { color: "#1721F5", fontWeight: "bold" }
                                                                        }>
                                                                        {dayStatus(rental.startRentalDate)}
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <CurrencyFormat
                                                                            value={countFinePrice(rental.startRentalDate)}
                                                                            displayType={"text"}
                                                                            thousandSeparator={true}
                                                                            prefix={"Rp. "}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </>
                                                }
                                            </tbody>
                                        </table>
                                        {/* <!-- End Table with stripped rows --> */}
                                    </div>
                                </div>
                            </div>
                            {/* End Table On Rental Book */}
                        </div>
                    </div>

                    <div className="d-flex justify-content-center">
                        {/* Table Bag */}
                        <div className="col-10">
                            <div className="card">
                                <div className="card-body pt-3">
                                    <div className="col-12 d-flex flex-row justify-content-between">
                                        <h5 className="card-title">YOUR BAG </h5>
                                        <div type="button" className="btn btn-lg text-primary" data-bs-toggle="modal" data-bs-target="#alertInformation"><i className="bi bi-info-circle"></i></div>
                                    </div>
                                    {modalInformation()}
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Title</th>
                                                <th scope="col">Author</th>
                                                <th scope="col">Type</th>
                                                <th scope="col">Stock Left</th>
                                                <th scope="col">Price/Day</th>
                                                <th className="d-flex justify-content-end" scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookOnBag.map((book, index) => {
                                                return (
                                                    (book.id !== null && book.type.id !== null) &&
                                                    <>
                                                        <tr>
                                                            <th scope="row">{index + 1}</th>
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
                                                                <button type="button" className="btn btn-danger ms-1" data-bs-toggle="modal" data-bs-target={`#alert${index}`}><i className="bi bi-trash"></i></button>
                                                                {modalAlertRemove(index)}
                                                            </td>
                                                        </tr>
                                                    </>
                                                )
                                            })}

                                        </tbody>
                                    </table>
                                    {countBook === 0 ||
                                        <>
                                            <button type="button" className="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#alertRent"><i className="bi bi-file-plus"></i> Rent </button>
                                            {modalAlertRent()}
                                        </>
                                    }
                                    {/* <!-- End Table with stripped rows --> */}
                                </div>
                            </div>
                        </div>
                        {/* End Table Bag */}
                    </div>

                </section>
            </main>
        </>
    )
}

export default UserBag;