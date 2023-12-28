import React from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

// core components
import componentStyles from "assets/theme/components/footers/admin-footer.js";

const useStyles = makeStyles(componentStyles);

const Footer = () => {
  const classes = useStyles();
  return (
    <Box component="footer" width="100%" sx={{ position: "fixed", bottom: 0 }}>
      <Grid
        item
        xl={12}
        component={Box}
        display="flex"
        justifyContent="flex-end"
      >
        <Box
          component={Box}
          display="flex"
          justifyContent="center"
          alignItems="center"
          className={classes.flexDirectionColumn}
        >
          <div className={classes.copyrightWrapper}>
            © {new Date().getFullYear()}{" "}
            {/* <a
              className={classes.copyrightLink}
              href="http://www.arthmate.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Arthmate
            </a> */}
          </div>
          <ListItem
            component="a"
            href="http://www.arthmate.com/"
            rel="noopener noreferrer"
            target="_blank"
            classes={{
              root: classes.listItemRoot,
            }}
          >
            Arthmate
          </ListItem>

          <ListItem
            component="a"
            href="http://www.arthmate.com/"
            rel="noopener noreferrer"
            target="_blank"
            classes={{
              root: classes.listItemRoot,
            }}
            sx={{ padding: 0, margin: 0, background: "red" }}
          >
            ABOUT US
          </ListItem>
        </Box>
      </Grid>
    </Box>
  );
};

export default Footer;
