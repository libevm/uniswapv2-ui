import { mantleLogo } from "../assets";

const WrongNetwork = () => {
  const { ethereum } = window;

  const switchNetwork = async () => {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1389" }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x1389",
                chainName: "Mantle Testnet",
                nativeCurrency: {
                  name: "BIT Token",
                  symbol: "BIT",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc.testnet.mantle.xyz"],
                blockExplorerUrls: ["https://explorer.testnet.mantle.xyz"],
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
        }
      }
      console.log(switchError);
    }
  };

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
