import { Link } from "react-router-dom";
import Header from '../../component/Header.js';
import Sidebar from '../../component/Sidebar.js'
import { useSelector, useDispatch } from "react-redux";
import { usersActions } from '../../store/usersReducer.js';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import { searchHistoryRentalByNameOrTitleOrDate } from "../../service/Fetch.js";
import { format } from "date-fns";
import CurrencyFormat from 'react-currency-format';
import { historyActions } from "../../store/historyReducer.js";
import swal from "sweetalert";
import { dashboardActions } from "../../store/dashboardReducer.js";
import { paginationActions } from "../../store/paginationReducer.js";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const AdminHistory = () => {
    const jwtToken = useSelector((state) => state.users.token);
    const [jwtTokenDecoded, setJwtTokenDecoded] = useState(null);
    const rentalHistory = useSelector((state) => state.history.historyRental);
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
            history.push('/admin/history');
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

    const handlerDetail = (historyRental) => {
        history.push(`/admin/history/detail/${historyRental.rentalId}`, { data: historyRental })
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

    const dayStatus = (startDate, endDate) => {
        let formatStartDate = new Date(startDate);
        let formatEndDate = new Date(endDate);
        let totalDay = formatEndDate - formatStartDate;
        let formatTotalDay = totalDay / 86400000;
        return Math.floor(formatTotalDay) + 1;
    }

    const exportPDF = async () => {
        const fetchData = await searchHistoryRentalByNameOrTitleOrDate(`admin/getalldetailsrentalhistoryforpdf/key=${keywordValue}`, jwtToken);
        const unit = "pt";
        const size = "A4";
        const orientation = "landscape";

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(14);

        const title = "List History";
        const headers = [["NO", "USER", "RENTAL DATE", "RETURN DATE", "RENTAL TIME", "BOOK", "PRICE", "FINE PRICE", "TOTAL"]];

        console.log(fetchData);
        const data = fetchData.data.map((rentalHistory, index) =>
            [(index + 1),
            rentalHistory.usersFirstName + " " + rentalHistory.usersLastName,
            formatDate(rentalHistory.startRentalDate),
            formatDate(rentalHistory.endRentalDate),
            dayStatus(rentalHistory.startRentalDate, rentalHistory.endRentalDate),
            rentalHistory.bookTitles,
            rentalHistory.rentalPrice.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
            }),
            rentalHistory.finePrice.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
            }),
            rentalHistory.totalPrice.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
            })
            ]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("REPORT HISTORY " + new Date() + ".pdf")
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

        searchHistoryRentalByNameOrTitleOrDate(`admin/getrentalhistorypagination/key=${keywordValue}?pageNo=${pagination.number}&pageSize=${pagination.size}`, jwtToken).then(res => {
            dispatch(historyActions.setHistoryRental(res.data.content));
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
                    <h1>History Data</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Admin</Link></li>
                            <li className="breadcrumb-item active">History</li>
                        </ol>
                    </nav>
                </div>
                {/* <!-- End Page Title --> */}

                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">History Table</h5>

                                    <button type="button" className="btn btn-success" onClick={() => exportPDF()}><i className="fas fa-download fa-sm text-white-50"></i> Export PDF</button>

                                    <div className="search-bar float-end">
                                        <form className="search-form d-flex align-items-center" onSubmit={handlerSearch}>
                                            <input type="text" name="query" placeholder="Search by Name, Title, Date..." title="Enter search keyword" onChange={changeKeyHandler} />
                                            <button type="button" className="btn btn-sm btn-primary py-1 ms-2" title="Search" onClick={(e) => handlerSearch(e)}><i className="bi bi-search"></i></button>
                                        </form>
                                    </div>

                                    {/* <!-- Table with stripped rows --> */}
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">User</th>
                                                <th scope="col">Rental Date</th>
                                                <th scope="col">Book Count</th>
                                                <th scope="col">Total Price</th>
                                                <th className="text-end" scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rentalHistory.userId !== null &&
                                                <>
                                                    {rentalHistory.map((data, index) => {
                                                        return (
                                                            <>
                                                                <tr>
                                                                    <td>{index + 1 + (pagination.number * 10)}</td>
                                                                    <td>{data.firstName} {data.lastName}</td>
                                                                    <td>{formatDate(data.startRentalDate)}</td>
                                                                    <td className="text-center">{data.bookCount}</td>
                                                                    <td>
                                                                        <CurrencyFormat
                                                                            value={data.allTotalPrice}
                                                                            displayType={"text"}
                                                                            thousandSeparator={true}
                                                                            prefix={"Rp. "}
                                                                        />
                                                                    </td>
                                                                    <td className="text-end"><button type="button" className="btn btn-info ms-1" onClick={() => handlerDetail(data)}><i className="bi bi-file-text"></i></button></td>
                                                                </tr>
                                                            </>
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
        </>
    )
}

export default AdminHistory;