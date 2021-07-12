import styles from "./css/App.module.css";
import Main from "./components/Main";
import About from "./components/About";
import FAQ from "./components/Faq";
import Contact from "./components/Contact";
import Header from "./components/Header";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";
const HeaderWithRouter = withRouter(Header);

function App() {
  {
    // <>
    //   <Main></Main>
    //   <div className={styles.screen}>
    //     <About></About>
    //     <FAQ></FAQ>
    //     <Contact></Contact>
    //   </div>
    // </>
  }
  return (
    <Router>
      <HeaderWithRouter></HeaderWithRouter>
      <Switch>
        <Route path="/about">
          <About></About>
        </Route>
        <Route path="/faq">
          <FAQ></FAQ>
        </Route>
        <Route path="/contact">
          <Contact></Contact>
        </Route>
        <Route path="/">
          <Main></Main>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
