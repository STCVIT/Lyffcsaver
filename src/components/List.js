import styles from "../css/List.module.css";

// start code from stackoverflow
// https://stackoverflow.com/a/2970667/13378825
function camelize(str) {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, "");
}
// end code from stackoverflow

const List = ({ name, values, listType, onAdd, onRemove, onSelect }) => {
    const InteractionElement = ({ id, index }) => {
        switch (listType) {
            case "add":
                return (
                    <div
                        className={styles.cell + " " + styles.add}
                        key={id + "-i"}
                        onClick={() => onAdd(id, styles.activeRow)}
                    >
                        +
                    </div>
                );
            case "remove":
                return (
                    <div
                        className={styles.cell + " " + styles.remove}
                        key={id + "-i"}
                        onClick={() => onRemove(id, styles.activeRow)}
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
        <div className={`${styles.list} ${styles[camelize(name)]}`}>
            {values?.map((entry, index) => {
                return (
                    <div className={styles.row} key={entry.id + "-r"}>
                        <InteractionElement index={index} id={entry.id} />
                        {Object.keys(entry).map((key, index) => {
                            return key !== "id" &&
                                typeof entry[key] === "string" ? (
                                <div
                                    className={styles.cell + " " + styles[key]}
                                    key={entry.id + "-c-" + key}
                                    onClick={(e) => {
                                        if (
                                            e.target.parentNode.parentNode.classList.contains(
                                                styles.selectedCourses
                                            )
                                        ) {
                                            document
                                                .querySelector(
                                                    `.${styles.activeRow}`
                                                )
                                                ?.classList.remove(
                                                    styles.activeRow
                                                );
                                            e.target.parentNode.classList.toggle(
                                                styles.activeRow
                                            );
                                            e.target.parentNode.classList.remove(
                                                styles.hoverRow
                                            );
                                            onSelect(styles.activeRow);
                                        }
                                    }}
                                    onMouseEnter={(e) => {
                                        if (
                                            e.target.parentNode.classList.contains(
                                                styles.activeRow
                                            )
                                        )
                                            return;
                                        if (
                                            e.target.parentNode.parentNode.classList.contains(
                                                styles.selectedCourses
                                            )
                                        ) {
                                            e.target.parentNode.classList.add(
                                                styles.hoverRow
                                            );
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.parentNode.classList.remove(
                                            styles.hoverRow
                                        );
                                    }}
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
