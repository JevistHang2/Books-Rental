import { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import { updateUserData } from "../../service/Fetch.js";
import { useSelector } from "react-redux";
import swal from "sweetalert";

const AdminUserStaffEditForm = props => {

    const [editUserValue, setEditUserValue] = useState(props.userData);
    const history = useHistory();
    const jwtToken = useSelector((state) => state.users.token);

    useEffect(() => {
        setEditUserValue(props.userData)
    }, [props])

    const changeHandler = e => {
        setEditUserValue({ ...editUserValue, [e.target.name]: e.target.value })
    }

    const handlerEdit = (e) => {
        e.preventDefault();
        updateUserData("admin/edituser", editUserValue, jwtToken).then(res => {
            swal({
                text: res.data,
                icon: "success"
            }).then(() => {
                history.push("/admin/staff");
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

    return (
        <div className="modal fade" id={`editstaff${editUserValue.id}`} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Staff</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form className="row g-3 needs-validation" novalidate onSubmit={(e) => handlerEdit(e)}>
                            <div className="col-12">
                                <label htmlFor="firstName" className="form-label">First Name</label>
                                <input type="text" name="firstName" className="form-control" id="firstName" value={editUserValue.firstName} onChange={changeHandler} required />
                            </div>

                            <div className="col-12">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <input type="text" name="lastName" className="form-control" id="lastName" value={editUserValue.lastName} onChange={changeHandler} required />
                            </div>

                            <div className="col-12">
                                <label htmlFor="address" className="form-label">Address</label>
                                <input type="text" min="0" name="address" className="form-control" id="address" value={editUserValue.address} onChange={changeHandler} required />
                            </div>

                            <div className="col-12">
                                <label htmlFor="phoneNumber" className="form-label">Phone</label>
                                <input type="text" min="0" name="phoneNumber" className="form-control" id="phoneNumber" value={editUserValue.phoneNumber} onChange={changeHandler} required />
                            </div>

                            <div className="col-12">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" min="0" name="email" className="form-control" id="email" value={editUserValue.email} onChange={changeHandler} required />
                            </div>

                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">Edit</button>
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AdminUserStaffEditForm;