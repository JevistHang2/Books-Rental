import { useHistory } from "react-router";
import image_card from "../assets/img/card.jpg";
import { useSelector, useDispatch } from "react-redux";
import CurrencyFormat from 'react-currency-format';
import { bagsActions } from "../store/bagsReducer";
import swal from "sweetalert";
import { useState } from "react";
import { getImageByBookId, getRentalDetailsByUserId } from "../service/Fetch";
import { useEffect } from "react";

const Card = props => {
    const jwtToken = useSelector((state) => state.users.token);
    const bookData = props.data;
    const userData = props.userData;
    const userRole = useSelector((state) => state.users.user.role);
    const [bookImage, setBookImage] = useState(
        {
            fileName: null,
            fileData: null,
            fileType: null,
            bookId: null
        });
    const bookOnBag = useSelector((state) => state.bags.bags.books);
    const [buttonDisable, setButtonDisable] = useState(false);
    const countBook = useSelector((state) => state.bags.countBook);

    const history = useHistory();
    const dispatch = useDispatch();

    const handlerDetail = (book) => {
        history.push(`/user/book_detail/${book.id}`, { data: book })
    }

    const handlerAddBook = () => {
        if (userRole === null) {
            swal({
                title: "Information!",
                text: "Please Login to Add Book",
                icon: "info"
            }).then(() => {
                history.push("/login")
            });
        }
        else {
            dispatch(bagsActions.addBook(bookData))
            dispatch(bagsActions.addUser(userData))
        }
    }

    useEffect(() => {
        let bookId = bookData.id;
        getImageByBookId(`getimage/bookid=${bookId}`).then(res => {
            setBookImage(res.data)
        }).catch(err => {
            console.log(err.response);
            setBookImage(
                { fileData: null })
        })

        if (userData.id !== null) {
            getRentalDetailsByUserId(`user/getuserrentaldetails/userid=${userData.id}`, jwtToken).then(res => {
                res.data.map((book) => {
                    if (book.booksId === bookData.id) {
                        setButtonDisable(true);
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
                }
            });
        }

        bookOnBag.map((book) => {
            if (book.id === bookData.id) {
                setButtonDisable(true);
            }
        })
    }, [countBook])

    return (
        <>
            {/* <!-- Card with an image on top --> */}
            <div className="col-4" style={{ width: "18rem", height: "650" }}>
                <div className="card">
                    {typeof bookImage === "string" ?
                        <>
                            <img style={{ height: "300px", maxWidth: "100%" }} src={image_card} alt={bookImage.fileName} className="card-img-top" />
                        </>
                        :
                        <>
                            {bookImage.fileData !== null ?
                                <>
                                    <img style={{ height: "300px", maxWidth: "100%" }} src={`data:${bookImage.fileType};base64, ` + bookImage.fileData
                                    } className="img-fluid rounded-start" alt={bookImage.fileName} />
                                </>
                                :
                                <>
                                    <img style={{ height: "300px", maxWidth: "100%" }} src={image_card} alt={bookImage.fileName} className="card-img-top" />
                                </>
                            }
                        </>
                    }

                    <div className="card-body">
                        <h5 className="card-title d-flex justify-content-center">{bookData.title.slice(0, 19)}{bookData.title.length > 20 && "..."}</h5>
                        <div className="row pb-2">
                            <div className="col-lg-4 label_detailbook d-flex">Type</div>
                            <div className="col-lg-8 d-flex">{bookData.type.name.slice(0, 12)}{bookData.type.length > 11 && "..."}</div>
                        </div>
                        <div className="row pb-2">
                            <div className="col-lg-4 label_detailbook d-flex">Author</div>
                            <div className="col-lg-8 d-flex">{bookData.author.slice(0, 13)}{bookData.author.length > 12 && "..."}</div>
                        </div>
                        <div className="row pb-2">
                            <div className="col-lg-4 label_detailbook d-flex">Price/Day</div>
                            <div className="col-lg-8 d-flex">
                                <CurrencyFormat
                                    value={bookData.price}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"Rp. "}
                                />
                            </div>
                        </div>
                        <div className="row pb-2">
                            <div className="col-lg-4 label_detailbook d-flex">Stock</div>
                            <div className="col-lg-8 d-flex">{bookData.stock}</div>
                        </div>
                        <div className="row d-flex justify-content-center">
                            <button className="col-lg-6 mt-2 btn btn-info rounded-pill d-flex justify-content-center" onClick={() => handlerDetail(bookData)}>Details</button>
                        </div>
                        {bookData.stock <= 0 ?
                            <>
                                <div className="row d-flex justify-content-center">
                                    <button className="col-lg-6 mt-2 btn btn-danger rounded-pill d-flex justify-content-center" onClick={() => handlerAddBook()} disabled>
                                        Add Book
                                        <i className="bi bi-x-circle ms-2"></i>
                                    </button>
                                </div>
                            </>
                            : buttonDisable === true ?
                                <>
                                    <div className="row d-flex justify-content-center">
                                        <button className="col-lg-6 mt-2 btn btn-secondary rounded-pill d-flex justify-content-center" onClick={() => handlerAddBook()} disabled>
                                            Add Book
                                            <i className="bi bi-bag-x ms-2"></i>
                                        </button>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="row d-flex justify-content-center">
                                        <button className="col-lg-6 mt-2 btn btn-primary rounded-pill d-flex justify-content-center" onClick={() => handlerAddBook()}>
                                            Add Book
                                            <i className="bi bi-book-half ms-2"></i>
                                        </button>
                                    </div>
                                </>
                        }

                    </div>
                </div>
            </div>
            {/* <!-- End Card with an image on top --> */}
        </>
    )
}

export default Card;