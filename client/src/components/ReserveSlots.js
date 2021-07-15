import ReserveSlotsTable from "./ReserveSlotsTable";
import ReserveSlotsBubbles from "./ReserveSlotsBubbles";
import styles from "../css/ReserveSlots.module.css";
const ReserveSlots = ({ reservedSlots, toggleReserve }) => {
  return (
    <div className={styles.container}>
      <ReserveSlotsBubbles
        reservedSlots={reservedSlots}
        toggleReserve={toggleReserve}
      ></ReserveSlotsBubbles>
      <ReserveSlotsTable
        reservedSlots={reservedSlots}
        toggleReserve={toggleReserve}
      ></ReserveSlotsTable>
    </div>
  );
};

export default ReserveSlots;
