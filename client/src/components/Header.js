import styles from "../css/Header.module.css";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
const Header = ({ logoVariant }) => {
  return (
    <Navbar variant="light" expand="lg" className={styles.navbar}>
      <Container>
        <Navbar.Brand href={"/"}>
          <p className={styles[logoVariant]}>
            Ly<strong>ffcs</strong>aver
          </p>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={styles.navLinks}>
            <NavLink activeClassName={styles.active} to="/about">
              About
            </NavLink>
            <NavLink activeClassName={styles.active} to="/faq">
              FAQs
            </NavLink>
            <NavLink activeClassName={styles.active} to="/contact">
              Contact Us
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
