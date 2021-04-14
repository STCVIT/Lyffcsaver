import styles from "../css/List.module.css";
const List = ({ values, listType, onAdd, onRemove }) => {
    const InteractionElement = ({ id, index }) => {
        switch (listType) {
            case "add":
                return (
                    <div
                        className={styles.cell + " " + styles.add}
                        key={id + "-i"}
                        onClick={() => onAdd(id)}
                    >
                        +
                    </div>
                );
            case "remove":
                return (
                    <div
                        className={styles.cell + " " + styles.remove}
                        key={id + "-i"}
                        onClick={() => onRemove(id)}
                    >
                        -
                    </div>
                );
            case "ranked":
                return (
                    <div className={styles.cell + " " + styles.ranked}>
                        <input
                            type="number"
                            name="ranking"
                            min="0"
                            max={values.length}
                            step="1"
                            key={id + "-i"}
                            id={`ranking-${id}`}
                            defaultValue={index}
                            onKeyDown={(e) => e.preventDefault()}
                        />
                    </div>
                );
            default:
                break;
        }
    };
    return (
        <div className={styles.list}>
            {values?.map((entry, index) => {
                return (
                    <div className={styles.row} key={entry.id + "-r"}>
                        <InteractionElement index={index} id={entry.id} />
                        {Object.keys(entry).map((key, index) => {
                            return key !== "id" &&
                                typeof entry[key] === "string" ? (
                                <div
                                    className={styles.cell}
                                    key={entry.id + "-c-" + key}
                                >
                                    {entry[key]}
                                </div>
                            ) : (
                                <></>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};
// List.defaultProps = {
//     values: [
//         ["1", "MAT1014", "Discrete Mathematics"],
//         ["1", "MAT1014", "Discrete Mathematics"],
//         ["1", "MAT1014", "Discrete Mathematics"],
//     ],
// };

export default List;
