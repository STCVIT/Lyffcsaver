import styles from "../css/Searchbar.module.css";
import searchIcon from "../assets/searchIcon.svg";
const Searchbar = ({ handleSearch, text = "Search" }) => {
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
        placeholder={text}
        className={styles.input}
      ></input>
      <button type="submit" className={styles.button} value="Search">
        <img src={searchIcon} alt="" />
      </button>
    </form>
  );
};

export default Searchbar;
