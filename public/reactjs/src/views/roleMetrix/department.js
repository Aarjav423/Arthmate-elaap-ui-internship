import React from "react";
import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {makeStyles, styled} from "@material-ui/core/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material//FormControl";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import componentStyles from "assets/theme/views/auth/register.js";
import componentStylesButtons from "assets/theme/components/button.js";
import TextField from "@mui/material/TextField";
import {
  addDepartmentWatcher,
  getDepartmentWatcher
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

function CreateDepartment() {
  const classes = {
    ...useStyles(),
    ...useStylesButtons()
  };
  const dispatch = useDispatch();
  const [department, setDepartment] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const getDepartmentList = () => {
    new Promise((resolve, reject) => {
      dispatch(getDepartmentWatcher(resolve, reject));
    })
      .then(response => {
        setDepartmentList(response);
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
    getDepartmentList();
  }, []);

  const handleSubmit = () => {
    const data = {
      title: department
    };
    if (department.match(/^[a-zA-Z\-\s]+$/)) {
      new Promise((resolve, reject) => {
        dispatch(addDepartmentWatcher(data, resolve, reject));
      })
        .then(response => {
          setAlert(true);
          setSeverity("success");
          setAlertMessage(response.message);
          setTimeout(() => {
            handleAlertClose();
          }, 4000);
          getDepartmentList();
          setDepartment("");
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
        "Department name must be a string with no special characters."
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
                  label="Department"
                  variant="outlined"
                  type="text"
                  placeholder="Department"
                  value={department}
                  onChange={event => {
                    setDepartment(event.target.value);
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
                  <StyledTableCell>Department</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departmentList &&
                  departmentList.map(item => (
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

export default CreateDepartment;
