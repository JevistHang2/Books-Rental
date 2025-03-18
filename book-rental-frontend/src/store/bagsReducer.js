import { createSlice } from "@reduxjs/toolkit";
import swal from "sweetalert";

const initialState = {
    "bags": {
        users: {
            id: null
        },
        books: [{
            id: null,
            type: {
                id: null
            }
        }]
    },
    "countBook": 0
};

const bagsReducer = createSlice({
    name: "Bags",
    initialState: initialState,
    reducers: {
        addUser(state, action) {
            state.bags.users = action.payload
        },

        addBook(state, action) {
            let isExist = false
            if (state.bags.books[0].id === null) {
                swal({
                    text: "Success Add Book to Bag",
                    icon: "success"
                })
                state.bags.books = [action.payload]
            } else {
                state.bags.books.map((prop) => {
                    if (prop.id === action.payload.id) {
                        isExist = true
                    }
                });

                if (!isExist) {
                    swal({
                        text: "Success Add Book to Bag",
                        icon: "success"
                    })
                    state.bags.books = [...state.bags.books, action.payload]
                } else {
                    swal({
                        title: "Information!",
                        text: "Book Already In Bag",
                        icon: "info"
                    });
                }
            }
            state.countBook = state.bags.books.length
        },

        removeBook(state, action) {
            if (state.bags.books.length === 1) {
                state.bags.books.splice(action.payload, 1)
                state.countBook = state.bags.books.length
                state.bags = initialState.bags
            } else {
                state.bags.books.splice(action.payload, 1)
                state.countBook = state.bags.books.length
            }
        },

        removeAllbook(state) {
            state.bags = initialState.bags
            state.countBook = initialState.countBook
        },

        updateBookOnBag(state, action) {
            state.bags.books[action.payload.arrayBook] = action.payload.bookData
        }
    }
})

export const bagsActions = bagsReducer.actions;

export default bagsReducer.reducer;