import styles from "../css/Button.module.css";
const Button = ({ children, ...allProps }) => {
  let className = "";
  if (allProps["type"] === "primary") className = styles.primary;
  if (allProps["type"] === "clear") className = styles.clear;

  return (
    <a
      className={`${styles.button} ${className} ${allProps["classes"]}`}
      {...allProps}
    >
      {children}
    </a>
  );
};

export default Button;
