import { Switch, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Footer from "../component/Footer";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminBook from "../pages/admin/AdminBook";
import AdminCategory from "../pages/admin/AdminCategory";
import AdminUsersStaff from "../pages/admin/AdminUsersStaff";
import AdminUsersCustomer from "../pages/admin/AdminUsersCustomer";
import AdminRental from "../pages/admin/AdminRental";
import AdminHistory from "../pages/admin/AdminHistory";
import AdminProfilePage from "../pages/admin/AdminProfilePage";
import AdminBookDetail from "../pages/admin/AdminBookDetail";
import AdminRentalDetails from "../pages/admin/AdminRentalDetail";
import AdminHistoryDetails from "../pages/admin/AdminHistoryDetails";
import UserDashboard from "../pages/user/UserDashboard";
import UserBook from "../pages/user/UserBook";
import UserProfilePage from "../pages/user/UserProfilePage";
import UserBag from "../pages/user/UserBag";
import UserBookDetail from "../pages/user/UserBookDetail";
import UserHistory from "../pages/user/UserHistory";

const MainRouter = () => {
    return (
        <>
            <div>
                <Switch>
                    <Route exact path="/" component={UserBook} />
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/register" component={RegisterPage} />

                    <Route exact path="/user/dashboard" component={UserDashboard} />
                    <Route exact path="/user/profile_user" component={UserProfilePage} />
                    <Route exact path="/user/bag" component={UserBag} />
                    <Route exact path="/user/book_detail/:id" component={UserBookDetail} />
                    <Route exact path="/user/history" component={UserHistory} />

                    <Route exact path="/admin" component={AdminDashboard} />
                    <Route exact path="/admin/dashboard" component={AdminDashboard} />
                    <Route exact path="/admin/book" component={AdminBook} />
                    <Route exact path="/admin/book/detail/:id" component={AdminBookDetail} />
                    <Route exact path="/admin/category" component={AdminCategory} />
                    <Route exact path="/admin/staff" component={AdminUsersStaff} />
                    <Route exact path="/admin/customer" component={AdminUsersCustomer} />
                    <Route exact path="/admin/rental" component={AdminRental} />
                    <Route exact path="/admin/rental/detail/:id" component={AdminRentalDetails} />
                    <Route exact path="/admin/history" component={AdminHistory} />
                    <Route exact path="/admin/history/detail/:id" component={AdminHistoryDetails} />    
                    <Route exact path="/admin/profile_admin" component={AdminProfilePage} />
                </Switch>
                <Footer />
            </div>
        </>
    )
}

export default MainRouter;