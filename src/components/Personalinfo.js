import { useContext, useEffect, useState } from "react";
import { FormContext, DispatchContext } from "../contexts/FormContext";
import AttendeeInfo from "./AttendeeInfo";
import styles from "../components/Personalinfo.module.css";

export default function PersonalInfo() {
  const { formData } = useContext(FormContext);
  const dispatch = useContext(DispatchContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleNextWithValidation = () => {
    const nameRegex = /^[a-zA-Z\s]*$/;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    for (let attendee of formData.attendees) {
      if (!attendee.firstName || !attendee.lastName || !attendee.email) {
        setModalMessage("Please fill in the name and email for all attendees.");
        setModalOpen(true);
        return;
      }

      if (
        !nameRegex.test(attendee.firstName) ||
        !nameRegex.test(attendee.lastName)
      ) {
        setModalMessage("Names can only contain letters and spaces.");
        setModalOpen(true);
        return;
      }

      if (!emailRegex.test(attendee.email)) {
        setModalMessage("Please enter a valid email address.");
        setModalOpen(true);
        return;
      }
    }

    dispatch({ type: "NEXT_STEP" });
    dispatch({ type: "CALCULATE_TOTAL_PRICE" });
  };

  const handlePrevious = () => {
    dispatch({ type: "PREVIOUS_STEP" });
  };

  const Modal = ({ onClose, children }) => (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        {children}
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <h2>Personal Information</h2>

      <AttendeeInfo />

      <div className={styles.twoButtons}>
        <button className={styles.previousButton} onClick={handlePrevious}>
          ← &nbsp; Previous
        </button>
        <button
          className={styles.nextButton}
          onClick={handleNextWithValidation}
        >
          Next &nbsp; →
        </button>
      </div>

      {modalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.closeButton} onClick={closeModal}>
              &times;
            </span>
            <p>{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
