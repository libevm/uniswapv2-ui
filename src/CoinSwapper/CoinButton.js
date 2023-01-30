import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getBalanceAndSymbol } from "../ethereumFunctions";
import Loader from "../Components/Loader";

CoinButton.propTypes = {
  coinName: PropTypes.string.isRequired,
  coinAbbr: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default function CoinButton(props) {
  const {
    coinName,
    coinAbbr,
    coinLogo,
    onClick,
    accountAddress,
    address,
    provider,
    signer,
    weth_address,
    coins,
  } = props;

  const [coinBalance, setCoinBalance] = useState();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    setShowLoader(true);
    getBalanceAndSymbol(
      accountAddress,
      address,
      provider,
      signer,
      weth_address,
      coins
    ).then((data) => {
      setCoinBalance(data.balance);
      setShowLoader(false);
    });
  }, []);

  const formatBalance = (balance) => {
    if (balance) {
      return parseFloat(balance).toPrecision(8);
    }
  };

  return (
    <button
      className="w-full flex justify-between items-center px-6 py-2 rounded-2xl hover:bg-secondary-gray"
      onClick={onClick}
    >
      <div className="flex flex-row items-center">
        {coinLogo ? (
          <img src={coinLogo} alt="" className="h-10 w-10 rounded-full mr-4" />
        ) : (
          <img
            alt=""
            className="h-10 w-10 rounded-full mr-4 bg-primary-black"
          />
        )}

        <div className="flex flex-col">
          <div className="text-white font-semibold text-md flex justify-start">
            {coinAbbr}
          </div>
          <div className="text-primary-green text-sm flex justify-start">
            {coinName}
          </div>
        </div>
      </div>
      {showLoader ? (
        <Loader></Loader>
      ) : (
        <div className="text-white">
          {coinBalance ? formatBalance(coinBalance) : "0.0"}
        </div>
      )}
    </button>
  );
}
