import styles from "./css/App.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Main from "./components/Main";
import About from "./components/About";
import FAQ from "./components/Faq";
import Contact from "./components/Contact";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// // TODO: Make separate list components instead of just one that changes according to the props passed in
// // TODO: Generate timetables based on preferences (generator function)
// // TODO: Figure out how to work with timetables (slots, timings)
// // TODO: Render timetables
// // TODO: Reorder faculty list by dragging (react-beautiful-dnd)
// TODO: Refactor and make classes for schedules, faculties and classes
// TODO: Add jsdoc wherever necessary

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/about">
          <About logoVariant={"logotypePrimary"}></About>
        </Route>
        <Route path="/faq">
          <FAQ logoVariant={"logotypePrimary"}></FAQ>
        </Route>
        <Route path="/contact">
          <Contact logoVariant={"logotypePrimary"}></Contact>
        </Route>
        <Route path="/">
          <Main logoVariant={"logotype"}></Main>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
