import { useEffect } from "react";
import { mantleBackground } from "../assets";
import { switchNetwork } from "../network";
import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { injected } from "../network";

const WrongNetwork = () => {
  const { active, account, chainId, activate, setError } = useWeb3React();

  useEffect(() => {
    console.log(active);
    console.log(account);
    console.log(chainId);
  });

  const onClickConnect = () => {
    activate(
      injected,
      (error) => {
        if (error instanceof UserRejectedRequestError) {
          // ignore user rejected error
          console.log("user refused");
        } else {
          setError(error);
        }
      },
      false
    );
  };

  return (
    <div>
      <div className="flex flex-col justify-end bg-primary-gray p-8 h-96">
        <p className="font-poppins font-semibold text-primary-green text-lg text-center my-4">
          {active && typeof account === "string"
            ? "Switch to Mantle Test Network!"
            : "Connect your Wallet!"}
        </p>
        <button
          onClick={
            active && typeof account === "string"
              ? switchNetwork
              : onClickConnect
          }
          className="bg-primary-green text-white border-none outline-none px-12 py-2 font-poppins font-semibold text-md rounded-lg transition-all my-4 z-10"
        >
          {active && typeof account === "string" ? "Switch" : "Connect"}
        </button>
        <img
          alt="Unparalleled Security"
          src={mantleBackground}
          className="absolute h-full w-full left-0 right-0 top-0 bottom-0 transparent z-0"
        />
      </div>
    </div>
  );
};

export default WrongNetwork;
