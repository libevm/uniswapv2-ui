import PropTypes from "prop-types";

CoinField.propTypes = {
  onClick: PropTypes.func.isRequired,
  symbol: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  activeField: PropTypes.bool.isRequired,
};

export function RemoveLiquidityField1(props) {
  // This component is used to selecting a coin and entering a value, the props are explained below:
  //      onClick - (string) => void - Called when the button is clicked
  //      symbol - string - The text displayed on the button
  //      value - string - The value of the text field
  //      onChange - (e) => void - Called when the text field changes
  //      activeField - boolean - Whether text can be entered into this field or not

  const { onClick, symbol, value, onChange, activeField } = props;
  return (
    <div className="flex justify-between items-center flex-row w-full min-w-full bg-primary-black border-[1px] border-transparent hover:border-secondary-gray min-h-[96px] sm:p-8 p-4 rounded-[20px]">
      <input
        placeholder="0.0"
        type="number"
        value={value}
        disabled={!activeField}
        onChange={onChange}
        className="w-full flex-1 bg-transparent outline-none font-poppins font-black text-lg text-white"
      />
      <div className="relative" onClick={onClick}>
        <button className="flex flex-row items-center bg-secondary-gray py-2 px-4 rounded-xl font-poppins font-bold text-white border border-white">
          {symbol}
        </button>
      </div>
    </div>
  );
}

export function RemoveLiquidityField2(props) {
  // This component is used to selecting a coin and entering a value, the props are explained below:
  //      onClick - (string) => void - Called when the button is clicked
  //      symbol - string - The text displayed on the button
  //      value - string - The value of the text field
  //      onChange - (e) => void - Called when the text field changes
  //      activeField - boolean - Whether text can be entered into this field or not

  const { onClick, symbol } = props;

  return (
    <div className="flex justify-between items-center flex-row w-full min-w-full bg-primary-black border-[1px] border-transparent hover:border-secondary-gray min-h-[96px] sm:p-8 p-4 rounded-[20px]">
      <div className="relative" onClick={onClick}>
        <button className="flex flex-row items-center bg-secondary-gray py-2 px-4 rounded-xl font-poppins font-bold text-white border border-white">
          {symbol}
        </button>
      </div>
    </div>
  );
}

export default function CoinField(props) {
  // This component is used to selecting a token and entering a value, the props are explained below:
  //      onClick - (string) => void - Called when the button is clicked
  //      symbol - string - The text displayed on the button
  //      value - string - The value of the text field
  //      onChange - (e) => void - Called when the text field changes
  //      activeField - boolean - Whether text can be entered into this field or not

  const { onClick, symbol, value, onChange, activeField } = props;

  return (
    <div className="flex justify-between items-center flex-row w-full min-w-full bg-primary-black border-[1px] border-transparent hover:border-secondary-gray min-h-[96px] sm:p-8 p-4 rounded-[20px]">
      <input
        placeholder="0.0"
        type="number"
        value={value}
        disabled={!activeField}
        onChange={onChange}
        className="w-full flex-1 bg-transparent outline-none font-poppins font-black text-lg text-white"
      />
      <div className="relative" onClick={onClick}>
        <button className="flex flex-row items-center bg-secondary-gray py-2 px-4 rounded-xl font-poppins font-bold text-white border border-white">
          {symbol}
        </button>
      </div>
    </div>
  );
}
