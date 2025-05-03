import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
  Tooltip,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useEffect, useState } from "react";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  const DelayedRender = ({ delay, children }) => {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, delay);

      return () => clearTimeout(timer);
    }, [delay]);

    return shouldRender ? children : null;
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${openSidenav ? "translate-x-0 w-72" : "hidden md:block md:w-20"

        } fixed inset-0 my-4 ml-4 h-[calc(100vh)] rounded-xl transition-all duration-300 border border-blue-gray-100`}
    >
      <div className="relative">
        <Link to="/" className="py-6 px-4 text-center flex justify-center h-14">
          {openSidenav ? (
            <DelayedRender delay={150}>
              <Typography
                variant="h6"
                color={sidenavType === "dark" ? "white" : "blue-gray"}
              >
                {brandName}
              </Typography>
            </DelayedRender>
          ) : (
            <Typography
              variant="h6"
              color={sidenavType === "dark" ? "white" : "blue-gray"}
            >
              {brandName.substring(0, 2)}
            </Typography>
          )}
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-2">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && openSidenav && (
              <DelayedRender delay={200}>
                <li className="mx-3.5 mt-4 mb-2">
                  <Typography
                    variant="small"
                    color={sidenavType === "dark" ? "white" : "blue-gray"}
                    className="font-black uppercase opacity-75"
                  >
                    {title}
                  </Typography>
                </li>
              </DelayedRender>
            )}
            {pages.map(({ icon, name, path }) => (
              <li key={name}>
                <Tooltip
                  content={name}
                  placement="right"
                  className={`${openSidenav ? "hidden" : ""} bg-gray-900 transition-opacity duration-200`}
                >
                  <NavLink to={`/${layout}${path}`}>
                    {({ isActive }) => (
                      <Button
                        variant={isActive ? "gradient" : "text"}
                        color={
                          isActive
                            ? sidenavColor
                            : sidenavType === "dark"
                              ? "white"
                              : "blue-gray"
                        }
                        className={`flex items-center gap-4 px-4 capitalize transition-all duration-300 ${!openSidenav ? "justify-center" : ""
                          }`}
                        fullWidth
                      >
                        {icon}
                        {openSidenav && (
                          <DelayedRender delay={150}>
                            <Typography
                              color="inherit"
                              className={`font-medium capitalize transition-all duration-300 ${openSidenav ? "opacity-100 w-auto ml-2" : "opacity-0 w-0 duration:200"}`}
                            >
                              {name}
                            </Typography>
                          </DelayedRender>
                        )}
                      </Button>
                    )}
                  </NavLink>
                </Tooltip>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "Material Tailwind React",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;