import React from "react";

const Reserve = ({ reserve, symbol, format }) => {
  return (
    <div className="w-full text-left mt-2 ml-2">
      <p className="font-poppins font-normal text-white text-sm">
        {symbol && (
          <>
            <span className="font-semibold text-white">{symbol}: </span>
            {format(reserve, symbol)}
          </>
        )}
      </p>
    </div>
  );
};

export default Reserve;
