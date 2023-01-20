import React from "react";
import { CircularProgress } from "@material-ui/core";

export default function LoadingButton(props) {
  const { children, loading, valid, onClick } = props;
  return (
    <div className="mt-4 relative flex items-center justify-center">
      <button
        disabled={loading || !valid}
        onClick={onClick}
        className={`${
          valid
            ? "bg-primary-green text-primary-black"
            : "text-primary-green bg-primary-black"
        } "border-none outline-none px-16 py-2 font-poppins font-bold text-lg rounded-2xl leading-[24px] transition-all min-h-[56px]"`}
      >
        {children}
      </button>
      {loading && (
        <CircularProgress
          size={24}
          className="absolute top-2/4 left-2/4 mt-[-12px] ml-[-12px]"
        />
      )}
    </div>
  );
}
