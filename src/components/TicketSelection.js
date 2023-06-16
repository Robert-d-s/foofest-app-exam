/* eslint-disable react/no-unescaped-entities */

import React, { useContext, useEffect, useState } from "react";
import { FormContext, DispatchContext } from "../contexts/FormContext";
import styles from "@/components/TicketSelection.module.css";
export default function TicketSelection() {
  const { formData } = useContext(FormContext);
  const dispatch = useContext(DispatchContext);

  const [showModal, setShowModal] = useState(false);

  const handleNext = () => {
    if (formData.ticketData.ticketQuantity < 1) {
      setShowModal(true);
    } else {
      dispatch({ type: "NEXT_STEP" });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleTicketTypeChange = (e) => {
    const ticketType = e.target.value;
    dispatch({
      type: "UPDATE_FIELD",
      payload: {
        section: "ticketData",
        field: "ticketType",
        value: ticketType,
      },
    });
    dispatch({
      type: "CALCULATE_TICKET_PRICE",
    });
  };

  useEffect(() => {
    dispatch({
      type: "CALCULATE_TICKET_PRICE",
    });
  }, [dispatch]);

  const handleTicketQuantityChange = (e) => {
    let ticketQuantity = e.target.value;

    if (ticketQuantity === "") {
      ticketQuantity = 0;
    } else {
      ticketQuantity = Number(ticketQuantity);
    }

    console.log("Ticket Quantity:", ticketQuantity);

    if (ticketQuantity >= 1) {
      dispatch({
        type: "UPDATE_FIELD",
        payload: {
          section: "ticketData",
          field: "ticketQuantity",
          value: ticketQuantity,
        },
      });
      dispatch({
        type: "CALCULATE_TICKET_PRICE",
      });

      const tentRemainder = ticketQuantity;

      dispatch({
        type: "CALCULATE_TENT_CAPACITY",
        payload: {
          tentRemainder,
        },
      });
    } else {
      dispatch({
        type: "UPDATE_FIELD",
        payload: {
          section: "ticketData",
          field: "ticketQuantity",
          value: "",
        },
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p>Please select at least 1 ticket</p>
          </div>
          <button className={styles.closeButton} onClick={handleCloseModal}>
            Close
          </button>
        </div>
      )}

      <h2>Choose Your Ticket</h2>
      <div className={styles.ticketsTypes}>
        <label className={styles.radioButton}>
          <input
            type="radio"
            value="VIP"
            checked={formData.ticketData.ticketType === "VIP"}
            onChange={handleTicketTypeChange}
          />
          VIP Ticket + 399 dkk
        </label>
        <label className={styles.radioButton}>
          <input
            type="radio"
            value="Regular"
            checked={formData.ticketData.ticketType === "Regular"}
            onChange={handleTicketTypeChange}
          />
          Regular Ticket + 299 dkk
        </label>
      </div>
      <div className={styles.ticketsQuantity}>
        <label className={styles.inputFieldLabel}>
          Ticket Quantity
          <input
            className={styles.inputField}
            type="number"
            value={formData.ticketData.ticketQuantity}
            min={0}
            onChange={handleTicketQuantityChange}
          />
        </label>

        <button className={styles.nextButton} onClick={handleNext}>
          Next &nbsp; →
        </button>
      </div>
      <div>
        <p> ● Please note there is a Fixed booking fee of 99 dkk</p>
      </div>
      <div className={styles.ticketInfo}>
        <div className={styles.section}>
          <h3>VIP Ticket includes:</h3>
          <p>● VIP entrance</p>
          <p>
            ● Access to exclusive stages, viewing platforms, or areas near the
            stage
          </p>
          <p>● VIP camping area closer to the main festival grounds</p>
          <p>● Complimentary welcome drink or gift upon arrival</p>
          <p>
            ● VIP-only food and beverage options, including specialty cocktails
          </p>
          <p>● Priority parking or dedicated VIP parking area</p>
          <p>
            ● Priority access to festival workshops, activities, or
            meet-and-greets
          </p>
          <p>
            ● Exclusive merchandise or merchandise discounts for VIP ticket
            holders
          </p>
          <p>● Healthcare in emergency situations</p>
          <p>● Internet access</p>
        </div>
        <div className={styles.section}>
          <h3>Regular Ticket includes:</h3>
          <p>● Entrance to the festival</p>
          <p>● "Basic" camping</p>
          <p>● Healthcare in emergency situations</p>
          <p>● Internet access</p>
        </div>
      </div>
    </div>
  );
}
