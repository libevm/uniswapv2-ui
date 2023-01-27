import React from "react";

export default function LoadingButton(props) {
  const { children, loading, valid, onClick } = props;
  return (
    <div className="mt-10 relative flex items-center justify-center">
      <button
        disabled={loading || !valid}
        onClick={onClick}
        className={`${
          valid
            ? "bg-primary-green text-white"
            : "text-primary-green bg-primary-black"
        } "border-none outline-none px-16 py-2 font-poppins font-bold text-lg rounded-2xl leading-[24px] transition-all min-h-[56px]"`}
      >
        {children}
      </button>
    </div>
  );
}
