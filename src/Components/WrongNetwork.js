import { useEffect, useState, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { mantleBackground } from "../assets";
import { switchNetwork } from "../network";
import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { injected } from "../network";

const WrongNetwork = () => {
  const { active, account, activate, setError } = useWeb3React();
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    setShowTransition(true);
  }, []);

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
    <>
      <img
        alt="Unparalleled Security"
        src={mantleBackground}
        className="absolute h-full w-full left-0 right-0 top-0 bottom-0 transparent z-0"
      />
      <Transition
        appear={true}
        show={showTransition}
        enter="transition ease-out duration-500"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-500"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <div className="flex flex-col justify-end bg-transparent p-8 h-96 z-50">
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
            className="bg-primary-green text-white border-none outline-none px-12 py-2 font-poppins font-semibold text-md rounded-lg transition-all my-4"
          >
            {active && typeof account === "string" ? "Switch" : "Connect"}
          </button>
        </div>
      </Transition>
    </>
  );
};

export default WrongNetwork;
