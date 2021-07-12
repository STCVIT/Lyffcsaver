import styles from "../css/Faq.module.css";
import {
  Accordion,
  AccordionContext,
  Card,
  useAccordionToggle,
} from "react-bootstrap";
import toggleTriangle from "../assets/toggleTriangle.svg";
import { useContext } from "react";

const Faq = () => {
  const questions = ["What is FFCS?", "question 2", "question 3", "question 4"];
  const answers = [
    "FFCS refers to the fully flexible credit system offered by VIT, allowing students to make timetables according to their needs. With this, students can choose their own subjects, slots, faculties, class timings and venues. Even though this sounds easy, this process can be confusing and complicated, specially for first timers.",
    "answer 2",
    "answer 3",
    "answer 4",
  ];
  function ContextAwareToggle({ children, eventKey, callback }) {
    const currentEventKey = useContext(AccordionContext);

    const decoratedOnClick = useAccordionToggle(
      eventKey,
      () => callback && callback(eventKey)
    );

    const isCurrentEventKey = currentEventKey === eventKey;

    return (
      <button
        type="button"
        className={`${styles.btn} ${isCurrentEventKey ? styles.clicked : ""}`}
        onClick={decoratedOnClick}
      >
        <span></span>
        <img src={toggleTriangle} alt=">" />
        {children}
      </button>
    );
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <span className={styles.goto} id="faq">
            &nbsp;
          </span>
          <h1 className="heading1">Frequently Asked Questions</h1>
        </div>
        <div className={styles.faqContainer}>
          <Accordion className={styles.accordion}>
            {questions.map((question, index) => {
              return (
                <Card className={styles.questionCard} key={index + question}>
                  <Card.Header className={styles.header}>
                    <ContextAwareToggle
                      eventKey={index + 1}
                    ></ContextAwareToggle>
                    <div className={`${styles.headerText} heading3`}>
                      {question}
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey={index + 1}>
                    <Card.Body className={`${styles.bodyText} body1-medium`}>
                      {answers[index]}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              );
            })}
          </Accordion>
        </div>
        <div className={styles.fadedText}>
          <p className="body1-bold">Still have questions?</p>
          <p className="body2-medium">
            If you cannot find answers to your questions here, you can always{" "}
            <a href="/contact">contact us</a>
            . <br />
            We will answer to you shortly!
          </p>
        </div>
      </div>
    </>
  );
};

export default Faq;
