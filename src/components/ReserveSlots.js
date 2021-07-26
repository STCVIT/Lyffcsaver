import ReserveSlotsTable from "./ReserveSlotsTable";
import ReserveSlotsBubbles from "./ReserveSlotsBubbles";
import styles from "../css/ReserveSlots.module.css";
const ReserveSlots = ({ reservedSlots, toggleReserve, view }) => {
  return (
    <div
      className={`${styles.container} ${
        view === 0 ? styles.container1 : styles.container2
      }`}
    >
      {/* {view === 0 ? (
        <ReserveSlotsTable
          reservedSlots={reservedSlots}
          toggleReserve={toggleReserve}
        ></ReserveSlotsTable>
      ) : (
        <ReserveSlotsBubbles
          reservedSlots={reservedSlots}
          toggleReserve={toggleReserve}
        ></ReserveSlotsBubbles>
      )} */}

      <div
        className={`${styles.wrapper1} ${
          view === 0 ? styles.inactive : styles.active
        }`}
      >
        <ReserveSlotsTable
          reservedSlots={reservedSlots}
          toggleReserve={toggleReserve}
        ></ReserveSlotsTable>
      </div>
      <div
        className={`${styles.wrapper2} ${
          view === 1 ? styles.inactive : styles.active
        }`}
      >
        <ReserveSlotsBubbles
          reservedSlots={reservedSlots}
          toggleReserve={toggleReserve}
        ></ReserveSlotsBubbles>
      </div>
    </div>
  );
};

export default ReserveSlots;
