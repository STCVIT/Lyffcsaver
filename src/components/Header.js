import styles from "../css/Header.module.css";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "../assets/logo.svg";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import Joyride, { STATUS } from "react-joyride";

const Header = ({ location }) => {
  const [expanded, setExpanded] = useState(false);
  const [joyrideRunning, setJoyrideRunning] = useState(false);
  const steps = [
    {
      target: "#reserve-slots-section",
      content: (
        <>
          <div>
            Specify which slots you want free, so that we can generate
            timetables where there will be no class in those slots
          </div>
          <br />
          <ul>
            <li align="inline-start">
              <strong>Change View: </strong>Switch between Timetable and legacy
              views to select your slots
            </li>
            <li align="inline-start">
              <strong>Clear: </strong>De-Select all selected slots
            </li>
            <li align="inline-start">
              <strong>Skip: </strong>Scroll to next section
            </li>
          </ul>
        </>
      ),
      title: <h2>Reserve Slots</h2>,
      disableBeacon: true,
    },
  ];

  return (
    <>
      <Joyride
        steps={steps}
        run={joyrideRunning}
        scrollOffset={300}
        callback={({ status, type }) => {
          const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
          if (finishedStatuses.includes(status)) setJoyrideRunning(false);
        }}
        continuous
        showSkipButton
        showProgress
        spotlightClicks
      ></Joyride>
      <Navbar
        collapseOnSelect
        variant="light"
        expand="lg"
        className={styles.navbar}
        expanded={expanded}
      >
        <Container>
          <Navbar.Brand className={styles.brand} href="#/">
            <img src={logo} alt="" className={styles.logo} />
            <strong className={styles.logoType}>
              ly<span className={styles.highlight}>FFCS</span>aver
            </strong>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(expanded ? false : "expanded")}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav activeKey={location.pathname} className={styles.navLinks}>
              <NavLink
                activeClassName={styles.active}
                to="/home"
                onClick={() => setExpanded(false)}
              >
                Home
              </NavLink>
              <NavLink
                activeClassName={styles.active}
                to="/about"
                onClick={() => setExpanded(false)}
              >
                About
              </NavLink>
              <NavLink
                activeClassName={styles.active}
                to="/faq"
                onClick={() => setExpanded(false)}
              >
                FAQs
              </NavLink>
              <NavLink
                activeClassName={styles.active}
                to="/contact"
                onClick={() => setExpanded(false)}
              >
                Contact Us
              </NavLink>
            </Nav>
            <a
              href="#"
              className={styles.blockLink}
              onClick={() => {
                setExpanded(false);
                setJoyrideRunning(true);
              }}
            >
              HOW THIS WORKS?
            </a>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
