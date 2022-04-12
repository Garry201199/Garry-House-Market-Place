import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as LocalOfferIcon } from "../assets/svg/localOfferIcon.svg";
import { ReactComponent as PersonOutlineIcon } from "../assets/svg/personOutlineIcon.svg";
import { ReactComponent as ExploreIcon } from "../assets/svg/exploreIcon.svg";
import { motion } from "framer-motion";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathMatchRoute = (route) => {
    if (route === location.pathname) return true;
  };
  return (
    <div>
      <footer className="navbar">
        <nav className="navbarNav">
          <ul className="navbarListItems">
            <motion.li className="navbarListItem" whileHover={{ scale: 1.2 }}>
              <ExploreIcon
                onClick={() => navigate("/")}
                fill={pathMatchRoute("/") ? " #000" : "#8f8f8f"}
                width="28px"
                height="28px"
              />
              <p
                className={
                  pathMatchRoute("/")
                    ? "navbarListItemNameActive "
                    : "navbarListItemName"
                }
              >
                Explore
              </p>
            </motion.li>
            <motion.li className="navbarListItem" whileHover={{ scale: 1.2 }}>
              <LocalOfferIcon
                fill={pathMatchRoute("/offers") ? " #000" : "#8f8f8f"}
                onClick={() => navigate("/offers")}
                width="28px"
                height="28px"
              />{" "}
              <p
                className={
                  pathMatchRoute("/offers")
                    ? "navbarListItemNameActive "
                    : "navbarListItemName"
                }
              >
                Offers
              </p>
            </motion.li>
            <motion.li className="navbarListItem" whileHover={{ scale: 1.2 }}>
              <PersonOutlineIcon
                fill={pathMatchRoute("/profile") ? " #000" : "#8f8f8f"}
                onClick={() => navigate("/profile")}
                width="28px"
                height="28px"
              />

              <p
                className={
                  pathMatchRoute("/profile")
                    ? "navbarListItemNameActive "
                    : "navbarListItemName"
                }
              >
                Profile
              </p>
            </motion.li>
          </ul>
        </nav>
      </footer>
    </div>
  );
};

export default NavBar;
