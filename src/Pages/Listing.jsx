import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase.config";
import { XlviLoader } from "react-awesome-loaders";
import ShareIcon from "@mui/icons-material/Share";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper-bundle.css";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
const Listing = () => {
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState([]);
  const [shareLink, setShareLink] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data());
        setListing(docSnap.data());

        setLoading(false);
      }
    };
    fetchListing();
  }, [navigate, params.listing]);

  if (loading) {
    return (
      <>
        {" "}
        <XlviLoader
          boxColors={["#20b6df", "#f9ed06", "#94d827"]}
          desktopSize={"128px"}
          mobileSize={"100px"}
        />
      </>
    );
  }

  return (
    <div>
      <main>
        {/* slider */}
        <Swiper slidesPerView={1} pagination={{ clickable: true }}>
          {listing.imgUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  background: `url(${listing.imgUrls[index]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="swiperSlideDiv"
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* </Swiper> */}

        <div
          className="shareIconDiv"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setShareLink(true);
            setTimeout(() => {
              setShareLink(false);
            }, 2000);
          }}
        >
          <ShareIcon />
        </div>
        {shareLink && <p className="linkCopied">Link Copied</p>}
        <div className="listingDetails">
          <p className="listingName">
            {listing.name} - $
            {listing.offer
              ? listing.discountedPrice?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? "  / Month " : ""}
          </p>
          <p className="listingAddress">{listing.location}</p>
          <p className="listingType">
            For {listing.type === "rent" ? "Rent" : "Sale"}
          </p>
          {listing.offer && (
            <p className="discountPrice">
              {listing.regularPrice - listing.discountedPrice} $ Discount
            </p>
          )}
          <ul className="listingDetailsList">
            <li>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : "1 Bedroom"}
            </li>
            <li>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Bedrooms`
                : "1 Bedroom"}
            </li>
            <li> {listing.parking && "Parking Spot"} </li>
            <li> {listing.furniture && "Furnished"} </li>
          </ul>
          <p className="listingLocationTitle">
            Location {(!loading).toString()}{" "}
          </p>
          {/* map */}

          {!loading && (
            <MapContainer
              center={[listing.geolocation?.lat, listing?.geolocation?.lng]}
              zoom={9}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=4hyjnVuPQ6sVQYQVeBTS"
              />
              <Marker
                position={[listing.geolocation?.lat, listing.geolocation?.lng]}
              >
                <Popup>
                  Your Location is here <br /> {listing.location}
                </Popup>
              </Marker>
            </MapContainer>
          )}

          {auth.currentUser?.uid !== listing.useRef && (
            <Link
              className="primaryButton"
              to={`/contact/${listing.useRef}?listingName=${listing.name}`}
            >
              Contact LandLord
            </Link>
          )}
        </div>
      </main>
    </div>
  );
};

export default Listing;
