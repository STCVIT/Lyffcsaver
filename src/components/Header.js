import styles from "../css/Header.module.css";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "../assets/logo.svg";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import Joyride, { STATUS } from "react-joyride";

const Header = ({ router }) => {
  const location = router.location;
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
    {
      target: "#add-courses-section",
      content: (
        <div>
          This is where you will add courses and classes for each course. You
          also get the chance to arrange classes by your preference.
        </div>
      ),
      title: <h2>Add Courses</h2>,
      disableBeacon: true,
    },
    {
      target: "#course-select-autocomplete",
      content: (
        <div align="inline-start">
          Here you can search and select your courses. You can search for
          courses by either their course code or their course title.
          <br />
          We automatically add all components of each course you select.
          <br />
          <details>
            <summary>
              <strong>Navigation</strong>
            </summary>
            Use arrow keys to navigate search suggestions and Enter key to
            select course or just use mouse to click the course you want to
            select.
          </details>
          <strong>Try adding CSE1002 and click next when ready.</strong>
        </div>
      ),
      title: <h2>Stage Courses</h2>,
      disableBeacon: true,
      placement: "bottom",
    },
    {
      target: "#added-courses",
      content: (
        <div>
          All the course components you&apos;ve added show up here. We
          automatically select the course that you last added. You can click
          other courses to select them instead.
        </div>
      ),
      title: <h2>Staged Courses</h2>,
      disableBeacon: true,
    },
    {
      target: ".staged-course",
      content: (
        <div align="inline-start">
          <details>
            <summary>
              <strong>Colored Indicator</strong>
            </summary>
            The indicator on each component shows whether classes have been
            selected for that component.
            <ul>
              <li>Red - No classes selected for course component</li>
              <li>Green - One or more classes selected for course component</li>
            </ul>
          </details>

          <details>
            <summary>
              <strong>Highlighted component</strong>
            </summary>
            If the component has a purple highlight, this means that this
            component is currently selected
          </details>
          <details>
            <summary>
              <strong>Greyed out component</strong>
            </summary>
            Course components where there are no slots (like project components)
            are greyed out as classes cannot be added for them.
          </details>
          <details>
            <summary>
              <strong>Remove course</strong>
            </summary>
            Click the big red &quot;X&quot; to remove the course from your
            selection. Don&apos;t worry you can add it back later if you want
            to.
          </details>
        </div>
      ),
      title: <h2>Staged Course</h2>,
      disableBeacon: true,
    },
    {
      target: "#staged-courses-footer",
      content: (
        <div align="inline-start">
          Total Credits shows how many credits have been added so far.
          <br />
          Clicking on clear removes all added courses so you can have a fresh
          start.
        </div>
      ),
      title: <h2>Staged Courses Footer</h2>,
      disableBeacon: true,
    },
    {
      target: "#class-selection-section",
      content: (
        <div align="inline-start">
          Here you can add classes for the currently selected course from
          previous section (highlighted course).
        </div>
      ),
      title: <h2>Select Classes</h2>,
      disableBeacon: true,
    },
    {
      target: "#class-selection-query-row",
      content: (
        <div align="inline-start">
          Use the searchbar to search for a class by Faculty Name or their
          Employee ID.
          <br />
          You can also filter classes by the slot that they are taken in.
        </div>
      ),
      title: <h2>Query Classes</h2>,
      disableBeacon: true,
    },
    {
      target: ".selectable-class",
      content: (
        <div align="inline-start">
          Click the green &quot;+&quot; to add class.
          <br />
          <strong>
            Try to add two or more classes and click next when ready
          </strong>
        </div>
      ),
      title: <h2>Selectable Class</h2>,
      disableBeacon: true,
    },
    {
      target: "#class-priority",
      content: (
        <div align="inline-start">
          The classes that you&apos;ve added for the selected course show up
          here. You can arrange classes based on your priorities.
        </div>
      ),
      title: <h2>Class Priority</h2>,
      disableBeacon: true,
    },
    {
      target: ".draggable-class",
      content: (
        <div align="inline-start">
          Click and drag with the drag handle to reorder the classes
        </div>
      ),
      title: <h2>Draggable Class</h2>,
      disableBeacon: true,
    },
    {
      target: "#generate-timetables",
      content: (
        <div align="inline-start">
          Click the button to generate timetables according to courses and
          classes you&apos;ve selected.
          <br />
          Note that changes you make will not be reflected on the timetables
          till you click generate timetables again.
          <br />
          <strong>
            Try pressing it and click next once timetables are generated
          </strong>
        </div>
      ),
      title: <h2>Generate timetables</h2>,
      disableBeacon: true,
    },
    {
      target: ".timetable-preview",
      content: (
        <div align="inline-start">
          Here you see a preview for what your generated timetable looks like.
          <br />
          <strong>Try selecting one and then press next when ready.</strong>
        </div>
      ),
      title: <h2>Timetable Preview</h2>,
      disableBeacon: true,
    },
    {
      target: "#filled-out-timetable",
      content: (
        <div align="inline-start">
          This is your filled out timetable. You can hover over slots for more
          info.
        </div>
      ),
      title: <h2>Timetable</h2>,
      disableBeacon: true,
    },
    {
      target: "#classes",
      content: (
        <div align="inline-start">
          Here you can see which class has been selected for each course. By
          default, we pick the class with highest preference. By clicking the
          radio button you can select a different class.
        </div>
      ),
      title: <h2>Classes</h2>,
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
        showProgress
        showSkipButton
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
                className={({isActive}) => {
                  return isActive ? styles.active : null
                }}
                to="/"
                onClick={() => setExpanded(false)}
              >
                Home
              </NavLink>
              <NavLink
                className={({isActive}) => {
                  return isActive ? styles.active : null
                }}
                to="/about"
                onClick={() => setExpanded(false)}
              >
                About
              </NavLink>
              <NavLink
                className={({isActive}) => {
                  return isActive ? styles.active : null
                }}
                to="/faq"
                onClick={() => setExpanded(false)}
              >
                FAQs
              </NavLink>
              <NavLink
                className={({isActive}) => {
                  return isActive ? styles.active : null
                }}
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
