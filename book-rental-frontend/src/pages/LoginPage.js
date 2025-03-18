import Logo_Nexbook from '../assets/img/logo_book.png'
import { Link } from "react-router-dom";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postLogin } from '../service/Fetch';
import { usersActions } from '../store/usersReducer';
import { useHistory } from 'react-router';
import swal from 'sweetalert';
import { paginationActions } from '../store/paginationReducer';

const LoginPage = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [loginValues, setLoginValues] = useState({
        username: null,
        password: null
    });

    const changeHandler = e => {
        setLoginValues({ ...loginValues, [e.target.name]: e.target.value })
    }

    const handlerLogin = (e) => {
        if (loginValues.username === null || loginValues.password === null) {
            console.log("Please fill required field");
        } else {
            e.preventDefault();
            postLogin("login", loginValues)
                .then(res => {
                    dispatch(usersActions.login(res.data))
                    dispatch(paginationActions.cleanPagination())
                    history.push("/")
                })
                .catch(err => {
                    if (typeof err.response.data === "string") {
                        swal({
                            title: "Alert!",
                            text: err.response.data,
                            icon: "error"
                          });
                    } else {
                        swal({
                            title: "Alert!",
                            text: err.response.data,
                            icon: "error"
                          });
                    }
                })
        }
    }

    return (
        <>
            <main>
                <div className="container">

                    <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                                    <div className="d-flex justify-content-center py-4">
                                        <Link to="/">
                                            <div className="logo d-flex align-items-center w-auto">
                                                <img src={Logo_Nexbook} alt="Logo NexBook" />
                                                <span className="d-lg-block">NexBook</span>
                                            </div>
                                        </Link>
                                    </div>

                                    <div className="card mb-3">

                                        <div className="card-body">

                                            <div className="pt-4 pb-2">
                                                <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                                                <p className="text-center small">Enter your username & password to login</p>
                                            </div>

                                            <form className="row g-3 needs-validation" novalidate>

                                                <div className="col-12">
                                                    <label htmlFor="username" className="form-label">Username</label>
                                                    <div className="input-group has-validation">
                                                        <input type="text" name="username" className="form-control" id="username" onChange={changeHandler} required />
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <label htmlFor="password" className="form-label">Password</label>
                                                    <input type="password" name="password" className="form-control" id="password" onChange={changeHandler} required />
                                                </div>

                                                <div className="col-12">
                                                    <button type="submit" className="btn btn-primary w-100" onClick={handlerLogin}>Login</button>
                                                </div>
                                                <div className="col-12">
                                                    <p className="small mb-0">Don't have account? <Link to={"/register"}>Create an account</Link></p>
                                                </div>
                                            </form>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </section>

                </div>
            </main >
        </>
    )
}

export default LoginPage;