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
import { getUserByMemberAndUser, getRentalDetailsById, returnBooks } from "../../service/Fetch.js";
import swal from "sweetalert";
import { dashboardActions } from "../../store/dashboardReducer.js";
import { paginationActions } from "../../store/paginationReducer.js";

const AdminRentalDetails = () => {
    const jwtToken = useSelector((state) => state.users.token);
    const [jwtTokenDecoded, setJwtTokenDecoded] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [rentalDetails, setRentalDetails] = useState(null);
    const [getRentalDetails, setGetRentalDetails] = useState([]);
    const [rerender, setRerender] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();
    const rental = useLocation();

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

    const dayStatus = (startDate) => {
        let todayDate = new Date();
        let formatStartDate = new Date(startDate);
        let totalDay = todayDate - formatStartDate;
        let formatTotalDay = totalDay / 86400000;
        return Math.floor(formatTotalDay) + 1;
    }

    const handlerCheck = (e, dataRental) => {
        setRerender(!rerender);
        let arrayDataRental = getRentalDetails;
        if (e.target.checked) {
            arrayDataRental = [...getRentalDetails, dataRental]
            setGetRentalDetails(arrayDataRental)
        } else {
            arrayDataRental.map((data, index) => {
                if (e.target.id === data.rentalDetailsId.toString()) {
                    getRentalDetails.splice(index, 1)
                }
            })
        }
    }

    const handlerReturnBooks = () => {
        returnBooks("admin/returnbook", getRentalDetails, jwtToken).then(res => {
            swal({
                text: res.data,
                icon: "success"
            }).then(() => {
                history.push('/admin/rental');
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

    const modalAlertReturnBook = () => {
        return (
            <div className="modal fade" id="alertReturnBook" tabindex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirmation</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {getRentalDetails.length !== 0 ?
                            <>
                                <div className="modal-body">
                                    Are These Book Want to be Returned?
                                    {getRentalDetails.map((book, index) => {
                                        return (
                                            <>
                                                <div>✔ Book Title = {book.bookTitles}</div>
                                            </>
                                        )
                                    })}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => handlerReturnBooks()}>Yes</button>
                                </div>
                            </>
                            :
                            <>
                                <div className="modal-body">
                                    Please Checklist The Book to Return
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Okay</button>
                                </div>
                            </>
                        }
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
                            <div>- Yellow : 4 -5 Days ( Warning : Inform Customers to Return The Book Quickly )</div>
                            <div>- Red : More than 5 Days ( Alert : Fined )</div>
                            <br />
                            <div className="text-center"><h5>Fine</h5></div>
                            <div>- Max Days of Rental for Customers are 5 Days</div>
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

    useEffect(() => {
        if (jwtToken !== null) {
            const jwtDecoded = jwt_decode(jwtToken);
            checkExpToken(jwtDecoded.exp);
            checkUserRole(jwtDecoded.role);
            setJwtTokenDecoded(jwtDecoded);
        } else {
            history.push("/");
        }

        let id = rental.state.data.userId;
        getUserByMemberAndUser(`admin/getmemberanduser/id=${id}`, jwtToken).then(res => {
            setUserProfile(res.data)
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

        let rentalId = rental.state.data.rentalId;
        getRentalDetailsById(`admin/getuserrentaldetails/id=${rentalId}`, jwtToken).then(res => {
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

    }, [jwtToken])

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Rental Data</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Admin</Link></li>
                            <li className="breadcrumb-item"><Link to="/admin/rental">Rental</Link></li>
                            <li className="breadcrumb-item active">Detail</li>
                        </ol>
                    </nav>
                </div>
                {/* <!-- End Page Title --> */}

                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="row">
                                <div className="card col-6">
                                    <div className="card-body">
                                        <div className="profile-overview">
                                            <h5 className="card-title">Customer Info</h5>
                                            {userProfile !== null &&
                                                <>
                                                    <div className="row">
                                                        <div className="col-lg-3 col-md-4 label_detailbook">Full Name</div>
                                                        <div className="col-lg-9 col-md-8">{userProfile.firstName} {userProfile.lastName}</div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-lg-3 col-md-4 label_detailbook">Address</div>
                                                        <div className="col-lg-9 col-md-8">{userProfile.address}</div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-lg-3 col-md-4 label_detailbook">Phone</div>
                                                        <div className="col-lg-9 col-md-8">{userProfile.phoneNumber}</div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-lg-3 col-md-4 label_detailbook">Email</div>
                                                        <div className="col-lg-9 col-md-8">{userProfile.email}</div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-lg-3 col-md-4 label_detailbook">Role Status</div>
                                                        {userProfile.role !== null &&
                                                            <div className="col-lg-9 col-md-8">{userProfile.role.slice(5)}</div>
                                                        }
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-body">
                                        <div className="col-12 d-flex flex-row justify-content-between">
                                            <h5 className="card-title">Rental Detail Table</h5>
                                            <div type="button" className="btn btn-lg text-primary" data-bs-toggle="modal" data-bs-target="#alertInformationDayStatus"><i className="bi bi-info-circle"></i></div>
                                        </div>
                                        {modalInformationDayStatus()}
                                        {/* <!-- Table with stripped rows --> */}
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Book Title</th>
                                                    <th scope="col">Book Category</th>
                                                    <th scope="col">Day Status</th>
                                                    <th scope="col">Price/Day</th>
                                                    <th scope="col">Status Rental</th>
                                                    <th className="d-flex justify-content-end" scope="col">Action</th>
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
                                                                    <td className="text-center"
                                                                        style={dayStatus(rental.startRentalDate) >= 6 ?
                                                                            { color: "#F50C07", fontWeight: "bold" } :
                                                                            dayStatus(rental.startRentalDate) >= 4 ?
                                                                                { color: "#F5AB18", fontWeight: "bold" } :
                                                                                { color: "#1721F5", fontWeight: "bold" }
                                                                        }>
                                                                        {dayStatus(rental.startRentalDate)}
                                                                    </td>
                                                                    <td>
                                                                        <CurrencyFormat
                                                                            value={rental.rentalPrice}
                                                                            displayType={"text"}
                                                                            thousandSeparator={true}
                                                                            prefix={"Rp. "}
                                                                        />
                                                                    </td>
                                                                    <td>{rental.statusRental}</td>
                                                                    <td className="d-flex justify-content-end">
                                                                        <form>
                                                                            <input type="checkbox" id={rental.rentalDetailsId} name={rental.rentalDetailsId} onClick={(e) => handlerCheck(e, rental)} />
                                                                        </form>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </>
                                                }
                                            </tbody>
                                        </table>
                                        <button type="button" className="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#alertReturnBook"><i className="bi bi-reply-all-fill"></i> Return Book</button>
                                        {modalAlertReturnBook()}
                                        {/* <!-- End Table with stripped rows --> */}

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

export default AdminRentalDetails;