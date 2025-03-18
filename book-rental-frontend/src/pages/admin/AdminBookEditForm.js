import { useState } from "react";
import { updateBook } from "../../service/Fetch";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory } from "react-router";
import swal from "sweetalert";
import { editBookImages } from "../../service/Fetch";

const AdminBookEditForm = props => {
    const [editBookValue, setEditBookValue] = useState(props.bookData);
    const history = useHistory();

    useEffect(() => {
        setEditBookValue(props.bookData)
    }, [props])

    const bookTypes = props.bookTypeData;
    const jwtToken = useSelector((state) => state.users.token);

    const changeHandler = e => {
        setEditBookValue({ ...editBookValue, [e.target.name]: e.target.value })
    }

    const changeCategoryHandler = e => {
        setEditBookValue({ ...editBookValue, [e.target.name]: { id: e.target.value } })
    }

    const [bookImageFile, setBookImageFile] = useState(null);

    const changeImageHandler = e => {
        let file = e.target.files[0];
        setBookImageFile(file)
    }

    const handlerEdit = (e) => {
        e.preventDefault();
        updateBook("admin/updatebook", editBookValue, jwtToken).then(res => {
            let formData = new FormData();
            formData.append("bookId", res.data);
            formData.append("file", bookImageFile);
            editBookImages("admin/editbookimages", formData, jwtToken).then(res => {
                swal({
                    text: res.data,
                    icon: "success"
                }).then(() => {
                    history.push("/admin/book");
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
        <div className="modal fade" id={`editBook${editBookValue.id}`} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Book</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form className="row g-3 needs-validation" novalidate onSubmit={(e) => handlerEdit(e)}>
                            <div className="col-12">
                                <label htmlFor="id" className="form-label required">Book Id</label>
                                <input type="number" name="title" className="form-control" id="id" value={editBookValue.id} onChange={changeHandler} disabled />
                            </div>
                            <div className="col-12">
                                <label htmlFor="title" className="form-label required">Title</label>
                                <input type="text" name="title" className="form-control" id="title" value={editBookValue.title} onChange={changeHandler} required />
                            </div>

                            <div className="col-12">
                                <label htmlFor="author" className="form-label required">Author</label>
                                <input type="text" name="author" className="form-control" id="author" value={editBookValue.author} onChange={changeHandler} required />
                            </div>

                            <div className="col-12">
                                <label htmlFor="type" className="form-label required">Category</label>
                                <select className="form-control form-select" aria-label="" name="type" id="type" onChange={changeCategoryHandler}>
                                    <option defaultValue>{props.bookData.type.name}</option>
                                    {bookTypes.id !== null &&
                                        <>
                                            {bookTypes.map((category) => {
                                                if (category.name !== props.bookData.type.name)
                                                    return (
                                                        <option value={category.id}>{category.name} </option>
                                                    )
                                            }
                                            )}
                                        </>
                                    }
                                </select>
                            </div>

                            <div className="col-12">
                                <label htmlFor="stock" className="form-label required">Stock</label>
                                <input type="number" min="0" name="stock" className="form-control" id="stock" value={editBookValue.stock} onChange={changeHandler} required />
                            </div>

                            <div className="col-12">
                                <label htmlFor="price" className="form-label required">Price/Day</label>
                                <input type="number" min="0" name="price" className="form-control" id="price" value={editBookValue.price} onChange={changeHandler} required />
                            </div>

                            <div className="col-12">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea type="text" name="description" className="form-control" id="description" value={editBookValue.description} onChange={changeHandler} />
                            </div>

                            <div className="col-12">
                                <label htmlFor="formFileMultiple">Image Book</label>
                                <input className="form-control" type="file" accept='image/*' name="bookImage" id="bookImage" onChange={changeImageHandler} required></input>
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

export default AdminBookEditForm;