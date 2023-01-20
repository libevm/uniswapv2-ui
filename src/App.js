import React from "react";
import Web3Provider from "./network";
import NarBar from "./NavBar/NavBar";
import CoinSwapper from "./CoinSwapper/CoinSwapper";
import { Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Liquidity from "./Liquidity/Liquidity";

const App = () => {
  return (
    <div className="App">
      <SnackbarProvider maxSnack={3}>
        <Web3Provider
          render={(network) => (
            <div>
              <NarBar />
              <Route exact path="/">
                <CoinSwapper network={network} />
              </Route>

              <Route exact path="/liquidity">
                <Liquidity network={network} />
              </Route>
            </div>
          )}
        ></Web3Provider>
      </SnackbarProvider>
    </div>
  );
};

export default App;
