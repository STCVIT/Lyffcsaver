import ReserveSlotsTable from "./ReserveSlotsTable";
import ReserveSlotsBubbles from "./ReserveSlotsBubbles";
import styles from "../css/ReserveSlots.module.css";
const ReserveSlots = ({ reservedSlots, toggleReserve }) => {
  return (
    <div className={styles.container}>
      <div className={`${styles.sectionTitle} heading2`}>
        <div className={styles.title}>Reserve your Slots</div>
        <div className={styles.btns}>
          <a
            className={`${styles.btn} body1-medium`}
            onClick={() => {
              reservedSlots.forEach((slot) => toggleReserve(slot));
            }}
          >
            Clear
          </a>
          <a className={`${styles.btn} body1-medium`}>Skip</a>
        </div>
      </div>
      <ReserveSlotsTable
        reservedSlots={reservedSlots}
        toggleReserve={toggleReserve}
      ></ReserveSlotsTable>
      <ReserveSlotsBubbles
        reservedSlots={reservedSlots}
        toggleReserve={toggleReserve}
      ></ReserveSlotsBubbles>
    </div>
  );
};

export default ReserveSlots;
