import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase.config";
import { XlviLoader } from "react-awesome-loaders";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  where,
  query,
  startAfter,
} from "firebase/firestore";
import ListingItem from "../Comp/ListingItem";

const Category = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState([]);

  const { categoryName } = useParams();

  useEffect(() => {
    setLoading(true);
    const fetchListings = async () => {
      try {
        // creating reference to collection
        const listingRef = collection(db, "listings");
        //query
        // console.log(listingRef)

        const q = query(
          listingRef,
          where("type", "==", categoryName),
          orderBy("timestamp", "desc"),
          limit(5)
        );

        // execute query
        const querySnapshot = await getDocs(q);

        const lastVisibleDoc =
          querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastFetchedListing(lastVisibleDoc);
        const list = [];

        querySnapshot.forEach((doc) => {
          console.log(doc.data());

          return list.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(list);
        setLoading(!loading);
      } catch (error) {
        console.log(error);
        toast.error("something went wrong");
      }
    };
    fetchListings();
  }, [categoryName]);
  // fetch more / load more listings
  const onFetchMoreListings = async () => {
    setLoading(true);
    try {
      // creating reference to collection
      const listingRef = collection(db, "listings");
      //query
      // console.log(listingRef)

      const q = query(
        listingRef,
        where("type", "==", categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(5)
      );

      // execute query
      const querySnapshot = await getDocs(q);

      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastFetchedListing(lastVisibleDoc);
      const list = [];

      querySnapshot.forEach((doc) => {
        console.log(doc.data());

        return list.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings((prevState) => [...prevState, ...list]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  return (
    <>
      <div className="category">
        <p className="pageHeader">
          {categoryName === "rent" ? "Places for Rent" : "Places for Sale"}
        </p>

        {loading ? (
          <div
            className="pageContainer"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <XlviLoader
              boxColors={["#20b6df", "#f9ed06", "#94d827"]}
              desktopSize={"128px"}
              mobileSize={"100px"}
            />
          </div>
        ) : listings && listings.length > 0 ? (
          <>
            <main className="pageContainer">
              <ul className="categoryListings">
                {listings.map((i, key) => (
                  <ListingItem i={i.data} key={key} id={i.id}></ListingItem>
                ))}
              </ul>
            </main>
            <br />
            <br />
            {lastFetchedListing && (
              <p className="loadMore" onClick={onFetchMoreListings}>
                {" "}
                Load More
              </p>
            )}
          </>
        ) : (
          <p className="pageContainer">No listing for {categoryName} </p>
        )}
      </div>
    </>
  );
};

export default Category;
