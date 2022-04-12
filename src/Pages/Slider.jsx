import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase.config";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { XlviLoader } from "react-awesome-loaders";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
const SLider = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListing] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
      setLoading(true)
    const getListing = async () => {
      const listingRef = collection(db, "listings");
      const q = query(listingRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q)
      let listing=[]
      querySnap.forEach((doc)=>{
          return listing.push({
              id : doc.id,
              data : doc.data()
          })

      })
      console.log(listing);
      setListing(listing)

      setLoading(false)

    };
    getListing();
  }, []);

  if (loading) {
    return   (<div className="pageContainer" style={{display:'flex' , alignItems:'center' , justifyContent:'center'}}
    > <XlviLoader
        boxColors={["#20b6df", "#f9ed06", "#94d827"]}
        desktopSize={"128px"}
        mobileSize={"100px"}
      /></div>)
  }
  if(listings?.length === null ){
    return(<></>)
  }
  return (

    <div>
     <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listings.map(({data, id}, index) => (
          <SwiperSlide key={index}  
          onClick={()=>navigate(`/category/${data.type}/${id}`)}
          >
            <div
              style={{
                background: `url(${data.imgUrls[0]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className='swiperSlideDiv'
            >
                <p className="swiperSlideText">
                    {data.name}
                </p>
                <p className="swiperSlidePrice">
                    $ {data.discountedPrice ||  data.regularPrice}
                    {data.type === 'rent' ? ' / Month' :''}
                    
                </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    
 
  );
};

export default SLider;
