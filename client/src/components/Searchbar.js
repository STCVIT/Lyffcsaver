import styles from "../css/Searchbar.module.css";
import searchIcon from "../assets/searchIcon.svg";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";

const Searchbar = ({
  selector,
  data,
  getUnique,
  resultString,
  placeholder,
  onSelect,
  keys,
  suggestionElement,
  threshold,
  shouldSort,
  maxResults = 10,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [currentItem, setCurrentItem] = useState(0);
  const fuse = new Fuse(data, {
    keys: keys,
    threshold: threshold || 0.6,
    shouldSort: shouldSort || true,
  });
  useEffect(() => {
    console.log(currentItem);
  }, [currentItem]);

  useEffect(() => {
    const results = fuse.search(query);
    setSuggestions(results.map((ele) => ele.item).slice(0, maxResults));
  }, [query]);
  return (
    <div className={`${styles.container} ${styles.notFocused}`}>
      <input
        type="text"
        name="search"
        placeholder={placeholder}
        className={styles.input}
        id={selector}
        onInput={(e) => {
          setQuery(e.target.value);
          setInputText(e.target.value);
          setCurrentItem(-1);
        }}
        onFocus={(e) => {
          e.target?.parentElement?.classList.remove(styles.notFocused);
          setCurrentItem(-1);
        }}
        onBlur={(e) => {
          e.target?.parentElement?.classList.add(styles.notFocused);
          setSuggestions([]);
          setCurrentItem(-1);
          setInputText("");
          setQuery("");
        }}
        onKeyDown={(e) => {
          if (e.code === "ArrowDown") {
            e.preventDefault();
            setCurrentItem((prevItem) => {
              if (prevItem + 1 < suggestions.length) {
                ++prevItem;
                setInputText(getUnique(suggestions[prevItem]));
                return prevItem;
              }
              return prevItem;
            });
          } else if (e.code === "ArrowUp") {
            e.preventDefault();
            setCurrentItem((prevItem) => {
              if (prevItem - 1 >= 0) {
                --prevItem;
                setInputText(getUnique(suggestions[prevItem]));
                return prevItem;
              }
              return prevItem;
            });
          } else if (e.code === "Enter") {
            console.log(document.querySelector(`.${styles.current}`));
            document.querySelector(`.${styles.current}`)?.click();
            document.querySelector(`#${selector}`)?.blur();
          }
        }}
        autoComplete="off"
        value={inputText}
      ></input>
      {query.length > 1 ? (
        <div className={styles.suggestions}>
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => {
              return suggestionElement(
                suggestion,
                `${styles.suggestion} ${
                  currentItem >= 0 &&
                  suggestions[currentItem] &&
                  getUnique(suggestion) === getUnique(suggestions[currentItem])
                    ? styles.current
                    : ""
                }`,
                getUnique(suggestion),
                onSelect,
                `${selector}-${suggestion}-${index}`
              );
            })
          ) : (
            <div>No Results</div>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Searchbar;
