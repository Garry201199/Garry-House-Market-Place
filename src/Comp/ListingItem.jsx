import React from "react";
import { Link, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import BathtubRoundedIcon from "@mui/icons-material/BathtubRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

const ListingItem = ({ i, id, onDelete, onEdit }) => {
  const { categoryName } = useParams();

  return (
    <div>
      <li className="categoryListing">
        <Link to={`/category/${i.type}/${id}`} className="categoryListingLink">
          {i.offer && categoryName !== "offers" && (
            <div>
              <LocalOfferRoundedIcon
                sx={{
                  position: "absolute",
                  color: "#00cc66",
                  top: "0",
                  right: 0,
                  fontSize: "40px",
                }}
              />
            </div>
          )}

          <img src={i.imgUrls[0]} className="categoryListingImg" alt={i.name} />

          <div className="categoryListingDetails">
            <p className="categoryListingLocation">{i.location}</p>
            <p className="categoryListingName">{i.name}</p>
            <p className="categoryListingPrice">
              ${" "}
              {i.offer
                ? i.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : i.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              {i.type === "rent" && " / Month"}
            </p>
            <div className="categoryListingInfoDiv">
              <HotelRoundedIcon sx={{ mt: 2 }} />
              <p className="categoryListingInfoText">
                {i.bedrooms > 1 ? `${i.bedrooms} Bedrooms` : "1 Bedroom"}
              </p>
              <BathtubRoundedIcon sx={{ mt: 2 }} />
              <p className="categoryListingInfoText">
                {i.bathrooms > 1 ? `${i.bathrooms} Bathrooms` : "1 Bathrooms"}
              </p>
            </div>
          </div>
        </Link>
        {onEdit && (
          <>
            <EditRoundedIcon className="editIcon" onClick={() => onEdit(id)} />
          </>
        )}
        {onDelete && (
          <DeleteIcon
            className="removeIcon"
            htmlColor="red"
            onClick={() => onDelete(id, i.name)}
          />
        )}
      </li>
    </div>
  );
};

export default ListingItem;
