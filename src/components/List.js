import styles from "../css/List.module.css";
const List = ({ values, listType }) => {
    const InteractionElement = ({ index }) => {
        switch (listType) {
            case "add":
                return <div className={styles.cell + " " + styles.add}>+</div>;
            case "remove":
                return (
                    <div className={styles.cell + " " + styles.remove}>-</div>
                );
            case "ranked":
                console.log(index);
                return (
                    <div className={styles.cell + " " + styles.ranked}>
                        <input
                            type="number"
                            name="ranking"
                            min="0"
                            max={values.length}
                            step="1"
                            id={`ranking-${index}`}
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
            {values.map((value, index) => {
                return (
                    <div className={styles.row}>
                        <InteractionElement index={index} />
                        {value.map((element) => {
                            return <div className={styles.cell}>{element}</div>;
                        })}
                    </div>
                );
            })}
        </div>
    );
};
List.defaultProps = {
    values: [
        ["1", "MAT1014", "Discrete Mathematics"],
        ["1", "MAT1014", "Discrete Mathematics"],
        ["1", "MAT1014", "Discrete Mathematics"],
    ],
};

export default List;
