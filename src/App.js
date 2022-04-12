import "react-toastify/dist/ReactToastify.css";
import Profile from "./Pages/Profile";
import Offers from "./Pages/Offers";
import Explore from "./Pages/Explore";
import SignUp from "./Pages/SignUp";
import ForgotPassword from "./Pages/ForgotPassword";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./Comp/NavBar";
import LogIn from "./Pages/LogIn";
import PrivateRoute from "./Comp/PrivateRoute";
import Category from "./Pages/Category";
import CreateListing from "./Pages/CreateListing";
import Listing from "./Pages/Listing";
import ContactPage from "./Pages/ContactPage";
import EditListing from "./Pages/EditListing";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Explore />}></Route>
        {/* profile inside private route  */}
        <Route path="/profile" element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/category/:categoryName" element={<Category />}></Route>
        <Route path="/offers" element={<Offers />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/log-in" element={<LogIn />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/create-listing" element={<CreateListing />}></Route>
        <Route
          path="/edit-listing/:listingId"
          element={<EditListing />}
        ></Route>
        <Route
          path="/category/:categoryName/:listingId"
          element={<Listing />}
        ></Route>
        <Route path="/contact/:landlordId" element={<ContactPage />}></Route>
      </Routes>
      {/* NavBar */}

      <NavBar />
      <ToastContainer />
    </Router>
  );
}

export default App;
