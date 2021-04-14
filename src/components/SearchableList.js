import Searchbar from "./Searchbar";
import List from "./List";
import styles from "../css/SearchableList.module.css";

const SearchableList = ({
    name,
    values,
    listType,
    onAdd,
    onRemove,
    onSelect,
}) => {
    return values.length > 0 ? (
        <div className={styles.SearchableList}>
            <label>
                <h2>{name}</h2>
            </label>
            <Searchbar></Searchbar>
            <List
                name={name}
                values={values}
                listType={listType}
                onAdd={onAdd}
                onRemove={onRemove}
                onSelect={onSelect}
            ></List>
        </div>
    ) : (
        <></>
    );
};

export default SearchableList;
