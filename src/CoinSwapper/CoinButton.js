import PropTypes from "prop-types";

CoinButton.propTypes = {
  coinName: PropTypes.string.isRequired,
  coinAbbr: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default function CoinButton(props) {
  const { coinName, coinAbbr, onClick } = props;

  return (
    <button
      className="w-full flex items-center px-6 py-2 rounded-2xl hover:bg-secondary-gray"
      onClick={onClick}
    >
      <div className="flex flex-col">
        <div className="text-white font-semibold text-md flex justify-start">
          {coinAbbr}
        </div>
        <div className="text-primary-green text-sm flex justify-start">
          {coinName}
        </div>
      </div>
    </button>
  );
}
