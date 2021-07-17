import styles from "../css/Header.module.css";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "../assets/logo.svg";
import { NavLink } from "react-router-dom";
import { useState } from "react";
const Header = ({ location }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
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
              onClick={() => setExpanded(false)}
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
