import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {
  getAmountOut,
  getBalanceAndSymbol,
  swapTokens,
  getReserves,
} from "../ethereumFunctions";
import CoinField from "./CoinField";
import CoinDialog from "./CoinDialog";
import Balance from "../Components/Balance";
import LoadingButton from "../Components/LoadingButton";
import WrongNetwork from "../Components/WrongNetwork";
import { useWeb3React } from "@web3-react/core";

function CoinSwapper(props) {
  const { account, chainId } = useWeb3React();

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
  const [field2Value, setField2Value] = useState("");

  // Controls the loading button
  const [loading, setLoading] = useState(false);

  // Switches the top and bottom coins, this is called when users hit the swap button or select the opposite
  // token in the dialog (e.g. if coin1 is TokenA and the user selects TokenB when choosing coin2)
  const switchFields = () => {
    setCoin1(coin2);
    setCoin2(coin1);
    setField1Value(field2Value);
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
    else return "0.0";
  };

  // Determines whether the button should be enabled or not
  const isButtonEnabled = () => {
    // If both coins have been selected, and a valid float has been entered which is less than the user's balance, then return true
    const parsedInput1 = parseFloat(field1Value);
    const parsedInput2 = parseFloat(field2Value);
    return (
      coin1.address &&
      coin2.address &&
      !isNaN(parsedInput1) &&
      !isNaN(parsedInput2) &&
      0 < parsedInput1 &&
      parsedInput1 <= coin1.balance
    );
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

  // Calls the swapTokens Ethereum function to make the swap, then resets nessicary state variables
  const swap = () => {
    console.log("Attempting to swap tokens...");
    setLoading(true);

    swapTokens(
      coin1.address,
      coin2.address,
      field1Value,
      props.network.router,
      props.network.account,
      props.network.signer
    )
      .then(() => {
        setLoading(false);

        // If the transaction was successful, we clear to input to make sure the user doesn't accidental redo the transfer
        setField1Value("");
        enqueueSnackbar("Transaction Successful", { variant: "success" }); ///
      })
      .catch((e) => {
        setLoading(false);
        enqueueSnackbar("Transaction Failed (" + e.message + ")", {
          ///
          variant: "error",
          autoHideDuration: 10000,
        });
      });
  };

  useEffect(() => {
    if (account && chainId === 5001) {
      props.setupConnection();
      setwrongNetworkOpen(false);
    } else {
      setwrongNetworkOpen(true);
    }
  }, [account, chainId]);

  // The lambdas within these useEffects will be called when a particular dependency is updated. These dependencies
  // are defined in the array of variables passed to the function after the lambda expression. If there are no dependencies
  // the lambda will only ever be called when the component mounts. These are very useful for calculating new values
  // after a particular state change, for example, calculating the new exchange rate whenever the addresses
  // of the two coins change.

  // This hook is called when either of the state variables `coin1.address` or `coin2.address` change.
  // This means that when the user selects a different coin to convert between, or the coins are swapped,
  // the new reserves will be calculated.
  useEffect(() => {
    if (coin1.address && coin2.address) {
      getReserves(
        coin1.address,
        coin2.address,
        props.network.factory,
        props.network.signer,
        props.network.account
      ).then((data) => setReserves(data));
    }
  }, [
    coin1.address,
    coin2.address,
    props.network.account,
    props.network.factory,
    props.network.router,
    props.network.signer,
  ]);

  // This hook is called when either of the state variables `field1Value` `coin1.address` or `coin2.address` change.
  // It attempts to calculate and set the state variable `field2Value`
  // This means that if the user types a new value into the conversion box or the conversion rate changes,
  // the value in the output box will change.
  useEffect(() => {
    if (isNaN(parseFloat(field1Value))) {
      setField2Value("");
    } else if (parseFloat(field1Value) && coin1.address && coin2.address) {
      getAmountOut(
        coin1.address,
        coin2.address,
        field1Value,
        props.network.router,
        props.network.signer
      )
        .then((amount) => setField2Value(amount.toFixed(7)))
        .catch((e) => {
          console.log(e);
          setField2Value("NA");
        });
    } else {
      setField2Value("");
    }
  }, [
    field1Value,
    coin1.address,
    coin2.address,
    props.network.router,
    props.network.signer,
  ]);

  // This hook creates a timeout that will run every ~10 seconds, it's role is to check if the user's balance has
  // updated has changed. This allows them to see when a transaction completes by looking at the balance output.
  useEffect(() => {
    const coinTimeout = setTimeout(() => {
      if (coin1.address && coin2.address && props.network.account) {
        getReserves(
          coin1.address,
          coin2.address,
          props.network.factory,
          props.network.signer,
          props.network.account
        ).then((data) => setReserves(data));
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
    <div className="flex justify-center min-h-screen sm:px-16 px-6 bg-primary-black">
      <div className="flex justify-between items-center flex-col max-w-[1280px] w-full">
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

        <div className="flex-1 flex justify-start items-center flex-col w-full mt-2">
          <div className="mt-10 w-full flex justify-center">
            <div className="relative md:max-w-[700px] md:min-w-[500px] min-w-full max-w-full p-[2px] rounded-3xl">
              <div className="w-full bg-primary-gray backdrop-blur-[4px] rounded-3xl shadow-card flex flex-col p-10">
                {wrongNetworkOpen ? (
                  <WrongNetwork></WrongNetwork>
                ) : (
                  <div>
                    <div>
                      <CoinField
                        activeField={true}
                        value={field1Value}
                        onClick={() => setDialog1Open(true)}
                        onChange={handleChange.field1}
                        symbol={
                          coin1.symbol !== undefined ? coin1.symbol : "Select"
                        }
                      />
                      <Balance
                        balance={coin1.balance}
                        symbol={coin1.symbol}
                        format={formatBalance}
                      />
                    </div>
                    <button
                      className="flex items-center justify-center p-2 mx-auto"
                      onClick={switchFields}
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="arrow-down"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 384 512"
                        className="text-primary-green h-4"
                      >
                        <path
                          fill="currentColor"
                          d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"
                        ></path>
                      </svg>
                    </button>

                    <div className="mb-6 w-[100%]">
                      <CoinField
                        activeField={false}
                        value={field2Value}
                        onClick={() => setDialog2Open(true)}
                        symbol={
                          coin2.symbol !== undefined ? coin2.symbol : "Select"
                        }
                      />
                      <Balance
                        balance={coin2.balance}
                        symbol={coin2.symbol}
                        format={formatBalance}
                      />
                    </div>
                    <LoadingButton
                      loading={loading}
                      valid={isButtonEnabled()}
                      onClick={swap}
                    >
                      Swap
                    </LoadingButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoinSwapper;
