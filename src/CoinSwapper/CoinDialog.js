import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import CoinButton from "./CoinButton";
import { doesTokenExist } from "../ethereumFunctions";
import PropTypes from "prop-types";

CoinDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  coins: PropTypes.array.isRequired,
};

export default function CoinDialog(props) {
  // The CoinDialog component will display a dialog window on top of the page, allowing a user to select a coin
  // from a list (list can be found in 'src/constants/coins.js') or enter an address into a search field. Any entered
  // addresses will first be validated to make sure they exist.
  // When the dialog closes, it will call the `onClose` prop with 1 argument which will either be undefined (if the
  // user closes the dialog without selecting anything), or will be a string containing the address of a coin.

  const {
    onClose,
    open,
    closeModal,
    accountAddress,
    provider,
    signer,
    weth_address,
    coins,
  } = props;

  const [address, setAddress] = useState("");
  const [error, setError] = useState(false);

  // Called when the user tries to input a custom address, this function will validate the address and will either
  // then close the dialog and return the validated address, or will display an error.
  const submit = () => {
    if (doesTokenExist(address, signer) === true) {
      exit(address);
    } else {
      setError(true);
    }
  };

  // Resets any fields in the dialog (in case it's opened in the future) and calls the `onClose` prop
  const exit = (value) => {
    onClose(value);
    setAddress("");
    setError(false);
  };

  const close = () => {
    setAddress("");
    closeModal();
    setError(false);
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={close}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-primary-gray p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg text-center font-bold leading-6 text-primary-green"
                >
                  Select Token
                </Dialog.Title>

                <div className="relative mt-6">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    placeholder="Search name or paste address"
                    className={`${
                      error && " border-2 border-red-700 "
                    } " w-full flex-1 bg-primary-black outline-none font-poppins font-black text-sm text-primary-green p-3 rounded-2xl " `}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-700 pl-3">
                    <span className="font-bold">Token doesn't exist!</span>{" "}
                    Please try again.
                  </p>
                )}

                <div className="my-4">
                  {coins.map((coin, index) => (
                    <li key={index} className="list-none">
                      <CoinButton
                        coinName={coin.name}
                        coinAbbr={coin.abbr}
                        coinLogo={coin.logo}
                        onClick={() => exit(coin.address)}
                        accountAddress={accountAddress}
                        address={coin.address}
                        provider={provider}
                        signer={signer}
                        weth_address={weth_address}
                        coins={coins}
                      />
                    </li>
                  ))}
                </div>

                <div className="flex items-center justify-center mt-2">
                  <button
                    className={`${
                      address
                        ? "bg-primary-green text-primary-black"
                        : "text-primary-green bg-primary-black"
                    } "w-full border-none outline-none px-16 py-2 font-poppins font-bold text-lg rounded-2xl leading-[24px] transition-all min-h-[56px]"`}
                    onClick={submit}
                  >
                    Enter
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
