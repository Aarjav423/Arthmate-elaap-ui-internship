import React from "react";
import { useEffect ,useState} from "react";
import {
  useLocation,
  Route,
  Redirect,
  Switch,
  useHistory
} from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
// @material-ui/icons components
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminNavbarAlternative from "components/Navbars/AdminNavbarAlternative.js";
import AdminFooter from "components/Footers/AdminFooter.js";
// import Sidebar from "components/Sidebar/Sidebar.js";
import routes from "routes.js";
import componentStyles from "assets/theme/layouts/admin.js";
import { storedList , saveToStorage} from "../util/localstorage";
const useStyles = makeStyles(componentStyles);
import { stateCityWatcher } from "../actions/stateCity";
import { useDispatch } from "react-redux";
import Sidebar from "react-sdk/dist/components/Sidebar/Sidebar.js"

const Admin = () => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const [sidebarOpenResponsive, setSidebarOpenResponsive] =
    React.useState(false);
  const dispatch = useDispatch();
  const user = storedList("user");

  useEffect(() => {
    const isloggedIn = localStorage.getItem("user");
    const isTagged =
      process.env.REACT_APP_BUILD_VERSION > 1
        ? user?.access_metrix_tags?.length
        : false;
    if (
      !isloggedIn &&
      location.pathname !== "/" &&
      location.pathname !== "/login"
    ) {
      history.push("/login");
    } else if (
      process.env.REACT_APP_BUILD_VERSION > 1 &&
      isloggedIn &&
      !isTagged
    ) {
      localStorage.clear();
      history.push("/login");
    } else {
      return false;
    }
  }, [location]);

  const getRoutes = routes => {
    //If UI_VERSION is 2 , validate role_metrix is defined for user.
    return routes.map((prop, key) => {
      let isTagged = process.env.REACT_APP_BUILD_VERSION > 1 ? false : true;
      if (!isTagged && prop.tags) {
        prop?.tags.forEach(item => {
          if (user?.access_metrix_tags?.includes(item)) {
            isTagged = true;
          }
        });
      }
      if (prop.collapse) {
        if (!prop.invisible) {
          const checkUserRole = prop?.type?.includes(user?.type);
          prop.invisible = checkUserRole && isTagged ? false : true;
        }
        return getRoutes(prop.views);
      }
      if (
        prop.layout === "/admin" &&
        prop?.accessBy?.includes(user?.type) &&
        isTagged
      ) {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        prop.invisible = true;
        return null;
      }
    });
  };
  const [scrollTop, setScrollTop] = useState(0);
  const handleMyScroll = event => {
    saveToStorage("scrollY" + window.location.pathname ,scrollTop );
    setScrollTop(event.currentTarget.scrollTop);
  };

  return (
    <>
      <Box display="flex">
      <Sidebar sidebarData={routes} customClass={{}} />
        {/* <Sidebar
          routes={routes}
          openResponsive={sidebarOpenResponsive}
          closeSidebarResponsive={() => setSidebarOpenResponsive(false)}
          logo={{
            innerLink: "/admin/dashboard",
            imgSrc: require("../assets/img/brand/arthmate_logo_dashboard.png")
              .default,
            imgAlt: "..."
          }}
        /> */}
        <Box position="relative" flex="1" className={classes.mainContent} onScroll={handleMyScroll} style= {{overflow:"none"}}>
          {location.pathname === "/admin/alternative-dashboard" ? (
            <AdminNavbarAlternative
              openSidebarResponsive={() => setSidebarOpenResponsive(true)}
            />
          ) : (
            <AdminNavbar
              openSidebarResponsive={() => setSidebarOpenResponsive(true)}
            />
          )}
          <Switch>
            {getRoutes(routes)}
            <Route path="*" element={<Redirect to="/admin/dashboard" />} />
          </Switch>
          <Container
            maxWidth={false}
            component={Box}
            classes={{ root: classes.containerRoot }}
          ></Container>
        </Box>
      </Box>
      <AdminFooter />
    </>
  );
};

export default Admin;
