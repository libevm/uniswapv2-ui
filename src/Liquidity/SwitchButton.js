import { useState } from "react";

export default function SwitchButton(props) {
  const { setDeploy } = props;

  const [deployPage, setDeployPage] = useState(true);

  return (
    <div class="inline-flex rounded-md shadow-sm" role="group">
      <button
        type="button"
        className={`"bg-primary-black text-primary-green border-2 border-primary-green rounded-l-lg px-8 py-2 text-lg font-bold " ${
          deployPage ? "bg-primary-green text-primary-black" : ""
        }`}
        onClick={() => {
          setDeployPage(true);
          setDeploy(true);
        }}
      >
        Deploy
      </button>
      <button
        type="button"
        className={`"bg-primary-black text-primary-green border-2 border-primary-green rounded-r-lg px-8 py-2 text-lg font-bold " ${
          !deployPage ? "bg-primary-green text-primary-black" : ""
        }`}
        onClick={() => {
          setDeployPage(false);
          setDeploy(false);
        }}
      >
        Remove
      </button>
    </div>
  );
}
