import { mantleLogo } from "../assets";

const WrongNetwork = () => {
  return (
    <div className="flex justify-center items-center flex-col w-full h-screen bg-primary-black">
      <img
        src={mantleLogo}
        alt="Mantle Logo"
        className="w-56 h-56 object-contain"
      />
      <p className="font-poppins font-normal text-primary-green text-lg text-center mt-10">
        Please connect an Ethereum wallet to your browser and select Mantle
        Testnet to use the application
      </p>
    </div>
  );
};

export default WrongNetwork;
