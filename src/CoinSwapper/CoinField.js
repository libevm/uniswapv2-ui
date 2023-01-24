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

  const { onClick1, onClick2, symbol1, symbol2 } = props;

  return (
    <div className="flex justify-around items-center flex-row w-full min-w-full h-20 sm:p-8 p-4 rounded-2xl">
      <button
        onClick={onClick1}
        className="flex flex-row items-center bg-secondary-gray py-2 px-4 rounded-xl font-poppins font-medium text-white"
      >
        {symbol1}
      </button>
      <button
        onClick={onClick2}
        className="flex flex-row items-center bg-secondary-gray py-2 px-4 rounded-xl font-poppins font-medium text-white"
      >
        {symbol2}
      </button>
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

  const { value, onChange, activeField } = props;
  return (
    <div className="flex justify-between items-center flex-row w-full min-w-full h-20 bg-primary-black sm:p-8 p-4 rounded-2xl">
      <input
        placeholder="0.0"
        type="number"
        value={value}
        disabled={!activeField}
        onChange={onChange}
        className="w-full flex-1 bg-transparent outline-none font-poppins font-medium text-md text-white"
      />
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
    <div className="flex justify-between items-center flex-row w-full min-w-full h-20 bg-primary-black sm:p-8 p-4 rounded-2xl">
      <input
        placeholder="0.0"
        type="number"
        value={value}
        disabled={!activeField}
        onChange={onChange}
        className="w-full flex-1 bg-transparent outline-none font-poppins font-medium text-md text-white"
      />
      <div className="relative" onClick={onClick}>
        <button className="flex flex-row items-center bg-secondary-gray py-2 px-4 rounded-xl font-poppins font-medium text-white">
          {symbol}
        </button>
      </div>
    </div>
  );
}
