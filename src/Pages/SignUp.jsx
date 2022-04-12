import React, { useState } from "react";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase.config";
import { toast } from "react-toastify";
import OAuth from "../Comp/OAuth";
const SignUp = () => {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredentials);
      const user = userCredentials.user;
      updateProfile(auth.currentUser, { displayName: name });
      toast.success(`🦄 Wow Welcome onboard ${name} !`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/");
      //creating formdata not to hamper formdata (original)
      const formDataCopy = { ...formData };
      //deleting password for  better security
      delete formDataCopy.password;
      //adding timestamp
      formDataCopy.timestamp = serverTimestamp();
      //set method to add data in db called 'users' with key as uid and other data as email, name , timestamp
      await setDoc(doc(db, "users", user.uid), formDataCopy);
    } catch (error) {
      toast.error(
        `🦄 Wow ${error
          .toString()
          .replace(
            "FirebaseError: Firebase: Error",
            ""
          )} Something Went Wrong !!`,
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
      console.log(error);
    }
  };
  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      transition={{ ease: "easeIn", duration: 0.5 }}
    >
      <div className="pageContainer">
        <header>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
            className="pageHeader"
          >
            Welcome
            <motion.span
              initial={{ rotateX: 0 }}
              animate={{ rotateX: 90, scale: 1.5 }}
              transition={{
                delay: 1,
                duration: 1,
              }}
            >
              !!
            </motion.span>
            <motion.span
              style={{ color: "#00cc66" }}
              initial={{ rotateX: 270 }}
              animate={{ rotateX: 360, scale: 1.5 }}
              transition={{ delay: 2, duration: 1 }}
            >
              !!
            </motion.span>
          </p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
            <motion.input
              whileHover={{ scale: 1.05 }}
              className="nameInput"
              type="name"
              id="name"
              onChange={onChange}
              placeholder="Name"
            ></motion.input>

            <motion.input
              whileHover={{ scale: 1.05 }}
              className="emailInput"
              type="email"
              id="email"
              onChange={onChange}
              placeholder="Email"
            ></motion.input>

            <div className="passwordInputDiv">
              <motion.input
                whileHover={{ scale: 1.05 }}
                className="passwordInput"
                id="password"
                type={showPass ? "text" : "password"}
                onChange={onChange}
                placeholder="Password"
              ></motion.input>

              <div className="showPassword">
                {showPass ? (
                  <motion.div
                    initial={{ rotateX: 270, scale: 1 }}
                    animate={{ rotateX: 360, scale: 1.2 }}
                    transition={{ duration: 0.8 }}
                  >
                    <VisibilityOffRoundedIcon
                      onClick={() => setShowPass(!showPass)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.2 }}
                    transition={{ duration: 1 }}
                  >
                    <VisibilityRoundedIcon
                      onClick={() => setShowPass(!showPass)}
                    />
                  </motion.div>
                )}
              </div>

              <Link to="/forgot-password " className="forgotPasswordLink">
                Forgot Password
              </Link>
              <OAuth />

              <div className="signInBar">
                <p className="signInText">Sign Up</p>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 1.2 }}
                  className="signInButton"
                >
                  <ArrowForwardIosIcon htmlColor="#fff" />
                </motion.button>
              </div>
            </div>
          </form>

          {/* Google OAuth */}
          <Link to="/log-in" className="registerLink">
            <motion.p whileHover={{ scale: 1.2 }} whileTap={{ scale: 1.2 }}>
              Log In Instead
            </motion.p>
          </Link>
        </main>
      </div>
    </motion.div>
  );
};

export default SignUp;
