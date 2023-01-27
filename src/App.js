import React from "react";
import Web3ProviderCore from "./network";
import NarBar from "./NavBar/NavBar";
import CoinSwapper from "./CoinSwapper/CoinSwapper";
import { Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Liquidity from "./Liquidity/Liquidity";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  return library;
};

const App = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <SnackbarProvider maxSnack={3}>
        <Web3ProviderCore
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
        ></Web3ProviderCore>
      </SnackbarProvider>
    </Web3ReactProvider>
  );
};

export default App;
