import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase.config";

const ContactPage = () => {
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState("");
  const params = useParams();
  const [searchParams] = useSearchParams();
  console.log(searchParams.get("listingName"));
  useEffect(() => {
    const getLandLord = async () => {
      const docRef = doc(db, "users", params.landlordId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
        console.log(docSnap.data());
      } else {
        toast.error(" 🦄 Wow , Could not get landlord data !!", {
          position: "top-center",
        });
      }
    };
    getLandLord();
  }, []);
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="pageContainer">
      <header className="pageHeader">
        <p className="pageHeader">Contact LandLord</p>
      </header>
      {landlord !== null && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact {landlord?.name}</p>
          </div>
          <form className="messageForm">
            <div className="messageDiv">
              <label className="messageLabel">Message </label>
              <textarea
                name="message"
                value={message}
                id="message"
                onChange={onChange}
                className="textarea"
              ></textarea>
            </div>
            <a
              href={`mailto:${landlord.email}?subject=${searchParams.get(
                "listingName"
              )}?body=${message}`}
            >
              <button type="button" className="primaryButton">
                Send Message
              </button>
            </a>
            <p style={{ color: "white", marginTop: "40px" }}>.</p>
          </form>
        </main>
      )}
    </div>
  );
};

export default ContactPage;
