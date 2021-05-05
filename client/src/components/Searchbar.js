import styles from "../css/Searchbar.module.css";
const Searchbar = () => {
  return (
    <form action="/" className={styles.form}>
      <input
        type="text"
        name="search"
        placeholder="Search"
        className={styles.input}
      ></input>
      <button type="submit" className={styles.button}>
        Submit
      </button>
    </form>
  );
};

export default Searchbar;
