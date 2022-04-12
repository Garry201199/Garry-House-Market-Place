import { sendPasswordResetEmail } from "firebase/auth";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../firebase.config";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const onChange = (e) => setEmail(e.target.value);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("🦄 Wow Email was sent !", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("wow erro in forgot", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <motion.input
            whileHover={{ scale: 1.05 }}
            type="email"
            className="emailInput"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          ></motion.input>

          <Link
            to="/log-in"
            style={{
              color: "#00cc66",
              textAlign: "end",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Log In
          </Link>

          <div className="signInBar">
            <p className="signInText">Send Reset Link</p>
            <motion.button className="signInButton" whileHover={{ scale: 1.2 }}>
              <ArrowForwardIosIcon htmlColor="#fff" />
            </motion.button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ForgotPassword;
