import React from "react";
import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {makeStyles, styled} from "@material-ui/core/styles";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import componentStyles from "assets/theme/views/auth/register.js";
import componentStylesButtons from "assets/theme/components/button.js";
import TextField from "@mui/material/TextField";
import {
  addDesignationWatcher,
  getDesignationWatcher
} from "../../actions/roleMetrix";
import {AlertBox} from "../../components/AlertBox";
const useStyles = makeStyles(componentStyles);
const useStylesButtons = makeStyles(componentStylesButtons);

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#5e72e4",
    color: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.common.black
  }
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

function CreateDesignation() {
  const classes = {
    ...useStyles(),
    ...useStylesButtons()
  };
  const dispatch = useDispatch();
  const [designation, setDesignation] = useState("");
  const [designationList, setDesignationList] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const getDesignationtList = () => {
    new Promise((resolve, reject) => {
      dispatch(getDesignationWatcher(resolve, reject));
    })
      .then(response => {
        setDesignationList(response);
        setDesignation("");
      })
      .catch(error => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(error.response.data.message);
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };

  useEffect(() => {
    getDesignationtList();
  }, []);

  const handleSubmit = () => {
    const data = {
      title: designation
    };

    if (designation.match(/^[a-zA-Z\-\s]+$/)) {
      new Promise((resolve, reject) => {
        dispatch(addDesignationWatcher(data, resolve, reject));
      })
        .then(response => {
          setAlert(true);
          setSeverity("success");
          setAlertMessage(response.message);
          setTimeout(() => {
            handleAlertClose();
          }, 4000);
          getDesignationtList();
        })
        .catch(error => {
          setAlert(true);
          setSeverity("error");
          setAlertMessage(error.response.data.message);
          setTimeout(() => {
            handleAlertClose();
          }, 4000);
        });
    } else {
      setAlert(true);
      setSeverity("error");
      setAlertMessage(
        "Designation must be a string with no special characters"
      );
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
    }
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  return (
    <>
      <Grid item xs={12}>
        {alert ? (
          <AlertBox
            severity={severity}
            msg={alertMessage}
            onClose={handleAlertClose}
          />
        ) : null}
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <FormControl
                variant="filled"
                component={Box}
                width="100%"
                marginBottom="1.5rem!important"
              >
                <TextField
                  id="outlined-basic"
                  label="Designation"
                  variant="outlined"
                  type="text"
                  placeholder="Designation"
                  value={designation}
                  onChange={event => {
                    setDesignation(event.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Box
              textAlign="center"
              marginTop="0.6rem"
              marginBottom="1.5rem"
              marginLeft="0.6rem"
            >
              <Button
                variant="contained"
                onClick={handleSubmit}
                classes={{
                  root: classes.buttonContainedInfo
                }}
              >
                Add
              </Button>
            </Box>
          </Grid>

          <TableContainer style={{width: "30%"}} component={Paper}>
            <Table sx={{minWidth: 700}} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Designation</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {designationList &&
                  designationList.map(item => (
                    <StyledTableRow key={item.title}>
                      <StyledTableCell align="left">
                        {item.title}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Grid>
    </>
  );
}

export default CreateDesignation;
