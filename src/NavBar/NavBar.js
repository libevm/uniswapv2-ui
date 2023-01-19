import React, { Component } from "react";
import { Link } from "react-router-dom";
import { MenuItems } from "./MenuItems";

class NavBar extends Component {
  state = { clicked: false };

  render() {
    return (
      <nav class="bg-primary-black">
        <div class="mx-auto max-w-7xl p-2 sm:px-6 lg:px-8">
          <div class="relative flex h-16 items-center justify-between">
            <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div class="flex items-center text-primary-green font-bold text-2xl">
                UniswapV2 UI
              </div>
            </div>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {MenuItems.map((item, index) => {
                return (
                  <li key={index}>
                    <Link
                      className="text-white underline underline-offset-8 p-3 text-sm font-medium"
                      aria-current="page"
                      to={item.url}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
