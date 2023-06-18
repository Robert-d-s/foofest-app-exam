import React from "react";
import styles from "@/components/CampCard.module.css";

const CampCard = ({ spot, formData, handleCampSpotChange }) => {
  const divClassName = `${styles.campCard} ${
    formData.campData.campSpot === spot.area ? styles.checked : ""
  }`;

  return (
    <label htmlFor={spot.area} className={divClassName}>
      <input
        id={spot.area}
        className={styles.input}
        type="radio"
        name="campSpot"
        value={spot.area}
        checked={formData.campData.campSpot === spot.area}
        onChange={handleCampSpotChange}
        disabled={spot.available < formData.ticketData.ticketQuantity}
      />
      <span className={styles.campName}>{spot.area}</span>
      <p
        className={
          spot.available < formData.ticketData.ticketQuantity
            ? styles.SoldOut
            : ""
        }
      >
        {spot.available < formData.ticketData.ticketQuantity ? "Sold Out" : ""}
      </p>
    </label>
  );
};

export default CampCard;
