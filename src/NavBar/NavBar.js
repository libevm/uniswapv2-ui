import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MenuItems } from "./MenuItems";
import { getAccount } from "../ethereumFunctions";

const Navbar = () => {
  const [address, setAddress] = useState();

  useEffect(() => {
    const fetchAccount = async () => {
      await getAccount().then(async (result) => {
        let first = result.slice(0, 6);
        let second = result.slice(result.length - 5, result.length - 1);

        setAddress(first.concat("...", second));
      });
    };

    fetchAccount();
  }, [address]);

  return (
    <nav className="bg-primary-gray">
      <div className="mx-auto max-w-7xl p-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-around">
          <div className="flex items-center justify-center sm:items-stretch sm:justify-start text-primary-green font-bold text-2xl">
            Mantle Swap
          </div>
          <div className="flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 mx-auto">
            {MenuItems.map((item, index) => {
              return (
                <li className="list-none" key={index}>
                  <Link
                    className="no-underline text-primary-green no-underline p-3 text-sm font-bold"
                    aria-current="page"
                    to={item.url}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </div>
          <div className="bg-primary-green border-none outline-none px-4 py-2 font-poppins font-medium text-base text-white rounded-3xl leading-[24px] transition-all">
            {address}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
