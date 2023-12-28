import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

import { Box, Breadcrumbs as MuiBreadcrumbs, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Icon from "@mui/material/Icon";

function Breadcrumbs({ icon, title, route, light }) {
  const routes = route.slice(0, -1);
  let history = useHistory();
  return (
    <Box style={{ display: "flex" }}>
      <Typography
        fontWeight="bold"
        textTransform="capitalize"
        variant="h6"
        color={light ? "white" : "dark"}
        noWrap
        marginRight="20px"
        alignSelf="center"
      >
        <ArrowBackIcon
          cursor="pointer"
          onClick={() => {
            history.goBack();
          }}
        />
      </Typography>
      <Box mr={{ xs: 0, xl: 8 }}>
        <Typography
          fontWeight="bold"
          textTransform="capitalize"
          variant="h6"
          color={light ? "white" : "dark"}
          noWrap
        >
          {title.replace(/([^\w ]|_)/g, " ")}
        </Typography>
        <MuiBreadcrumbs
          sx={{
            color: "white"
          }}
        >
          {route.map(el => (
            <Typography
              key={el}
              component="span"
              variant="button"
              fontWeight="regular"
              textTransform="capitalize"
              color={light ? "white" : "dark"}
              opacity={light ? 0.8 : 0.5}
              sx={{ lineHeight: 0 }}
            >
              {el.replace(/([^\w ]|_)/g, " ")}
            </Typography>
          ))}
        </MuiBreadcrumbs>
      </Box>
    </Box>
  );
}

// Setting default values for the props of Breadcrumbs
Breadcrumbs.defaultProps = {
  light: false
};

// Typechecking props for the Breadcrumbs
Breadcrumbs.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  light: PropTypes.bool
};

export default Breadcrumbs;
