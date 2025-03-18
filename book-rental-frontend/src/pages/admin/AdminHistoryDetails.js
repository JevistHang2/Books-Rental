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
import { format } from "date-fns";
import { getRentalDetailsHistory } from "../../service/Fetch.js";
import swal from "sweetalert";
import { dashboardActions } from "../../store/dashboardReducer.js";
import { paginationActions } from "../../store/paginationReducer.js";

const AdminHistoryDetails = () => {
    const jwtToken = useSelector((state) => state.users.token);
    const [jwtTokenDecoded, setJwtTokenDecoded] = useState(null);
    const [historyRentalDetails, setHistoryRentalDetails] = useState(null);

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

    const formatDate = (startDate) => {
        let formattedDate = Date.parse(startDate);
        return format(formattedDate, "yyyy-MM-dd HH:mm:ss");
    }

    const dayStatus = (startDate, endDate) => {
        let formatStartDate = new Date(startDate);
        let formatEndDate = new Date(endDate);
        let totalDay = formatEndDate - formatStartDate;
        let formatTotalDay = totalDay / 86400000;
        return Math.floor(formatTotalDay) + 1;
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

        let rentalId = rental.state.data.rentalId;
        getRentalDetailsHistory(`admin/getrentalhistory/rentalid=${rentalId}`, jwtToken).then(res => {
            setHistoryRentalDetails(res.data)
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
                    <h1>History Data</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Admin</Link></li>
                            <li className="breadcrumb-item"><Link to="/admin/history">History</Link></li>
                            <li className="breadcrumb-item active">History Detail</li>
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
                                            <h5 className="card-title">Customer History Info</h5>
                                            <>
                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label_detailbook">Full Name</div>
                                                    <div className="col-lg-9 col-md-8">{rental.state.data.firstName} {rental.state.data.lastName}</div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label_detailbook">Rental Date</div>
                                                    <div className="col-lg-9 col-md-8">{formatDate(rental.state.data.startRentalDate)}</div>
                                                </div>
                                            </>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">History Detail Table</h5>

                                        {/* <!-- Table with stripped rows --> */}
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Book Title</th>
                                                    <th scope="col">Return Date</th>
                                                    <th scope="col">Rental Time</th>
                                                    <th scope="col">Price/Days</th>
                                                    <th scope="col">Total Fine Price</th>
                                                    <th scope="col">Total Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {historyRentalDetails !== null &&
                                                    <>
                                                        {historyRentalDetails.map((historyDataDetails, index) => {
                                                            return (
                                                                <>
                                                                    <tr>
                                                                        <td>{index + 1}</td>
                                                                        <td>{historyDataDetails.bookTitles}</td>
                                                                        <td>{formatDate(historyDataDetails.endRentalDate)}</td>
                                                                        <td className="text-center">{dayStatus(rental.state.data.startRentalDate, historyDataDetails.endRentalDate)} Days</td>
                                                                        <td>
                                                                            <CurrencyFormat
                                                                                value={historyDataDetails.rentalPrice}
                                                                                displayType={"text"}
                                                                                thousandSeparator={true}
                                                                                prefix={"Rp. "}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <CurrencyFormat
                                                                                value={historyDataDetails.finePrice}
                                                                                displayType={"text"}
                                                                                thousandSeparator={true}
                                                                                prefix={"Rp. "}
                                                                            />
                                                                        </td>
                                                                        <td>                                                                            <CurrencyFormat
                                                                            value={historyDataDetails.totalPrice}
                                                                            displayType={"text"}
                                                                            thousandSeparator={true}
                                                                            prefix={"Rp. "}
                                                                        /></td>
                                                                    </tr>
                                                                </>
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
                        </div>
                    </div>
                </section>

            </main>
            {/* <!-- End #main --> */}
        </>
    )
}

export default AdminHistoryDetails;