import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "../firebase.config";
import googleIcon from "../assets/svg/googleIcon.svg";
import { motion } from "framer-motion";
const OAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const onGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timeStamp: serverTimestamp(),
        });
      }
      toast.info(`🦄 Wow ${user.displayName} logged in successfully!`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/");
    } catch (error) {
      toast.error(
        `🦄 Wow ${error
          .toString()
          .replace("FirebaseError: Firebase: Error", "")}!`,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  };
  return (
    <div className="socialLogin">
      {location.pathname === "/sign-up" ? "Sign Up" : "Log In"}

      <motion.button
        initial={{ rotateZ: 0 }}
        animate={{ rotateZ: 360 }}
        transition={{ duration: 1.5, delay: 0.5, repeat: Infinity }}
        whileHover={{ scale: 1.2 }}
        className="socialIconDiv"
        onClick={onGoogleClick}
      >
        <img src={googleIcon} className="socialIconImg" alt="googlelLogo" />
      </motion.button>
    </div>
  );
};

export default OAuth;
