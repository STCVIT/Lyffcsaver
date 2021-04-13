import Searchbar from "./Searchbar";
import List from "./List";
import styles from "../css/SearchableList.module.css";

const SearchableList = ({ name, values, listType }) => {
    return (
        <div className={styles.SearchableList}>
            <label>
                <h2>{name}</h2>
            </label>
            <Searchbar></Searchbar>
            <List values={values} listType={listType}></List>
        </div>
    );
};

export default SearchableList;
