import Logo_Nexbook from '../assets/img/logo_book.png'
import { Link } from "react-router-dom";
import '../assets/css/labelTextInput.css'
import { useState } from 'react';
import { postForm } from '../service/Fetch';
import { useHistory } from 'react-router';
import swal from 'sweetalert';

const RegisterPage = () => {
    const history = useHistory();
    const [allValues, setAllValues] = useState({
        firstName: null,
        lastName: null,
        email: null,
        userName: null,
        password: null,
        address: null,
        phoneNumber: null
    });

    const changeHandler = e => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value })
    }

    const handlerSubmit = (e) => {
        e.preventDefault();

        postForm("user/register", allValues)
            .then(res => {
                swal({
                    text: res.data,
                    icon: "success"
                });
                history.push("/login")
            })
            .catch(err => {
                if (typeof err.response.data === "string") {
                    swal({
                        title: "Alert!",
                        text: err.response.data,
                        icon: "error"
                    });
                } else {
                    let message = "";
                    err.response.data.message.map((dataError) => {
                        message = message + dataError;
                    });
                    swal({
                        title: "Alert!",
                        text: message,
                        icon: "error"
                    });
                }
            })
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
                                                <h5 className="card-title text-center pb-0 fs-4">Create an Account</h5>
                                                <p className="text-center small">Enter your personal details to create account</p>
                                            </div>

                                            <form className="row g-3 needs-validation" novalidate onSubmit={(e) => handlerSubmit(e)}>
                                                <div className="col-12">
                                                    <label htmlFor="firstName" className="form-label required">First Name</label>
                                                    <input type="text" name="firstName" className="form-control" id="firstName" onChange={changeHandler} required />
                                                </div>

                                                <div className="col-12">
                                                    <label htmlFor="lastName" className="form-label">Last Name</label>
                                                    <input type="text" name="lastName" className="form-control" id="lastName" onChange={changeHandler} />
                                                </div>

                                                <div className="col-12">
                                                    <label htmlFor="email" className="form-label required">Email</label>
                                                    <div className="input-group has-validation">
                                                        <input type="email" name="email" className="form-control" id="email" onChange={changeHandler} required />
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <label htmlFor="userName" className="form-label required">Username</label>
                                                    <input type="text" name="userName" className="form-control" id="userName" onChange={changeHandler} required />
                                                </div>

                                                <div className="col-12">
                                                    <label htmlFor="password" className="form-label required">Password</label>
                                                    <input type="password" name="password" className="form-control" id="password" onChange={changeHandler} required />
                                                </div>

                                                <div className="col-12">
                                                    <label htmlFor="address" className="form-label">Address</label>
                                                    <input type="text" name="address" className="form-control" id="address" onChange={changeHandler} />
                                                </div>

                                                <div className="col-12">
                                                    <label htmlFor="phoneNumber" className="form-label required">Phone Number</label>
                                                    <input type="text" name="phoneNumber" className="form-control" id="phoneNumber" onChange={changeHandler} required />
                                                </div>

                                                <div className="col-12">
                                                    <button className="btn btn-primary w-100" type="submit">Create Account</button>
                                                </div>
                                                <div className="col-12">
                                                    <p className="small mb-0">Already have an account? <Link to="/login">Login</Link></p>
                                                </div>
                                            </form>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </section>

                </div>
            </main>
        </>
    )
}

export default RegisterPage;