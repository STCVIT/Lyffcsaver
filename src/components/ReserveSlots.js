import ReserveSlotsTable from "./ReserveSlotsTable";
import ReserveSlotsBubbles from "./ReserveSlotsBubbles";
import styles from "../css/ReserveSlots.module.css";
const ReserveSlots = ({ reservedSlots, toggleReserve, view }) => {
  return (
    <div className={styles.container}>
      {view === 0 ? (
        <ReserveSlotsTable
          reservedSlots={reservedSlots}
          toggleReserve={toggleReserve}
        ></ReserveSlotsTable>
      ) : (
        <ReserveSlotsBubbles
          reservedSlots={reservedSlots}
          toggleReserve={toggleReserve}
        ></ReserveSlotsBubbles>
      )}
    </div>
  );
};

export default ReserveSlots;
