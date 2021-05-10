const InfoCols = ({
  entry,
  idName,
  styles,
  ignoreCols,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <>
      {Object.keys(entry).map((key) => {
        if (
          ignoreCols === undefined ||
          (ignoreCols && !ignoreCols.includes(key))
        )
          return (
            <td
              className={styles.cell + " " + styles[key]}
              key={entry[idName] + "-c-" + key}
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
