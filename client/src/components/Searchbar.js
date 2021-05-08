import styles from "../css/Searchbar.module.css";
const Searchbar = ({ handleSearch }) => {
  return (
    <form
      action="/"
      onSubmit={(e) => {
        if (handleSearch) {
          e.preventDefault();
          const formData = new FormData(e.target);
          handleSearch(formData.get("search"));
        }
      }}
      className={styles.form}
    >
      <input
        type="text"
        name="search"
        placeholder="Search"
        className={styles.input}
      ></input>
      <input
        type="submit"
        className={styles.button}
        placeholder="Search"
      ></input>
    </form>
  );
};

export default Searchbar;
