import { useState } from "react";
import { NavLink } from "react-router-dom";

const SideLink = ({ to, title }) => {
  const [active, setActive] = useState(false);
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "block py-2 px-3 text-white bg-white rounded md:bg-transparent md:text-white md:p-0 md:dark:text-white"
          : "block py-2 px-3 text-gray-300 bg-gray-300 rounded md:bg-transparent md:text-gray-300 md:p-0 md:dark:text-gray-300 hover:text-white"
      }
    >
      {title}
    </NavLink>
  );
};

export default SideLink;
