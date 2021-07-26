import styles from "../css/Button.module.css";
const Button = ({ children, disabled, clickedCallback, ...allProps }) => {
  let className = "";
  if (allProps["type"] === "primary") className = styles.primary;
  if (allProps["type"] === "clear") className = styles.clear;

  return (
    <a
      className={`${styles.button} ${
        disabled ? styles.disabled : ""
      } ${className} ${allProps["classes"]}`}
      onClick={(e) => {
        if (!disabled && clickedCallback) clickedCallback(e);
      }}
      {...allProps}
    >
      {children}
    </a>
  );
};

export default Button;
