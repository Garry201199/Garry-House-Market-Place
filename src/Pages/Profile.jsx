import { updateProfile } from "firebase/auth";
// import CircularProgress from "@mui/material/CircularProgress";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "../firebase.config";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ListingItem from "../Comp/ListingItem";

const Profile = () => {
  const [changeDetails, setChangeDetails] = useState(false);
  const [updateComp, setUpdateComp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listings, setListing] = useState([]);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });

  // destructuring form  DAta
  const { name, email } = formData;

  // initate USeNavigate()
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserListings = async () => {
      const userListingRef = collection(db, "listings");
      const q = query(
        userListingRef,
        where("useRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );

      const querySnap = await getDocs(q);
      let listing = [];
      querySnap.forEach((doc) => {
        return listing.push({
          id: doc.id,
          doc: doc.data()
        });
      });
      console.log(listing);
      setLoading(false);
      setListing(listing);
    };
    fetchUserListings();
  }, [auth.currentUser.uid]);

  // Logout
  const onLogout = () => {
    auth.signOut();
    toast.info(`Wow ${auth.currentUser.displayName} logged out !!`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });

    navigate("/");
  };
  // onChange
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }));
  };
  //onDelete
  const onDelete = async (listingId, listingName) => {
    console.log(listingId);
    if (window.confirm("Are you sure you want to delete this listing?")) {
      await deleteDoc(doc(db, "listings", listingId));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      console.log(updatedListings);
      setListing(updatedListings);
      toast.success(`🦄 Wow ${listingName} Deleted successfully !!`, {
        position: "top-center"
      });
    } else {
      toast.error("Something went wrong");
    }
  };
  //////////////
  const onEdit = async (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };
  ///////////////
  const onSubmit = async () => {
    console.log(formData);

    if (name !== "") {
      try {
        if (auth.currentUser.displayName !== name) {
          //update functionality
          await updateProfile(auth.currentUser, { displayName: name });
          // await updateEmail (auth.currentUser, email)

          //Update in Firestore
          const userRef = doc(db, "users", auth.currentUser.uid);

          await updateDoc(userRef, { name });

          toast.info(`🦄 Wow User Updated !!`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
          setUpdateComp(!updateComp);
        }
      } catch (error) {
        //for any error
        toast.error(`🦄 Wow Error !!`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
        console.log(error);
      }
    } else {
      // for empty username
      toast.warning(`🦄 Wow User Name Empty !!`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    }
  };

  return (
    <div>
      <div className="profile">
        <header className="profileHeader">
          <p className="pageHeader">My Profile</p>
          <motion.button
            whileHover={{ scale: 1.2 }}
            type="button"
            className="logOut"
            onClick={onLogout}
          >
            LogOut
          </motion.button>
        </header>

        <main>
          <div className="profileDetailsHeader">
            <p className="profileDetailsText">Personal Details</p>

            <p
              className="changePersonalDetails"
              onClick={() => {
                changeDetails && onSubmit();
                setUpdateComp(!updateComp);
                setChangeDetails(!changeDetails);
              }}
            >
              {!changeDetails ? (
                "Change"
              ) : (
                <>
                  {" "}
                  {updateComp ? (
                    <span style={{ color: "gray" }}>
                      {" "}
                      Done
                      <CircularProgress size={20} sx={{ color: "#00cc66" }} />
                    </span>
                  ) : (
                    <></>
                  )}{" "}
                </>
              )}
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} className="profileCard">
            <form>
              <input
                type="text"
                id="name"
                disabled={!changeDetails}
                placeholder="name"
                value={name}
                onChange={onChange}
                className={changeDetails ? "profileNameActive" : "profileName"}
              />

              <input
                type="text"
                id="email"
                value={email}
                onChange={onChange}
                className={"profileName"}
              />
            </form>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/create-listing" className="createListing">
              <HomeRoundedIcon />
              <p>Rent Or Sale Your Home</p>
              <ArrowForwardIosRoundedIcon />
            </Link>
          </motion.div>

          {!loading && listings?.length > 0 && (
            <>
              <p className="listingText">Your Listings</p>
              <ul className="listingsList">
                {listings.map((i, id) => (
                  <ListingItem
                    key={id}
                    i={i.doc}
                    id={i.id}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </ul>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
