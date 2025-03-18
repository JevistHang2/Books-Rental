import { Link } from "react-router-dom";
import Header from "../../component/Header";
import { useSelector, useDispatch } from "react-redux";
import { usersActions } from '../../store/usersReducer.js';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router';
import { useEffect, useState } from "react";
import { getDashboardUser } from "../../service/Fetch";
import { dashboardActions } from "../../store/dashboardReducer";
import CurrencyFormat from 'react-currency-format';
import swal from "sweetalert";
import { paginationActions } from "../../store/paginationReducer";

const UserDashboard = () => {
    const jwtToken = useSelector((state) => state.users.token);
    const [jwtTokenDecoded, setJwtTokenDecoded] = useState(null);
    const userProfile = useSelector((state) => state.users.user);
    const dashboardData = useSelector((state) => state.dashboard.dashboardData);

    const dispatch = useDispatch();
    const history = useHistory();

    const logOut = () => {
        dispatch(usersActions.logout());
        dispatch(dashboardActions.cleanDashboard());
        dispatch(paginationActions.cleanPagination());
        history.push('/login');
    }

    const checkUserRole = (userRole) => {
        if (userRole === "ROLE_MEMBER" || userRole === "ROLE_USER") {
            history.push('/user/dashboard');
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

        getDashboardUser(`user/getdatadashboard/userid=${userProfile.id}`, jwtToken).then(res => {
            dispatch(dashboardActions.setDashboard(res.data));
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
    }, [jwtToken])

    return (
        <>
            <Header />

            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Home</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/user/dashboard">User</Link></li>
                            <li className="breadcrumb-item active">Dashboard</li>
                        </ol>
                    </nav>
                </div>
                <section className="section dashboard">
                    <div className="row d-flex justify-content-center">

                        {/* <!-- Left side columns --> */}
                        <div className="col-lg-8">
                            <div className="row">

                                {/* <!-- Book Rentaled Card --> */}
                                <div className="col-xxl-4 col-md-6">
                                    <div className="card info-card sales-card">

                                        <div className="card-body">
                                            <h5 className="card-title">Book Rentaled <span>| This Month</span></h5>

                                            <div className="d-flex align-items-center">
                                                <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                    <i className="fas fa-book"></i>
                                                </div>
                                                <div className="ps-3">
                                                    {dashboardData.countRentalBookThisMonth !== null &&
                                                        <h6>{dashboardData.countRentalBookThisMonth} Books</h6>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                {/* <!-- End Book rentaled Card --> */}

                                {/* <!-- Book Returned Card --> */}
                                <div className="col-xxl-4 col-md-6">
                                    <div className="card info-card customers-card">

                                        <div className="card-body">
                                            <h5 className="card-title">Book On Rental <span>| This Month</span></h5>

                                            <div className="d-flex align-items-center">
                                                <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                    <i className="fas fa-shopping-bag"></i>
                                                </div>
                                                <div className="ps-3">
                                                    {dashboardData.countBookOnRentalThisMonth !== null &&
                                                        <h6>{dashboardData.countBookOnRentalThisMonth} Books</h6>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                {/* <!-- End Book Returned Card --> */}

                                {/* <!-- Income Card --> */}
                                <div className="col-xxl-4 col-xl-12">

                                    <div className="card info-card revenue-card">

                                        <div className="card-body">
                                            <h5 className="card-title">Cost Rental <span>| This Month</span></h5>

                                            <div className="d-flex align-items-center">
                                                <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                    <i className="fas fa-money-bill-wave"></i>
                                                </div>
                                                <div className="ps-3">
                                                    {
                                                        dashboardData.sumIncomeThisMonth !== null &&
                                                        <h6>
                                                            <CurrencyFormat
                                                                value={dashboardData.sumIncomeThisMonth}
                                                                displayType={"text"}
                                                                thousandSeparator={true}
                                                                prefix={"Rp. "}
                                                            />
                                                        </h6>
                                                    }
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                                {/* <!-- End Income Card --> */}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default UserDashboard;