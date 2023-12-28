const componentStyles = (theme) => ({
  mainContent: {
    maxWidth: "calc(100% - 250px)",
    maxHeight:"100vh",
    overflow:"auto"
  },
  containerRoot: {
    [theme.breakpoints.up("md")]: {
      paddingLeft: "30px",
      paddingRight: "30px",
    },
  },
});

export default componentStyles;
