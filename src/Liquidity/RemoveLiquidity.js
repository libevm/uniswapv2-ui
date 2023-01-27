import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {
  getBalanceAndSymbol,
  getReserves,
  getNetwork,
  getProvider,
} from "../ethereumFunctions";
import { removeLiquidity, quoteRemoveLiquidity } from "./LiquidityFunctions";
import {
  RemoveLiquidityField1,
  RemoveLiquidityField2,
} from "../CoinSwapper/CoinField";
import CoinDialog from "../CoinSwapper/CoinDialog";
import LoadingButton from "../Components/LoadingButton";
import WrongNetwork from "../Components/WrongNetwork";

function LiquidityRemover(props) {
  const { enqueueSnackbar } = useSnackbar();

  // Stores a record of whether their respective dialog window is open
  const [dialog1Open, setDialog1Open] = useState(false);
  const [dialog2Open, setDialog2Open] = useState(false);
  const [wrongNetworkOpen, setwrongNetworkOpen] = useState(false);

  // Stores data about their respective coin
  const [coin1, setCoin1] = useState({
    address: undefined,
    symbol: undefined,
    balance: undefined,
  });
  const [coin2, setCoin2] = useState({
    address: undefined,
    symbol: undefined,
    balance: undefined,
  });

  // Stores the current reserves in the liquidity pool between coin1 and coin2
  const [reserves, setReserves] = useState(["0.0", "0.0"]);

  // Stores the current value of their respective text box
  const [field1Value, setField1Value] = useState("");

  // Controls the loading button
  const [loading, setLoading] = useState(false);

  // Stores the liquidity tokens balance of the user
  const [liquidityTokens, setLiquidityTokens] = useState("");

  // Stores the input and output for the liquidity removal preview
  const [tokensOut, setTokensOut] = useState([0, 0, 0]);

  // Switches the top and bottom coins, this is called when users hit the swap button or select the opposite
  // token in the dialog (e.g. if coin1 is TokenA and the user selects TokenB when choosing coin2)
  const switchFields = () => {
    setCoin1(coin2);
    setCoin2(coin1);
    setReserves(reserves.reverse());
  };

  // These functions take an HTML event, pull the data out and puts it into a state variable.
  const handleChange = {
    field1: (e) => {
      setField1Value(e.target.value);
    },
  };

  // Turns the account's balance into something nice and readable
  const formatBalance = (balance, symbol) => {
    if (balance && symbol)
      return parseFloat(balance).toPrecision(8) + " " + symbol;
    else return "";
  };

  // Turns the coin's reserves into something nice and readable
  const formatReserve = (reserve, symbol) => {
    if (reserve && symbol) return reserve + " " + symbol;
    else return "";
  };

  // Determines whether the button should be enabled or not
  const isButtonEnabled = () => {
    // If both coins have been selected, and a valid float has been entered for both, which are less than the user's balances, then return true
    const parsedInput = parseFloat(field1Value);
    return (
      coin1.address &&
      coin2.address &&
      parsedInput !== NaN &&
      0 < parsedInput &&
      parsedInput <= liquidityTokens
    );
  };

  const remove = () => {
    console.log("Attempting to remove liquidity...");
    setLoading(true);

    removeLiquidity(
      coin1.address,
      coin2.address,
      field1Value,
      0,
      0,
      props.network.router,
      props.network.account,
      props.network.signer,
      props.network.factory
    )
      .then(() => {
        setLoading(false);

        // If the transaction was successful, we clear to input to make sure the user doesn't accidental redo the transfer
        setField1Value("");
        enqueueSnackbar("Removal Successful", { variant: "success" });
      })
      .catch((e) => {
        setLoading(false);
        enqueueSnackbar("Deployment Failed (" + e.message + ")", {
          variant: "error",
          autoHideDuration: 10000,
        });
      });
  };

  // Called when the dialog window for coin1 exits
  const onToken1Selected = (address) => {
    // Close the dialog window
    setDialog1Open(false);

    // If the user inputs the same token, we want to switch the data in the fields
    if (address === coin2.address) {
      switchFields();
    }
    // We only update the values if the user provides a token
    else if (address) {
      // Getting some token data is async, so we need to wait for the data to return, hence the promise
      getBalanceAndSymbol(
        props.network.account,
        address,
        props.network.provider,
        props.network.signer,
        props.network.weth.address,
        props.network.coins
      ).then((data) => {
        setCoin1({
          address: address,
          symbol: data.symbol,
          balance: data.balance,
        });
      });
    }
  };

  // Called when the dialog window for coin2 exits
  const onToken2Selected = (address) => {
    // Close the dialog window
    setDialog2Open(false);

    // If the user inputs the same token, we want to switch the data in the fields
    if (address === coin1.address) {
      switchFields();
    }
    // We only update the values if the user provides a token
    else if (address) {
      // Getting some token data is async, so we need to wait for the data to return, hence the promise
      getBalanceAndSymbol(
        props.network.account,
        address,
        props.network.provider,
        props.network.signer,
        props.network.weth.address,
        props.network.coins
      ).then((data) => {
        setCoin2({
          address: address,
          symbol: data.symbol,
          balance: data.balance,
        });
      });
    }
  };

  useEffect(() => {
    const fetchNetwork = async () => {
      const net = await getNetwork(getProvider());
      console.log(net);
      if (net === 5001) {
        setwrongNetworkOpen(false);
      } else {
        setwrongNetworkOpen(true);
      }
    };

    fetchNetwork();
  }, []);

  // This hook is called when either of the state variables `coin1.address` or `coin2.address` change.
  // This means that when the user selects a different coin to convert between, or the coins are swapped,
  // the new reserves will be calculated.
  useEffect(() => {
    console.log(
      "Trying to get reserves between:\n" + coin1.address + "\n" + coin2.address
    );

    if (coin1.address && coin2.address && props.network.account) {
      getReserves(
        coin1.address,
        coin2.address,
        props.network.factory,
        props.network.signer,
        props.network.account
      ).then((data) => {
        setReserves([data[0], data[1]]);
        setLiquidityTokens(data[2]);
      });
    }
  }, [
    coin1.address,
    coin2.address,
    props.network.account,
    props.network.factory,
    props.network.signer,
  ]);

  // This hook is called when either of the state variables `field1Value`, `coin1.address` or `coin2.address` change.
  // It will give a preview of the liquidity removal.
  useEffect(() => {
    if (isButtonEnabled()) {
      console.log("Trying to preview the liquidity removal");
      quoteRemoveLiquidity(
        coin1.address,
        coin2.address,
        field1Value,
        props.network.factory,
        props.network.signer
      ).then((data) => {
        setTokensOut(data);
      });
    }
  }, [
    coin1.address,
    coin2.address,
    field1Value,
    props.network.factory,
    props.network.signer,
  ]);

  useEffect(() => {
    // This hook creates a timeout that will run every ~10 seconds, it's role is to check if the user's balance has
    // updated has changed. This allows them to see when a transaction completes by looking at the balance output.

    const coinTimeout = setTimeout(() => {
      console.log("Checking balances & Getting reserves...");

      if (coin1.address && coin2.address && props.network.account) {
        getReserves(
          coin1.address,
          coin2.address,
          props.network.factory,
          props.network.signer,
          props.network.account
        ).then((data) => {
          setReserves([data[0], data[1]]);
          setLiquidityTokens(data[2]);
        });
      }

      if (coin1.address && props.network.account && !wrongNetworkOpen) {
        getBalanceAndSymbol(
          props.network.account,
          coin1.address,
          props.network.provider,
          props.network.signer,
          props.network.weth.address,
          props.network.coins
        ).then((data) => {
          setCoin1({
            ...coin1,
            balance: data.balance,
          });
        });
      }
      if (coin2.address && props.network.account && !wrongNetworkOpen) {
        getBalanceAndSymbol(
          props.network.account,
          coin2.address,
          props.network.provider,
          props.network.signer,
          props.network.weth.address,
          props.network.coins
        ).then((data) => {
          setCoin2({
            ...coin2,
            balance: data.balance,
          });
        });
      }
    }, 10000);

    return () => clearTimeout(coinTimeout);
  });

  return (
    <div>
      {/* Dialog Windows */}
      <CoinDialog
        open={dialog1Open}
        onClose={onToken1Selected}
        closeModal={() => setDialog1Open(false)}
        accountAddress={props.network.account}
        provider={props.network.provider}
        signer={props.network.signer}
        weth_address={props.network.weth.address}
        coins={props.network.coins}
      />
      <CoinDialog
        open={dialog2Open}
        onClose={onToken2Selected}
        closeModal={() => setDialog2Open(false)}
        accountAddress={props.network.account}
        provider={props.network.provider}
        signer={props.network.signer}
        weth_address={props.network.weth.address}
        coins={props.network.coins}
      />

      <div className="flex-1 flex justify-start items-center flex-col w-full">
        <div className="mt-10 w-full flex justify-center">
          <div className="relative md:max-w-[700px] md:min-w-[500px] min-w-full max-w-full p-[2px] rounded-3xl">
            <div className="w-full min-h-[400px] bg-primary-gray backdrop-blur-[4px] rounded-3xl shadow-card flex flex-col p-10">
              {wrongNetworkOpen ? (
                <WrongNetwork></WrongNetwork>
              ) : (
                <div>
                  <div className="mb-4">
                    <RemoveLiquidityField1
                      activeField={true}
                      onClick1={() => setDialog1Open(true)}
                      onClick2={() => setDialog2Open(true)}
                      symbol1={
                        coin1.symbol !== undefined ? coin1.symbol : "Select"
                      }
                      symbol2={
                        coin2.symbol !== undefined ? coin2.symbol : "Select"
                      }
                    />
                  </div>
                  <div className="mb-2 w-[100%]">
                    <RemoveLiquidityField2
                      activeField={true}
                      value={field1Value}
                      onChange={handleChange.field1}
                    />
                  </div>

                  <div className="mt-4 mb-6">
                    <h3 className="text-center text-white font-semibold text-lg">
                      LP-Token Balance
                    </h3>
                    <div className="flex justify-center items-center w-full">
                      <p className="font-poppins font-normal text-white">
                        {formatReserve(liquidityTokens, "UNI-V2")}
                      </p>
                    </div>
                  </div>

                  <div className="relative min-w-full max-w-full p-[2px] rounded-3xl mb-4">
                    <div className="w-full bg-primary-black backdrop-blur-[4px] rounded-3xl shadow-card flex flex-row justify-around p-4 text-white">
                      <div className="flex flex-col">
                        <h6 className="font-bold text-lg text-center">
                          Tokens In
                        </h6>
                        <div className="mx-auto">
                          {formatBalance(tokensOut[0], "UNI-V2")}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <h6 className="font-bold text-lg text-center">
                          Tokens Out
                        </h6>
                        <div className="mx-auto">
                          {formatBalance(tokensOut[1], coin1.symbol)}
                        </div>
                        <div className="mx-auto">
                          {formatBalance(tokensOut[2], coin2.symbol)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <LoadingButton
                    loading={loading}
                    valid={isButtonEnabled()}
                    success={false}
                    fail={false}
                    onClick={remove}
                  >
                    Remove
                  </LoadingButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiquidityRemover;
