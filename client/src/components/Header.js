import styles from "../css/Header.module.css";
import { Navbar, Nav, Container, Na } from "react-bootstrap";
import logo from "../assets/logo.svg";
import { NavLink } from "react-router-dom";
const Header = ({ location }) => {
  console.log("rerender header");
  return (
    <>
      <Navbar
        variant="light"
        expand="lg"
        className={styles.navbar}
        collapseOnSelect
      >
        <Container>
          <Navbar.Brand href="/">
            <img src={logo} alt="" className={styles.logo} />
            <strong className={styles.logoType}>
              ly<span className={styles.highlight}>FFCS</span>aver
            </strong>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav activeKey={location.pathname} className={styles.navLinks}>
              <NavLink activeClassName={styles.active} to="/home">
                Home
              </NavLink>
              <NavLink activeClassName={styles.active} to="/about">
                About
              </NavLink>
              <NavLink activeClassName={styles.active} to="/faq">
                FAQs
              </NavLink>
              <NavLink activeClassName={styles.active} to="/contact">
                Contact Us
              </NavLink>
              {/* <NavLink.Divider></NavLink.Divider> */}
            </Nav>
            <a href="#" className={styles.blockLink}>
              HOW THIS WORKS?
            </a>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
