import { Routes, Route } from "react-router-dom";
import { Bars3Icon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator, setOpenSidenav } from "@/context";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType, openSidenav } = controller;

  return (
    <div className="min-h-screen bg-blue-gray-50/50 flex">
      {/* Sidebar - Fixed on mobile, Flex item on desktop */}
      <div className={`${openSidenav ? 'fixed md:relative z-50' : 'hidden md:block md:relative'}`}>
        <Sidenav
          routes={routes}
          brandImg={
            sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
          }
        />
      </div>

      {/* Mobile Overlay */}
      {openSidenav && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        />
      )}

      {/* Main Content - Full width with proper spacing */}
      <div className={`flex-1 ml-4 overflow-x-auto h-screen transition-all duration-300 ${openSidenav ? 'md:pl-72' : 'md:pl-20'
        }`}>
        <div className="p-4 h-full flex flex-col">
          {/* Mobile Menu Button */}
          <div className="md:hidden mb-4">
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={() => setOpenSidenav(dispatch, true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </IconButton>
          </div>

          <DashboardNavbar />
          <Configurator />
          <IconButton
            size="lg"
            color="white"
            className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
            ripple={false}
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5" />
          </IconButton>

          <Routes>
            {routes.map(
              ({ layout, pages }) =>
                layout === "dashboard" &&
                pages.map(({ path, element }) => (
                  <Route exact path={path} element={element} />
                ))
            )}
          </Routes>

          <div className="text-blue-gray-600">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
