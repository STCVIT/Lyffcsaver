const InfoCols = ({
  keys,
  entry,
  getID,
  styles,
  ignoreCols,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <>
      {keys.map((key) => {
        if (
          ignoreCols === undefined ||
          (ignoreCols && !ignoreCols.includes(key))
        )
          return (
            <td
              className={styles.cell + " " + styles[key]}
              key={getID(entry) + "-c-" + key}
              onClick={onClick}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              {entry[key]}
            </td>
          );
      })}
    </>
  );
};

export default InfoCols;
