import Header from "../../component/Header";
import Card from "../../component/Card";
import image1 from '../../assets/img/slides-1.jpg';
import { useSelector, useDispatch } from "react-redux";
import { usersActions } from '../../store/usersReducer.js';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router';
import { useEffect, useState } from "react";
import { booksActions } from "../../store/booksReducer";
import { searchBooksByTitleOrAuthor } from "../../service/Fetch";
import { bagsActions } from "../../store/bagsReducer";
import swal from "sweetalert";
import { dashboardActions } from "../../store/dashboardReducer";
import { paginationActions } from "../../store/paginationReducer";

const UserBook = () => {
    const jwtToken = useSelector((state) => state.users.token);
    const [jwtTokenDecoded, setJwtTokenDecoded] = useState(null);
    const books = useSelector((state) => state.books.books);
    const userData = useSelector((state) => state.users.user);
    const pagination = useSelector((state) => state.pagination.pagination);
    const paginationKeyword = useSelector((state) => state.pagination.keywordValue);

    const dispatch = useDispatch();
    const history = useHistory();

    const logOut = () => {
        dispatch(usersActions.logout());
        dispatch(bagsActions.removeAllbook);
        dispatch(dashboardActions.cleanDashboard());
        dispatch(paginationActions.cleanPagination());
        history.push('/login');
    }

    const checkUserRole = (userRole) => {
        if (userRole === "ROLE_ADMIN" || userRole === "ROLE_STAFF") {
            history.push("/admin")
        } else {
            history.push('/');
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

    useEffect(async () => {
        if (jwtToken !== null) {
            const jwtDecoded = jwt_decode(jwtToken);
            checkExpToken(jwtDecoded.exp);
            checkUserRole(jwtDecoded.role);
            setJwtTokenDecoded(jwtDecoded);
        } else {
            history.push("/");
        }

        searchBooksByTitleOrAuthor(`getbookspagination/key=${paginationKeyword}?pageNo=${pagination.number}&pageSize=${pagination.size}`).then(res => {
            dispatch(booksActions.setBooks(res.data.content))
            dispatch(paginationActions.setPagination(res.data))
        }).catch(err => {
            if (typeof err.response.data === "string") {
                dispatch(paginationActions.cleanPagination())
                swal({
                    title: "Alert!",
                    text: err.response.data,
                    icon: "error"
                });
            } else {
                console.log(err.response);
                dispatch(paginationActions.cleanPagination())
            }
        })

    }, [jwtToken, pagination.number, paginationKeyword])

    return (
        <>
            <Header />
            <main id="main" className="main">
                <section className="section d-flex justify-content-center">
                    <div className="row col-12">
                        <div className="card">
                            <div className="card-body">
                                <br />
                                <img src={image1} className="d-block w-100" height="250" alt="..." />
                            </div>
                            <div className="card-title d-flex justify-content-center">
                                <h5>Find Your Favorite Book Below</h5>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section d-flex justify-content-center">
                    <div className="row col-9 d-flex justify-content-center">
                        {books.id !== null &&
                            <>
                                {books.map((book) => {
                                    return (
                                        <Card key={book.id} data={book} userData={userData} />
                                    )
                                })}
                            </>
                        }
                    </div>
                </section>

                <section className="section d-flex justify-content-center">

                    {(!pagination.empty) &&
                        <>
                            <nav>
                                <ul className="pagination">

                                    <li className={pagination.first ? "page-item disabled" : "page-item"}>
                                        <div className="page-link" style={{ cursor: "pointer" }} onClick={() => dispatch(paginationActions.setPaginationPageNumber(pagination.number - 1))}>Previous</div>
                                    </li>

                                    {Array.from(Array(pagination.totalPages), (event, index) => {
                                        return (
                                            <>
                                                <li className={pagination.number === index ? "page-item active" : "page-item"}>
                                                    <div className="page-link" style={{ cursor: "pointer" }} onClick={() => dispatch(paginationActions.setPaginationPageNumber(index))}>{index + 1}</div>
                                                </li>
                                            </>
                                        );
                                    })
                                    }

                                    <li className={pagination.last ? "page-item disabled" : "page-item"}>
                                        <div className="page-link" style={{ cursor: "pointer" }} onClick={() => dispatch(paginationActions.setPaginationPageNumber(pagination.number + 1))}>Next</div>
                                    </li>
                                </ul>
                            </nav>
                        </>
                    }
                </section>

            </main>
        </>
    )
}

export default UserBook;