import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase.config";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { XlviLoader } from "react-awesome-loaders";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

const EditListing = () => {
  const [geoLocEnabled, setGeoLocEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lng, setLng] = useState("");
  const [listings, setListing] = useState([]);

  const [lat, setLat] = useState("");

  const [got, setGot] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  const isMounted = useRef(true);
  const API_KEY = "AIzaSyAUscY24DtExQ9MmFfkmK5UCy_2QuFjqwg";
  // to fetch Data
  useEffect(() => {
    const fetchListings = async () => {
      const docRef = doc(db, "listings", params.listingId);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data(), address: docSnap.data().location });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Wow Listing Not found", { position: "top-center" });
      }
    };
    fetchListings();
  }, []);
  //set userref to login user
  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, useRef: user.uid });
        } else {
          navigate("/log-in");
        }
      });
    } else {
    }
  }, [isMounted]);

  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    longitude,
    latitude,
    images,
    discountedPrice,
    regularPrice,
    offer,
    address,
    furnished,
    parking,
  } = formData;
  const checkGeo = async () => {
    await axios
      .get(
        `http://api.positionstack.com/v1/forward?access_key=0d3509329d6e66668cba1ec6521edf80&query=${address}`
      )
      .then((res) => {
        console.log(res.data.data);
        setLng(res.data.data[0]?.longitude ?? 0);

        setLat(res.data.data[0]?.latitude ?? 0);
        setGot(!got);
      });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    //
    if (Number(discountedPrice) > Number(regularPrice)) {
      setLoading(false);

      toast.error("🦄 Wow Discounted Price Must be Less than Regular Price !", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    //
    if (images.length > 6) {
      toast.error("🦄 Wow Max 6 Images are allowed !", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    let geolocation = {};
    let location;
    if (geoLocEnabled) {
      setGot(false);
      console.log(got.toString());
      // const params = {
      //   access_key: '0d3509329d6e66668cba1ec6521edf80',
      //   query: address
      // }

      await axios
        .get(
          `http://api.positionstack.com/v1/forward?access_key=0d3509329d6e66668cba1ec6521edf80&query=${address}`
        )
        // .get(`https://api.maptiler.com/geocoding/${address}.json?key=4hyjnVuPQ6sVQYQVeBTS`)
        .then((res) => {
          console.log(res.data);
          // setBbox(res.data.features[0].bbox)
          setLng(res.data.data[0]?.longitude ?? 0);
          geolocation.lng = res.data.data[0]?.longitude ?? 0;
          setLat(res.data.data[0]?.latitude ?? 0);
          geolocation.lat = res.data.data[0]?.latitude ?? 0;
          location = res.data.data[0]?.label ?? "";

          if (res.data.data?.length === 0) {
            toast.error("Please Enter Proper Address", {
              position: "top-center",
            });

            return;
          }

          setGot(!got);
          console.log(got.toString());

          //  return axios.get(`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/
          //  ${res.data.data[0].longitude},${res.data.data[0].latitude},2/400x400?access_token=pk.eyJ1IjoiamFldmllbiIsImEiOiJjbDFxZ3Y1b3UwOWVoM2ttejVrMWMxemc0In0.8Wg7OEONd7l1dkmei_uCRA`)
        })

        .catch((error) => {
          console.log(error);
        });
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
      location = address;
    }
    // upload Images
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, "images/" + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      return;
    });
    console.log(imgUrls);
    //////////////////////////////////////////
    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };

    formDataCopy.location = address;
    delete formDataCopy.images;
    delete formDataCopy.address;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    const docRef = doc(db, "listings", params.listingId);

    await updateDoc(docRef, formDataCopy);

    setLoading(false);
    toast.success("Listing saved", { position: "top-center" });
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // Text/Booleans/Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };
  return loading ? (
    <div className="loadingSpinnerContainer">
      <XlviLoader
        boxColors={["#20b6df", "#f9ed06", "#94d827"]}
        desktopSize={"128px"}
        mobileSize={"100px"}
      />
    </div>
  ) : (
    <>
      <div className="profile">
        <header>
          <p className="pageHeader">Edit A Listing</p>
        </header>

        <main>
          <form onSubmit={onSubmit}>
            <label className="formLabel">Sell / rent</label>

            <div className="formButtons">
              <motion.button
                whileHover={{ scale: 1.2 }}
                type="button "
                id="type"
                value="sale"
                onClick={onMutate}
                className={type === "sale" ? "formButtonActive" : "formButton"}
              >
                Sale{" "}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.2 }}
                type="button "
                id="type"
                value="rent"
                onClick={onMutate}
                className={type === "rent" ? "formButtonActive" : "formButton"}
              >
                Rent{" "}
              </motion.button>
            </div>

            <label className="formLabel">Name</label>
            <motion.input
              whileHover={{ scale: 1.1 }}
              className="formInputSmall"
              type="text"
              id="name"
              value={name}
              onChange={onMutate}
              maxLength="30"
              minLength="10"
              required
            />
            <div className="flex formRooms">
              <div>
                <label className="formLabel">Bedrooms</label>
                <motion.input
                  whileHover={{ scale: 1.1 }}
                  className="formInputSmall"
                  type="number"
                  id="bedrooms"
                  value={bedrooms}
                  onChange={onMutate}
                  maxLength="1"
                  minLength="50"
                  required
                />
              </div>
              <div>
                <label className="formLabel">Bathrooms</label>
                <motion.input
                  whileHover={{ scale: 1.1 }}
                  className="formInputSmall"
                  type="number"
                  id="bathrooms"
                  value={bathrooms}
                  onChange={onMutate}
                  maxLength="1"
                  minLength="50"
                  required
                />
              </div>
            </div>
            <label className="formLabel">Parking spot</label>

            <div className="formButtons">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className={parking ? "formButtonActive" : "formButton"}
                type="button"
                id="parking"
                value={true}
                onClick={onMutate}
              >
                Yes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className={
                  !parking ? "formButtonActive" : "formButton"
                  // !parking && parking !== null ? "formButtonActive" : "formButton"
                }
                type="button"
                id="parking"
                value={false}
                onClick={onMutate}
              >
                No
              </motion.button>
            </div>

            <label className="formLabel">Furnished</label>

            <div className="formButtons">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className={furnished ? "formButtonActive" : "formButton"}
                type="button"
                id="furnished"
                value={true}
                onClick={onMutate}
              >
                Yes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className={
                  !furnished && furnished !== null
                    ? "formButtonActive"
                    : "formButton"
                }
                type="button"
                id="furnished"
                value={false}
                onClick={onMutate}
              >
                No
              </motion.button>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div>
                <label className="formLabel">Address</label>
                <motion.textarea
                  whileHover={{ scale: 1.1 }}
                  id="address"
                  type="text"
                  className="formInputAddress"
                  value={address}
                  required
                  onChange={onMutate}
                />
              </div>
              <div>
                <button
                  className="formButtonActive"
                  style={{ width: "20%", marginTop: "40px" }}
                  onClick={() => checkGeo()}
                >
                  Check
                </button>
              </div>
            </div>

            <p>{got.toString()}</p>
            {got && (
              <>
                <MapContainer center={[lat, lng]} zoom={13}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=4hyjnVuPQ6sVQYQVeBTS"
                  />
                  <Marker position={[lat, lng]}>
                    <Popup>
                      Your Location is here <br /> Easily Peazy.
                    </Popup>
                  </Marker>
                </MapContainer>

                {/* 
            <img src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-l+000(${lng},${lat})/[${bbox}]/400x400?padding=50,10,20&access_token=pk.eyJ1IjoiamFldmllbiIsImEiOiJjbDFxZ3Y1b3UwOWVoM2ttejVrMWMxemc0In0.8Wg7OEONd7l1dkmei_uCRA`} 
            alt={`Map of ${address}`}></img> */}
              </>
            )}

            {!geoLocEnabled && (
              <div className="formLatLng flex">
                <div>
                  <label className="formLabel">Latitude</label>
                  <motion.input
                    whileHover={{ scale: 1.1 }}
                    className="formInputSmall"
                    type="number"
                    id="latitude"
                    value={latitude}
                    onChange={onMutate}
                    required
                  />
                </div>
                <div>
                  <label className="formLabel">Longitude</label>
                  <motion.input
                    whileHover={{ scale: 1.1 }}
                    className="formInputSmall"
                    type="number"
                    id="longitude"
                    value={longitude}
                    onChange={onMutate}
                    required
                  />
                </div>
              </div>
            )}

            <label className="formLabel">Offers</label>

            <div className="formButtons">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className={offer ? "formButtonActive" : "formButton"}
                type="button"
                id="offer"
                value={true}
                onClick={onMutate}
              >
                Yes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className={
                  !offer && offer !== null ? "formButtonActive" : "formButton"
                }
                type="button"
                id="offer"
                value={false}
                onClick={onMutate}
              >
                No
              </motion.button>
            </div>

            <label className="formLabel">Regular Price</label>
            <div className="formPriceDiv">
              <motion.input
                whileHover={{ scale: 1.1 }}
                className="formInputSmall"
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onMutate}
                min="50"
                max="750000000"
                required
              />
              {type === "rent" && <p className="formPriceText">$ / Month</p>}
            </div>

            {offer && (
              <div>
                <label className="formLabel">Discounted Price</label>
                <motion.input
                  whileHover={{ scale: 1.1 }}
                  className="formInputSmall"
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onMutate}
                  min="50"
                  max="750000000"
                  required={offer}
                />
              </div>
            )}
            <div>
              <label className="formLabel">Images</label>
              <p className="imagesInfo">
                The first image will be the cover (max 6).
              </p>
              <motion.input
                whileHover={{ scale: 1.1 }}
                className="formInputFile"
                type="file"
                id="images"
                onChange={onMutate}
                max="6"
                accept=".jpg,.png,.jpeg"
                multiple
                required
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "40px",
              }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                type="submit"
                className="primaryButton createListingButton"
              >
                Edit Listing
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => navigate("/navigate")}
                className="editButton createListingButton"
              >
                Cancel Edit
              </motion.button>
            </div>

            <p style={{ color: "white" }}>you cant see me</p>
          </form>
        </main>
      </div>
    </>
  );
};

export default EditListing;
