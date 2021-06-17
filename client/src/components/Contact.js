import Header from "./Header";
import styles from "../css/Contact.module.css";
const Contact = ({ logoVariant }) => {
  return (
    <>
      <Header logoVariant={logoVariant} />
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>Contact Us</h1>
        </div>
        <div className={styles.cols}></div>
      </div>
    </>
  );
};

export default Contact;
