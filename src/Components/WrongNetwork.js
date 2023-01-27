import { mantleLogo } from "../assets";
import { switchNetwork } from "../network";

const WrongNetwork = () => {
  return (
    <div className="flex justify-center items-center flex-col bg-black p-8">
      <img src={mantleLogo} alt="Mantle Logo" />
      <p className="font-poppins font-semibold text-primary-green text-lg text-center my-4">
        Switch to Mantle Test Network!
      </p>
      <button
        onClick={switchNetwork}
        className="bg-primary-green text-white border-none outline-none px-12 py-2 font-poppins font-semibold text-md rounded-lg transition-all my-4"
      >
        Switch
      </button>
    </div>
  );
};

export default WrongNetwork;
