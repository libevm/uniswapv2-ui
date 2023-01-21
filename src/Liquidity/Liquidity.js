import { useState } from "react";

import SwitchButton from "./SwitchButton";
import LiquidityDeployer from "./LiquidityDeployer";
import LiquidityRemover from "./RemoveLiquidity";

function Liquidity(props) {
  const [deploy, setDeploy] = useState(true);

  const deploy_or_remove = (deploy) => {
    if (deploy === true) {
      return <LiquidityDeployer network={props.network} />;
    }
    return <LiquidityRemover network={props.network} />;
  };

  return (
    <div className="flex justify-center min-h-screen sm:px-16 px-6 bg-primary-black">
      <div className="flex items-center flex-col max-w-[1280px] w-full mt-4">
        <SwitchButton setDeploy={setDeploy} />

        {deploy_or_remove(deploy)}
      </div>
    </div>
  );
}

export default Liquidity;
