import styles from "./css/App.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Main from "./components/Main";
import About from "./components/About";
import FAQ from "./components/Faq";
import Contact from "./components/Contact";
import Header from "./components/Header";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Header logoVariant={"logotype"} />
      <Main></Main>
      <div className={styles.screen}>
        <About></About>
        <FAQ></FAQ>
        <Contact></Contact>
      </div>
    </>
    // <Router>
    //   <Switch>
    //     <Route path="/about">
    //       <About logoVariant={"logotypePrimary"}></About>
    //     </Route>
    //     <Route path="/faq">
    //       <FAQ logoVariant={"logotypePrimary"}></FAQ>
    //     </Route>
    //     <Route path="/contact">
    //       <Contact logoVariant={"logotypePrimary"}></Contact>
    //     </Route>
    //     <Route path="/">
    //       <Main logoVariant={"logotype"}></Main>
    //     </Route>
    //   </Switch>
    // </Router>
  );
}

export default App;
