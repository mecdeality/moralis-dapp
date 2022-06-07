import "./App.css";
import { useMoralis } from "react-moralis";
import useInchDex from "./hooks/useInchDex.js";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  NavLink,
  Navigate,
} from "react-router-dom";
import Transfer from "./components/Transfer/transfer";
import DexContainer from "./components/DEX/dexcontainer";
import Home from "./components/Home/main";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import History from "./components/History/history";
import { useEffect } from "react";

function App() {
  // const {Moralis} = useMoralis()
  // console.log(dex.isOpened)

  // const a = Moralis.Plugins.oneInch

  // if(a) console.log(a.getSupportedTokens())
  const { isWeb3Enabled, isAuthenticated, enableWeb3 } = useMoralis();

  useEffect(() => {
    if (isAuthenticated) {
      enableWeb3();
    }
  }, [isAuthenticated]);
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/moralis-dapp" element={<Navigate to="/" replace />} />
          <Route exact path="/" element={<Home />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/dex" element={<DexContainer />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
