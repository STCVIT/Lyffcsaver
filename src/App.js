import styles from "./css/App.module.css";
import Header from "./components/Header";
import Options from "./components/Options";

function App() {
  return (
    <div className={styles.App}>
      <Header />
      <Options />
    </div>
  );
}

export default App;
