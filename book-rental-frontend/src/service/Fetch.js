import axios from "axios";

const BASE_URL = '/api/';

export function postForm(target, data) {
    const url = BASE_URL + target;
    return axios.post(url, data);
}

export function postLogin(target, data) {
    const url = BASE_URL + target;
    return axios.post(url, data);
}

export function postCategory(target, data, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.post(url, data, config);
}

export function postBook(target, data, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.post(url, data, config);
}

export function getBookTypes(target) {
    const url = BASE_URL + target;
    return axios.get(url);
}

export function getBooks(target) {
    const url = BASE_URL + target;
    return axios.get(url);
}

export function getUserByAdminAndStaff(target, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.get(url, config);
}

export function getUserByMemberAndUser(target, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.get(url, config);
}

export function updateBook(target, data, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.post(url, data, config);
}

export function deleteBook(target, data, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.post(url, data, config);
}

export function updateBookTypes(target, data, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.post(url, data, config);
}

export function deleteBookTypes(target, data, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.post(url, data, config);
}

export function registerStaff(target, data, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.post(url, data, config);
}

export function deleteStaff(target, data, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.post(url, data, config);
}

export function updateUserData(target, data, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.post(url, data, config);
}

export function updateCustomerRole(target, data, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.post(url, data, config);
}

export function checkoutRental(target, data, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.post(url, data, config);
}

export function getRentalUser(target, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.get(url, config);
}

export function getRentalDetailsById(target, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.get(url, config);
}

export function getRentalDetailsByUserId(target, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.get(url, config);
}

export function returnBooks(target, data, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.post(url, data, config);
}

export function getRentalHistory(target, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.get(url, config);
}

export function getRentalDetailsHistory(target, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.get(url, config);
}

export function searchBooksByTitleOrAuthor(target) {
    const url = BASE_URL + target;
    return axios.get(url);
}

export function searchBookTypesByName(target, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.get(url, config);
}

export function searchAdminAndStaffByNameOrUsername(target, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.get(url, config);
}

export function searchMemberAndUserByNameOrUsername(target, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.get(url, config);
}

export function searchUserRentalByName(target, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.get(url, config);
}

export function searchHistoryRentalByNameOrTitleOrDate(target, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.get(url, config);
}

export function getDashboardAdmin(target, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.get(url, config);
}

export function getDashboardUser(target, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.get(url, config);
}

export function addBookImage(target, data, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.post(url, data, config);
}

export function getImageByBookId(target) {
    const url = BASE_URL + target;
    return axios.get(url);
}

export function editBookImages(target, data, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.post(url, data, config);
}

export function editProfileImages(target, data, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.post(url, data, config);
}

export function deleteProfileImages(target, data, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.post(url, data, config);
}

export function getProfileImageByUserId(target, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.get(url, config);
}

export function getBookByBookId(target, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.get(url, config);
}

export function getRentalDetailsHistoryByUserId(target, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.get(url, config);
}

export function searchRentalDetailsHistoryByUserIdAndTitleAndDate(target, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.get(url, config);
}

export function changeUserPassword(target, data, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const url = BASE_URL + target;
    return axios.post(url, data, config);
}