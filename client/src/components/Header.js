import styles from "../css/Header.module.css";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
const Header = ({ logoVariant }) => {
  return (
    <Navbar variant="light" expand="lg" className={styles.navbar}>
      <Container>
        <Navbar.Brand href="#">
          <p className={styles[logoVariant]}>
            Ly<strong>ffcs</strong>aver
          </p>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={styles.navLinks}>
            <Nav.Link activeClassName={styles.active} href="#about">
              About
            </Nav.Link>
            <Nav.Link activeClassName={styles.active} href="#faq">
              FAQs
            </Nav.Link>
            <Nav.Link activeClassName={styles.active} href="#contact">
              Contact Us
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
