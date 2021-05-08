const InfoCols = ({ entry, idName, styles, onSelect, ignoreCols }) => {
  return (
    <>
      {Object.keys(entry).map((key) => {
        // if (typeof entry[key] !== "string") return <></>;
        if (ignoreCols && !ignoreCols.includes(key))
          return (
            <td
              className={styles.cell + " " + styles[key]}
              key={entry[idName] + "-c-" + key}
              onClick={(e) => {
                if (
                  e.target.parentNode.parentNode.classList.contains(
                    styles.selectedCourses
                  )
                ) {
                  document
                    .querySelector(`.${styles.activeRow}`)
                    ?.classList.remove(styles.activeRow);

                  e.target.parentNode.classList.toggle(styles.activeRow);
                  e.target.parentNode.classList.remove(styles.hoverRow);
                  onSelect(styles.activeRow);
                }
              }}
              onMouseEnter={(e) => {
                if (e.target.parentNode.classList.contains(styles.activeRow))
                  return;

                if (
                  e.target.parentNode.parentNode.classList.contains(
                    styles.selectedCourses
                  )
                ) {
                  e.target.parentNode.classList.add(styles.hoverRow);
                }
              }}
              onMouseLeave={(e) => {
                e.target.parentNode.classList.remove(styles.hoverRow);
              }}
            >
              {entry[key]}
            </td>
          );
      })}
    </>
  );
};

export default InfoCols;
