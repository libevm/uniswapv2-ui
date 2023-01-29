const Balance = ({ balance, symbol, format }) => {
  return (
    <div className="w-full text-left mt-2 ml-2">
      <p className="font-poppins font-normal text-white text-sm">
        {balance ? (
          <>
            <span className="font-semibold text-white">Balance: </span>
            {format(balance, symbol)}
          </>
        ) : (
          ""
        )}
      </p>
    </div>
  );
};

export default Balance;
