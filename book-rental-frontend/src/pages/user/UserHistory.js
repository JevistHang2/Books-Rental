import { Link } from "react-router-dom";
import Header from '../../component/Header.js';
import { useSelector, useDispatch } from "react-redux";
import { usersActions } from '../../store/usersReducer.js';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import Profile_Image from "../../assets/img/profile_blank.jpg"
import { bagsActions } from "../../store/bagsReducer.js";
import { userHistoryActions } from "../../store/userHistoryReducer.js";
import { getRentalDetailsByUserId, getProfileImageByUserId, getRentalDetailsHistoryByUserId, searchRentalDetailsHistoryByUserIdAndTitleAndDate } from "../../service/Fetch.js";
import CurrencyFormat from 'react-currency-format';
import swal from "sweetalert";
import { dashboardActions } from "../../store/dashboardReducer.js";
import { format } from "date-fns";
import { paginationActions } from "../../store/paginationReducer.js";

const UserHistory = () => {
    const jwtToken = useSelector((state) => state.users.token);
    const [jwtTokenDecoded, setJwtTokenDecoded] = useState(null);
    const userProfile = useSelector((state) => state.users.user);
    const [rentalDetails, setRentalDetails] = useState(null);
    const [bookImage, setBookImage] = useState(
        {
            fileName: null,
            fileData: null,
            fileType: null,
            bookId: null
        });
    const userHistory = useSelector((state) => state.userHistories.userHistory);
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
        dispatch(bagsActions.removeAllbook());
        dispatch(dashboardActions.cleanDashboard());
        dispatch(paginationActions.cleanPagination());
        history.push('/login');
    }

    const checkUserRole = (userRole) => {
        if (userRole === "ROLE_MEMBER" || userRole === "ROLE_USER") {
            history.push('/user/history');
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

    const dayStatus = (startDate) => {
        let todayDate = new Date();
        let formatStartDate = new Date(startDate);
        let totalDay = todayDate - formatStartDate;
        let formatTotalDay = totalDay / 86400000;
        return Math.floor(formatTotalDay) + 1;
    }

    const dayStatusStartEnd = (startDate, endDate) => {
        let formatStartDate = new Date(startDate);
        let formatEndDate = new Date(endDate);
        let totalDay = formatEndDate - formatStartDate;
        let formatTotalDay = totalDay / 86400000;
        return Math.floor(formatTotalDay) + 1;
    }

    const countFinePrice = (startRentalDate) => {
        let finePrice = 0;
        let countDayRental = dayStatus(startRentalDate);
        if (countDayRental > 5) {
            finePrice = (countDayRental - 5) * 1000;
        }
        return finePrice;
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

        searchRentalDetailsHistoryByUserIdAndTitleAndDate(`user/getuserrentaldetails/userid=${userProfile.id}`, jwtToken).then(res => {
            setRentalDetails(res.data);
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

        getRentalDetailsHistoryByUserId(`user/getrentalhistoriespagination/userid=${userProfile.id}&key=${keywordValue}?pageNo=${pagination.number}&pageSize=${pagination.size}`, jwtToken).then(res => {
            dispatch(userHistoryActions.setUserHistory(res.data.content))
            setPagination({
                first: res.data.first,
                last: res.data.last,
                totalPages: res.data.totalPages,
                empty: res.data.empty,
                number: res.data.number,
                size: res.data.size
            });
        }).catch(err => {
            console.log(err.response);
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

    }, [jwtToken, pagination.number, isSearch])

    return (
        <>
            <Header />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>My History</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/user/dashboard">User</Link></li>
                            <li className="breadcrumb-item active">History</li>
                        </ol>
                    </nav>
                </div>

                <section className="section profile">
                    <div className="d-flex justify-content-center">
                        <div className="row col-10">

                            {/* User Profile Card */}
                            <div className="col-4">
                                <div className="card">
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

                                        <div className="profile-overview col-12">
                                            <br />
                                            <div className="row mb-1">
                                                <div className="col-lg-4 col-md-4 label d-flex">Address</div>
                                                <div className="col-lg-8 col-md-8 d-flex">{userProfile.address}</div>
                                            </div>

                                            <div className="row mb-1">
                                                <div className="col-lg-4 col-md-4 label d-flex">Phone</div>
                                                <div className="col-lg-8 col-md-8 d-flex">{userProfile.phoneNumber}</div>
                                            </div>

                                            <div className="row mb-1">
                                                <div className="col-lg-4 col-md-4 label d-flex">Email</div>
                                                <div className="col-lg-8 col-md-8 d-flex">{userProfile.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* End User Profile Card */}

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

                    {/* Table User History */}
                    <div className="d-flex justify-content-center">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <h5 className="card-title">My History</h5>
                                        <div className="search-bar pt-3">
                                            <form className="search-form d-flex align-items-center" onSubmit={handlerSearch}>
                                                <input type="text" name="query" placeholder="Search by Title, Date..." title="Enter search keyword" onChange={changeKeyHandler} />
                                                <button type="button" className="btn btn-sm btn-primary py-1 ms-2" title="Search" onClick={(e) => handlerSearch(e)} > <i className="bi bi-search"></i></button>
                                            </form>
                                        </div>
                                    </div>

                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Book Title</th>
                                                <th scope="col">Rental Date</th>
                                                <th scope="col">Return Date</th>
                                                <th scope="col">Rental Time</th>
                                                <th scope="col">Price/Day</th>
                                                <th scope="col">Total Fine Price</th>
                                                <th scope="col">Total Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userHistory.rentalDetailsId !== null &&
                                                <>
                                                    {userHistory.map((dataUserHistory, index) => {
                                                        return (
                                                            <>
                                                                <tr>
                                                                    <td>{index + 1 + (pagination.number * 10)}</td>
                                                                    <td>{dataUserHistory.bookTitles}</td>
                                                                    <td>{formatDate(dataUserHistory.startRentalDate)}</td>
                                                                    <td>{formatDate(dataUserHistory.endRentalDate)}</td>
                                                                    <td className="text-center">
                                                                        {dayStatusStartEnd(dataUserHistory.startRentalDate, dataUserHistory.endRentalDate)} Days
                                                                    </td>
                                                                    <td>
                                                                        <CurrencyFormat
                                                                            value={dataUserHistory.rentalPrice}
                                                                            displayType={"text"}
                                                                            thousandSeparator={true}
                                                                            prefix={"Rp. "}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <CurrencyFormat
                                                                            value={dataUserHistory.finePrice}
                                                                            displayType={"text"}
                                                                            thousandSeparator={true}
                                                                            prefix={"Rp. "}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <CurrencyFormat
                                                                            value={dataUserHistory.totalPrice}
                                                                            displayType={"text"}
                                                                            thousandSeparator={true}
                                                                            prefix={"Rp. "}
                                                                        />
                                                                    </td>
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
                    {/* End Table User History */}
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
                </section>
            </main>
        </>
    )
}

export default UserHistory;