import styles from "./css/App.module.css";
import Main from "./components/Main";
import About from "./components/About";
import FAQ from "./components/Faq";
import Contact from "./components/Contact";
import Header from "./components/Header";

import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}

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
      <Routes>
        <Route path="/about" element={<About></About>}/>
        <Route path="/faq" element={<FAQ></FAQ>}/>
        <Route path="/contact" element={<Contact></Contact>}/>
        <Route path="/" element={<Main></Main>}/>
      </Routes>
    </Router>
  );
}

export default App;
