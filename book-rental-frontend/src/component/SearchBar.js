import { searchBooksByTitleOrAuthor } from "../service/Fetch";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { booksActions } from "../store/booksReducer";
import { paginationActions } from "../store/paginationReducer";
import { useHistory } from "react-router";

const SearchBar = () => {
    const [keywordValue, setKeywordValue] = useState(null);
    const dispatch = useDispatch();
    const history = useHistory();

    const changeKeyHandler = e => {
        setKeywordValue(e.target.value)
    }

    const handlerSearch = e => {
        e.preventDefault();
        dispatch(paginationActions.cleanPagination());
        if (keywordValue === null) {
            dispatch(paginationActions.setKeywordValue(""));
        } else {
            dispatch(paginationActions.setKeywordValue(keywordValue));
        }
        history.push("/");
    }

    return (
        <>
            <form className="search-bar" onSubmit={handlerSearch}>
                <div className="search-form d-flex align-items-center">
                    <input type="text" name="query" placeholder="Search by Title, Author..." title="Enter search keyword" onChange={changeKeyHandler} />
                    <button type="button" title="Search"><i className="bi bi-search" onClick={(e) => handlerSearch(e)}></i></button>
                </div>
            </form>
        </>
    )
}

export default SearchBar;