import { Link } from "react-router-dom";
import Header from '../../component/Header.js';
import Sidebar from '../../component/Sidebar.js'
import { useSelector, useDispatch } from "react-redux";
import { usersActions } from '../../store/usersReducer.js';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import Profile_Image from "../../assets/img/profile_blank.jpg"
import { updateUserData, editProfileImages, deleteProfileImages, getProfileImageByUserId, changeUserPassword } from "../../service/Fetch.js";
import swal from "sweetalert";
import { dashboardActions } from "../../store/dashboardReducer.js";
import { paginationActions } from "../../store/paginationReducer.js";

const AdminProfilePage = () => {
    const jwtToken = useSelector((state) => state.users.token);
    const [jwtTokenDecoded, setJwtTokenDecoded] = useState(null);
    const userProfile = useSelector((state) => state.users.user);
    const [editUserProfile, setEditUserProfile] = useState(userProfile);
    const [bookImage, setBookImage] = useState(
        {
            fileName: null,
            fileData: null,
            fileType: null,
            bookId: null
        });

    const changeHandler = e => {
        setEditUserProfile({ ...editUserProfile, [e.target.name]: e.target.value })
    }

    const handlerEdit = (e) => {
        updateUserData("admin/edituser", editUserProfile, jwtToken).then(res => {
            dispatch(usersActions.editUser(editUserProfile));
            swal({
                text: res.data,
                icon: "success"
            }).then(() => {
                history.push("/admin/profile_admin");
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

    const modalAlertEdit = () => {
        return (
            <div className="modal fade" id={`alertEdit${userProfile.id}`} tabindex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Warning</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are You Sure Want to Edit Profile?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                            <div type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => handlerEdit()}>Yes</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const modalAlertDeleteImages = () => {
        return (
            <div className="modal fade" id={`alertDeleteImage${userProfile.id}`} tabindex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Warning</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are You Sure Want to Delete Profile Image?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={(e) => handlerDeleteProfileImage(e)}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const modalAlertEditPassword = () => {
        return (
            <div className="modal fade" id={`alertEditPassword${userProfile.id}`} tabindex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Warning</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are You Sure Want to Change Password?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={(e) => handlerChangePassword(e)}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const modalEditImages = () => {
        return (
            <div className="modal fade" id={`alertEditImage${userProfile.id}`} tabindex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Images</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className="row g-3 needs-validation" novalidate onSubmit={(e) => handlerEditProfileImage(e)}>
                                <div className="col-12">
                                    <label htmlFor="formFileMultiple">Image Book</label>
                                    <input className="form-control" type="file" accept='image/*' name="bookImage" id="bookImage" onChange={changeImageHandler} required></input>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">No</button>
                                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Yes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

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
            history.push('/admin/profile_admin');
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

    const [bookImageFile, setBookImageFile] = useState(null);

    const changeImageHandler = e => {
        let file = e.target.files[0];
        setBookImageFile(file)
    }

    const handlerEditProfileImage = (e) => {
        e.preventDefault()
        let formData = new FormData();
        formData.append("userId", userProfile.id);
        formData.append("file", bookImageFile);
        editProfileImages("updateprofileimages", formData, jwtToken).then(res => {
            swal({
                text: res.data,
                icon: "success"
            }).then(() => {
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

    const handlerDeleteProfileImage = (e) => {
        e.preventDefault()
        deleteProfileImages("deleteprofileimages", userProfile, jwtToken).then(res => {
            swal({
                text: res.data,
                icon: "success"
            }).then(() => {
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

    const [editPasswordValue, setEditPasswordValue] = useState(
        {
            userId: userProfile.id,
            currentPassword: null,
            newPassword: null,
            renewPassword: null
        })

    const handlerChangePasswordValue = e => {
        setEditPasswordValue({ ...editPasswordValue, [e.target.name]: e.target.value })
    }

    const handlerChangePassword = (e) => {
        e.preventDefault();
        changeUserPassword("edituserpassword", editPasswordValue, jwtToken).then(res => {
            swal({
                text: res.data,
                icon: "success"
            }).then(() => {
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

    useEffect(() => {
        if (jwtToken !== null) {
            const jwtDecoded = jwt_decode(jwtToken);
            checkExpToken(jwtDecoded.exp);
            checkUserRole(jwtDecoded.role);
            setJwtTokenDecoded(jwtDecoded);
        } else {
            history.push("/");
        }
        setEditUserProfile(userProfile);

        getProfileImageByUserId(`getprofileimages/userid=${userProfile.id}`, jwtToken).then(res => {
            setBookImage(res.data)
        }).catch(err => {
            console.log(err.response);
            setBookImage(
                { fileData: null })
        })
    }, [jwtToken, userProfile])

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Profile</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Admin</Link></li>
                            <li className="breadcrumb-item active">Profile Data</li>
                        </ol>
                    </nav>
                </div>
                <section className="section profile">
                    <div className="row">
                        <div className="col-xl-4">

                            {userProfile.role !== null &&
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

                                        <h2>{userProfile.firstName} {userProfile.lastName}</h2>
                                        <h3>{userProfile.role.slice(5)}</h3>
                                    </div>
                                </div>
                            }

                        </div>

                        <div className="col-xl-8">

                            <div className="card">
                                <div className="card-body pt-3">
                                    {/* <!-- Bordered Tabs --> */}
                                    <ul className="nav nav-tabs nav-tabs-bordered">

                                        <li className="nav-item">
                                            <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Overview</button>
                                        </li>

                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit">Edit Profile</button>
                                        </li>

                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-change-password">Change Password</button>
                                        </li>

                                    </ul>
                                    <div className="tab-content pt-2">

                                        <div className="tab-pane fade show active profile-overview" id="profile-overview">
                                            <h5 className="card-title">Profile Details</h5>

                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label ">Full Name</div>
                                                <div className="col-lg-9 col-md-8">{userProfile.firstName} {userProfile.lastName}</div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">Address</div>
                                                <div className="col-lg-9 col-md-8">{userProfile.address}</div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">Phone</div>
                                                <div className="col-lg-9 col-md-8">{userProfile.phoneNumber}</div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">Email</div>
                                                <div className="col-lg-9 col-md-8">{userProfile.email}</div>
                                            </div>

                                            {userProfile.role !== null &&
                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">Role Status</div>
                                                    <div className="col-lg-9 col-md-8">{userProfile.role.slice(5)}</div>
                                                </div>
                                            }

                                        </div>

                                        <div className="tab-pane fade profile-edit pt-3" id="profile-edit">

                                            {/* <!-- Profile Edit Form --> */}

                                            <div className="row mb-3">
                                                <label htmlFor="profileImage" className="col-md-4 col-lg-3 col-form-label">Profile Image</label>
                                                <div className="col-md-8 col-lg-9">
                                                    {bookImage.fileData !== null ?
                                                        <>
                                                            <img style={{ height: "120px", maxWidth: "120px" }} src={`data:${bookImage.fileType};base64, ` + bookImage.fileData
                                                            } alt={bookImage.fileName} />
                                                        </>
                                                        :
                                                        <>
                                                            <img style={{ height: "120px", maxWidth: "120px" }} src={Profile_Image} alt="Profile" />
                                                        </>
                                                    }
                                                    <div className="pt-2">
                                                        <button className="btn btn-primary btn-sm" title="Upload new profile image" data-bs-toggle="modal" data-bs-target={`#alertEditImage${userProfile.id}`}><i className="bi bi-upload"></i></button>
                                                        {modalEditImages()}
                                                        <button className="btn btn-danger btn-sm" title="Remove my profile image" data-bs-toggle="modal" data-bs-target={`#alertDeleteImage${userProfile.id}`}><i className="bi bi-trash"></i></button>
                                                        {modalAlertDeleteImages()}
                                                    </div>
                                                </div>
                                            </div>
                                            <form>
                                                <div className="row mb-3">
                                                    <label htmlFor="firstName" className="col-md-4 col-lg-3 col-form-label">First Name</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="firstName" type="text" className="form-control" id="firstName" value={editUserProfile.firstName} onChange={changeHandler} />
                                                    </div>
                                                </div>

                                                <div className="row mb-3">
                                                    <label htmlFor="lastName" className="col-md-4 col-lg-3 col-form-label">Last Name</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="lastName" type="text" className="form-control" id="lastName" value={editUserProfile.lastName} onChange={changeHandler} />
                                                    </div>
                                                </div>

                                                <div className="row mb-3">
                                                    <label htmlFor="address" className="col-md-4 col-lg-3 col-form-label">Address</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="address" type="text" className="form-control" id="address" value={editUserProfile.address} onChange={changeHandler} />
                                                    </div>
                                                </div>

                                                <div className="row mb-3">
                                                    <label htmlFor="phone" className="col-md-4 col-lg-3 col-form-label">Phone</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="phone" type="text" className="form-control" id="phone" value={editUserProfile.phoneNumber} onChange={changeHandler} />
                                                    </div>
                                                </div>

                                                <div className="row mb-3">
                                                    <label htmlFor="email" className="col-md-4 col-lg-3 col-form-label">Email</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="email" type="email" className="form-control" id="email" value={editUserProfile.email} onChange={changeHandler} />
                                                    </div>
                                                </div>

                                                <div className="text-center">
                                                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#alertEdit${userProfile.id}`}>Save Changes</button>
                                                    {modalAlertEdit()}
                                                </div>
                                            </form>
                                            {/* <!-- End Profile Edit Form --> */}

                                        </div>

                                        <div className="tab-pane fade pt-3" id="profile-change-password">
                                            {/* <!-- Change Password Form --> */}
                                            <form>

                                                <div className="row mb-3">
                                                    <label htmlFor="currentPassword" className="col-md-4 col-lg-3 col-form-label">Current Password</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="currentPassword" type="password" className="form-control" id="currentPassword" onChange={handlerChangePasswordValue} />
                                                    </div>
                                                </div>

                                                <div className="row mb-3">
                                                    <label htmlFor="newPassword" className="col-md-4 col-lg-3 col-form-label">New Password</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="newPassword" type="password" className="form-control" id="newPassword" onChange={handlerChangePasswordValue} />
                                                    </div>
                                                </div>

                                                <div className="row mb-3">
                                                    <label htmlFor="renewPassword" className="col-md-4 col-lg-3 col-form-label">Re-enter New Password</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="renewPassword" type="password" className="form-control" id="renewPassword" onChange={handlerChangePasswordValue} />
                                                    </div>
                                                </div>
                                                
                                                <div className="text-center">
                                                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#alertEditPassword${userProfile.id}`} >Change Password</button>
                                                    {modalAlertEditPassword()}
                                                </div>
                                            </form>

                                            {/* <!-- End Change Password Form --> */}

                                        </div>

                                    </div>
                                    {/* <!-- End Bordered Tabs --> */}

                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default AdminProfilePage;