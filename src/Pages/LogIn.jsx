import React, { useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase.config";
import { motion } from "framer-motion";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import OAuth from "../Comp/OAuth";
const LogIn = () => {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;
  const navigate = useNavigate();
  const onChange = async (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredentials.user);

      if (userCredentials.user) {
        toast.success(
          `🦄 Wow ${userCredentials.user.displayName} Logged in  !`,
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
        navigate("/");
      }
    } catch (error) {
      toast.error(error.toString().replace("FirebaseError: Firebase:", ""), {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(error);
    }
  };

  return (
    <motion.div
      initial={{ x: -400 }}
      animate={{ x: 0 }}
      transition={{ ease: "easeIn", duration: 0.5 }}
    >
      <div className="pageContainer">
        <>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
            className="pageHeader"
          >
            Welcome Back
            <motion.span
              style={{ marginLeft: "5px" }}
              initial={{ rotateX: 0, x: 0 }}
              animate={{ rotateX: 90, x: 100 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {" "}
              !{" "}
            </motion.span>
            <motion.span
              style={{ color: "#00cc66" }}
              initial={{ rotateX: 270, x: 80 }}
              animate={{ rotateX: 360, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {" "}
              User !
            </motion.span>
          </p>
        </>

        <main>
          <form onSubmit={onSubmit}>
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
            </div>
            <Link to="/forgot-password " className="forgotPasswordLink">
              Forgot Password
            </Link>

            <OAuth />

            <div className="signInBar">
              <p className="signInText">Log In</p>

              <motion.button
                className="signInButton"
                whileHover={{ scale: 1.2 }}
              >
                <ArrowForwardIosIcon htmlColor="#fff" />
              </motion.button>
            </div>
          </form>

          {/* Google OAuth */}
          <Link to="/sign-up" className="registerLink">
            <motion.p whileHover={{ scale: 1.2 }}>Sign Up Instead</motion.p>
          </Link>
        </main>
      </div>
    </motion.div>
  );
};

export default LogIn;
