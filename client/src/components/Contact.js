import Header from "./Header";
import styles from "../css/Contact.module.css";
import contactIllustration from "../assets/contactIllustration.svg";
import contactNameIcon from "../assets/contactNameIcon.svg";
import contactEmailIcon from "../assets/contactEmailIcon.svg";
import contactMessageIcon from "../assets/contactMessageIcon.svg";
const Contact = ({ logoVariant }) => {
  // setInterval(() => {
  //   console.log("hello");
  //   const inputFields = document.querySelectorAll(`.${styles.inputField}`);
  //   inputFields.forEach((inputField) => {
  //     if (inputField?.value === "")
  //       inputField?.classList?.add(styles.disablePlaceholder);
  //   });
  // }, 1000)
  return (
    <div>
      {/* <script>
        function recheckInputFields() {
          inputFields = document.querySelectorAll(`.${styles.inputField}`);
          inputFields.forEach(inputField)
        }
        setInterval(recheckInputFields, 1000);
      </script> */}
      {/* {} */}
      <Header logoVariant={logoVariant} />
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>Contact Us</h1>
        </div>
        <div className={styles.subTitle}>
          <h6>Any questions or remarks? Send us a message!</h6>
        </div>
        <div className={styles.cols}>
          <div className={`${styles.col} ${styles.col1}`}>
            <form
              acceptCharset="UTF-8"
              action="https://www.formbackend.com/f/b97b77740d90fb8d"
              method="POST"
              className={styles.emailForm}
              onSubmit={(e) => {
                document.querySelector("form").reset();
              }}
            >
              <ul>
                <li>
                  <label htmlFor="name">Your Name</label>
                  <div className={styles.inputContainer}>
                    <div className={styles.placeholder}>
                      <img
                        src={contactNameIcon}
                        alt=""
                        className={styles.placeholderImage}
                      />
                      <p>Name</p>
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className={`${styles.inputField} ${styles.nameInput}`}
                      onFocus={(e) => {
                        e.target?.parentNode?.classList.add(
                          styles.disablePlaceholder
                        );
                      }}
                      onBlur={(e) => {
                        if (e.target?.value === "")
                          e.target?.parentNode?.classList.remove(
                            styles.disablePlaceholder
                          );
                      }}
                      onChange={(e) => {
                        e.target?.parentNode?.classList.add(
                          styles.disablePlaceholder
                        );
                      }}
                      required
                    />
                  </div>
                </li>
                <li>
                  <label htmlFor="email">Your E-mail</label>
                  <div className={styles.inputContainer}>
                    <div className={styles.placeholder}>
                      <img
                        src={contactEmailIcon}
                        alt=""
                        className={styles.placeholderImage}
                      />
                      <p>Email</p>
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className={`${styles.inputField} ${styles.emailInput}`}
                      onFocus={(e) => {
                        e.target?.parentNode?.classList.add(
                          styles.disablePlaceholder
                        );
                      }}
                      onBlur={(e) => {
                        if (e.target?.value === "")
                          e.target?.parentNode?.classList.remove(
                            styles.disablePlaceholder
                          );
                      }}
                      onChange={(e) => {
                        e.target?.parentNode?.classList.add(
                          styles.disablePlaceholder
                        );
                      }}
                      required
                    />
                  </div>
                </li>
                <li>
                  <label htmlFor="message">Your message</label>
                  <div
                    className={`${styles.inputContainer} ${styles.messageInputContainer}`}
                  >
                    <div className={`${styles.placeholder} `}>
                      <img
                        src={contactMessageIcon}
                        alt=""
                        className={styles.placeholderImage}
                      />
                      <p>Message</p>
                    </div>
                    <textarea
                      name="message"
                      id="message"
                      className={`${styles.inputField} ${styles.messageInput}`}
                      rows={5}
                      onFocus={(e) => {
                        e.target?.parentNode?.classList.add(
                          styles.disablePlaceholder
                        );
                      }}
                      onBlur={(e) => {
                        if (e.target?.value === "")
                          e.target?.parentNode?.classList.remove(
                            styles.disablePlaceholder
                          );
                      }}
                      onChange={(e) => {
                        e.target?.parentNode?.classList.add(
                          styles.disablePlaceholder
                        );
                      }}
                      required
                    />
                  </div>
                </li>
                <li className={styles.submitRow}>
                  <input
                    type="submit"
                    value="Send Message"
                    className={styles.sendButton}
                  />
                </li>
              </ul>
            </form>
          </div>
          <div className={`${styles.col} ${styles.col2}`}>
            <img
              src={contactIllustration}
              alt="Illustration of three people sending mail."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
