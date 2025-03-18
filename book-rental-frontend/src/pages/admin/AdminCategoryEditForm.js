import { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import { updateBookTypes } from "../../service/Fetch.js";
import { useSelector } from "react-redux";
import swal from "sweetalert";

const AdminCategoryEditForm = props => {

    const [editCategoryValue, setEditCategoryValue] = useState(props.categoryData);
    const history = useHistory();
    const jwtToken = useSelector((state) => state.users.token);

    useEffect(() => {
        setEditCategoryValue(props.categoryData)
    }, [props])

    const changeHandler = e => {
        setEditCategoryValue({ ...editCategoryValue, [e.target.name]: e.target.value })
    }

    const handlerEdit = (e) => {
        e.preventDefault();
        updateBookTypes("admin/updatebooktypes", editCategoryValue, jwtToken).then(res => {
            swal({
                text: res.data,
                icon: "success"
            }).then(() => {
                history.push("/admin/category");
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
        <div className="modal fade" id={`editCategory${editCategoryValue.id}`} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Category</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form className="row g-3 needs-validation" novalidate onSubmit={(e) => handlerEdit(e)}>
                            <div className="col-12">
                                <label htmlFor="name" className="form-label required">Category</label>
                                <input type="text" name="name" className="form-control" id="name" value={editCategoryValue.name} onChange={changeHandler} required />
                            </div>

                            <div className="col-12">
                                <label htmlFor="code" className="form-label required">Category Book Code</label>
                                <input type="code" name="code" className="form-control" id="code" value={editCategoryValue.code} onChange={changeHandler} disabled />
                            </div>

                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary" >Edit</button>
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AdminCategoryEditForm;