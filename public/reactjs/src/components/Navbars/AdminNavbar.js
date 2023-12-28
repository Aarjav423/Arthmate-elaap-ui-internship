import React, { useEffect, useState } from "react";
import Header from "react-sdk/dist/components/HeaderComponent/Header";
import List from "react-sdk/dist/components/List/List";
import ListItem from "react-sdk/dist/components/ListItem/ListItem";
import { useHistory, useLocation } from "react-router-dom";
import { PasswordReset } from "../../views/PasswordReset";


export default function AdminNavbar({ }) {
  const history = useHistory();
  const route = useLocation().pathname.split("/").slice(1);
  const capitalizedRoute = route.map(
    (segment) => segment.charAt(0).toUpperCase() + segment.slice(1)
  );
  const words = route[1].split("-");
  const title = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const breadCrumb = capitalizedRoute.join(" > ");
  const lastIndex = breadCrumb.lastIndexOf(">");
  const v = breadCrumb.substring(0, lastIndex + 1);
  const v1 = breadCrumb.substring(lastIndex + 1);
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : "Aditi";
  const wordsArray = v.split(" > ");
  let secondWord = "";
  let thirdWord = "";
  if (wordsArray.length >= 3) {
    secondWord = wordsArray[2];
    thirdWord = wordsArray[3];
  }
  const [openResetPassword, setOpenResetPassword] = React.useState(false);
  const [openIcon, setOpenIcon] = React.useState(false);
  const [showFullRoute, setShowFullRoute] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenResetPasswordPopup = () => {
    setOpenIcon(!openIcon);
    setOpenResetPassword(true);
  };

  const handleSignOut = () => {
    localStorage.clear();
    history.push("/login");
  };

  const handleMenuClose = () => { };

  const handleOpen = () => {
    setOpenIcon(!openIcon);
  };

  const handleCallback = () => {
    setOpenIcon(false);
  };

  const toggleRouteDisplay = () => {
    setShowFullRoute(!showFullRoute);
  };

  const takeAction = (clickedItem) => {
    switch (clickedItem) {
      case "My Profile":
        handleMenuClose();
        break;

      case "Settings":
        handleMenuClose();
        break;

      case "Activity":
        handleMenuClose();
        break;

      case "Support":
        handleMenuClose();
        break;

      case "Change Password":
        handleOpenResetPasswordPopup();
        break;

      case "Logout":
        handleSignOut();
      default:
        break;
    }
  };

  const data = [
    {
      label: "My Profile",
      disabled: false,
    },

    {
      label: "Settings",
      disabled: false,
    },

    {
      label: "Activity",
      disabled: false,
    },

    {
      label: "Change Password",
      disabled: false,
    },

    {
      label: "Support",
      disabled: false,
    },

    {
      label: "Logout",
      disabled: false,
    },
  ];

  const shortenRoute = (v) => {
    if (v.length > 4) {
      const firstThree = v.slice(0, 2).join(" > ");
      const lastTwo = v.slice(-1).join(" > ");
      return `${firstThree} > ... > ${lastTwo}`;
    } else {
      return v.join(" > ");
    }
  };

  const fullRoute = v;
  const shortenedRoute = shortenRoute(v.split(" > "));

  return (
    <div id="TopNavBar">
      <Header
        username={username}
        title={
          secondWord.trim() === "Leads" && thirdWord.trim() === "Cams"
            ? "Cam Details"
            : secondWord.trim() === "Leads" && thirdWord.trim() === "Selector"
              ? "Selector Data"
              : secondWord.trim() === "Lead" && thirdWord.trim() === "Edit"
                ? "Edit Lead"
                : v1.trim() === "Pdf"
                  ? "Documents"
                  : v1.trim() === "Xml"
                    ? "XML Documents"
                    : title
        }
        title1={
          <span
            style={{
              cursor: "pointer",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
            onClick={toggleRouteDisplay}
            title={showFullRoute ? fullRoute : null}
          >
            {showFullRoute ? fullRoute : shortenedRoute}
          </span>
        }
        colour_change={v1}
        handleOpen={handleOpen}
      >

        <List
          customStyle={{
            zIndex: "1000",
            marginTop: "20px",
            position: "absolute",
            top: "55%",
            right: "1%",
            width: "320px",
          }}
          open={openIcon}
          noScroll={true}
          handleCallback={handleCallback}
        >
          {data.map((item) => (
            <ListItem
              customStyle={{ width: "100%", zIndex: "1000" }}
              key={item.label}
              disabled={item.disabled}
              onClick={() => takeAction(item.label)}
            >
              {item.label}
            </ListItem>
          ))}
        </List>
      </Header>

      {openResetPassword ? (
        <PasswordReset
          openPopup={openResetPassword}
          setOpenPopup={setOpenResetPassword}
        />
      ) : null}
    </div>
  );
}
