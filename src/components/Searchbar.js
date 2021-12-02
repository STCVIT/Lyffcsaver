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
  threshold = 0.6,
  shouldSort,
  maxResults = 10,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [currentItem, setCurrentItem] = useState(0);
  const fuse = new Fuse(data, {
    keys: keys,
    threshold: threshold,
    shouldSort: shouldSort || true,
  });
  const clearSuggestions = () => {
    document
      .querySelector(`.${styles.container}`)
      ?.classList.add(styles.notFocused);
    setSuggestions([]);
    setCurrentItem(-1);
    setInputText("");
    setQuery("");
  };
  useEffect(() => {
    // console.log(currentItem);
  }, [currentItem]);

  useEffect(() => {
    const results = fuse.search(query);
    setSuggestions(results.map((ele) => ele.item).slice(0, maxResults));
  }, [query]);
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      // console.log(e.code, e.code === "Escape");
      if (e.code === "Escape") {
        clearSuggestions();
      }
    });
    document.addEventListener("mousedown", (e) => {
      // console.log(e.target);
      let current = e.target;
      while (
        current !== undefined &&
        current !== null &&
        !current?.classList?.contains(styles.container)
      )
        current = current.parentElement;
      if (
        current === null ||
        current === undefined ||
        !current?.classList?.contains(styles.container)
      )
        clearSuggestions();
      // document
      //   .querySelector(`.${styles.container}`)
      //   ?.classList?.add(styles.notFocused);
    });
  }, []);
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
              // onBlur={(e) => {
              // }}
              // onKeyDown{(e) => {
              //   console.log("down", e.code)
              // }}

              // onKeyPressCapture={(e) => {
              //   console.log("press - c", e.code);
              // }}
              // onKeyDownCapture={(e) => {
              //   console.log("down - c", e.code);
              // }}
              // onKeyUpCapture={(e) => {
              //   console.log("up - c", e.code);
              // }}
              // onKeyPress={(e) => {
              //   console.log("press", e.code);
              // }}
              onKeyUp={(e) => {
                  console.log("up", e.code);
              }}
              onKeyDown={(e) => {
                  switch (e.code) {
                      case "ArrowDown":
                          e.preventDefault();
                          setCurrentItem((prevItem) => {
                              if (prevItem + 1 < suggestions.length) {
                                  ++prevItem;
                                  setInputText(
                                      getUnique(suggestions[prevItem])
                                  );
                                  return prevItem;
                              }
                              return prevItem;
                          });
                          break;
                      case "ArrowUp":
                          e.preventDefault();
                          setCurrentItem((prevItem) => {
                              if (prevItem - 1 >= 0) {
                                  --prevItem;
                                  setInputText(
                                      getUnique(suggestions[prevItem])
                                  );
                                  return prevItem;
                              }
                              return prevItem;
                          });
                          break;
                      case "Enter":
                          // console.log(document.querySelector(`.${styles.current}`));
                          document.querySelector(`.${styles.current}`)?.click();
                          document.querySelector(`#${selector}`)?.blur();
                          break;
                      case "Tab":
                          e.preventDefault();
                          if (suggestions.length > 0) {
                              e.target?.focus();
                              if (e.shiftKey) {
                                  e.preventDefault();
                                  setCurrentItem((prevItem) => {
                                      if (prevItem - 1 >= 0) {
                                          --prevItem;
                                          setInputText(
                                              getUnique(suggestions[prevItem])
                                          );
                                          return prevItem;
                                      }
                                      return prevItem;
                                  });
                              } else {
                                  e.preventDefault();
                                  setCurrentItem((prevItem) => {
                                      if (prevItem + 1 < suggestions.length) {
                                          ++prevItem;
                                          setInputText(
                                              getUnique(suggestions[prevItem])
                                          );
                                          return prevItem;
                                      }
                                      return prevItem;
                                  });
                              }
                          }
                          break;
                      default:
                          break;
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
                                  getUnique(suggestion) ===
                                      getUnique(suggestions[currentItem])
                                      ? styles.current
                                      : ""
                              }`,
                              getUnique(suggestion),
                              (value) => {
                                  onSelect(value);
                                  clearSuggestions();
                              },
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
