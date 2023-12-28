import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import CardContent from "@mui/material/CardContent";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { makeStyles, styled } from "@material-ui/core/styles";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import { Button, TableBody } from "@material-ui/core";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import TablePagination from "@mui/material/TablePagination";
import {
  colendersListWatcher,
  toggleStatusWatcher
} from "../../actions/colenders.js";
import { useDispatch } from "react-redux";
import { AlertBox } from "../../components/AlertBox";
import { checkAccessTags } from "../../util/uam";
import { storedList } from "../../util/localstorage";
const user = storedList("user");

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#5e72e4",
    color: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.common.black
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

const label = { inputProps: { "aria-label": "Switch demo" } };

var arr = [];

const colenders = () => {
  const [filter, setFilter] = useState("");
  const [column, setColumn] = useState("");
  const [filterArr, setFilterArr] = useState([]);
  const [fullArr, setFullArr] = useState([]);

  const dispatch = useDispatch();
  const [colendersList, setColendersList] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  //const [status,setStatus]=useState("");

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  React.useEffect(() => {
    if (
      isTagged &&
      checkAccessTags(["tag_colenders_read", "tag_colenders_read_write"])
    )
      fetchColendersList();
    if (!isTagged) fetchColendersList();
  }, []);

  const fetchColendersList = () => {
    const payload = {};
    new Promise((resolve, reject) => {
      dispatch(colendersListWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setColendersList(response.filter(filterData));
        setFullArr(response);
      })
      .catch((error) => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(error.response.data.message);
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };

  const handleFilterChange = (e) => {
    setColumn("");
    setFilter(e.target.value);
  };

  const handleColumnChange = (e) => {
    setColumn(e.target.value);
  };

  const handleReset = () => {
    setColumn("");
    setFilter("");
    setColendersList(fullArr);
  };

  const filterData = (item) => {
    if (filter == "" || column == "") {
      return true;
    } else if (item.hasOwnProperty(filter)) {
      if (
        typeof item[filter] == "string" &&
        item[filter].toLowerCase() == column.toLowerCase()
      ) {
        return true;
      } else if (item[filter] == column) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const handleSearch = () => {
    if (filter && !column) {
      setAlert(true);
      setSeverity("error");
      setAlertMessage("Please enter value");
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
    } else if (!filter && column) {
      setAlert(true);
      setSeverity("error");
      setAlertMessage("Please select filter");
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
    } else if (!filter && !column) {
      setAlert(true);
      setSeverity("error");
      setAlertMessage("Please select filter");
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
    } else {
      setColendersList(fullArr.filter(filterData));
    }
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const toggleUserStatus = (event, co_lender_id) => {
    const payload = {
      co_lender_id: co_lender_id,
      status: event.target.checked ? "1" : "0"
    };

    new Promise((resolve, reject) => {
      dispatch(toggleStatusWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setAlert(true);
        setSeverity("success");
        setAlertMessage(response.message);
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
        fetchColendersList();
      })
      .catch((error) => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(error.response.data.message);
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };

  return (
    <Grid item xs={12}>
      <Typography sx={{ mt: 2, mb: 2 }} variant="h6">
        Colenders
      </Typography>

      <div
        style={{ display: "flex", alignItems: "center", marginLeft: "10px" }}
      >
        {alert ? (
          <AlertBox
            severity={severity}
            msg={alertMessage}
            onClose={handleAlertClose}
          />
        ) : null}
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Filter</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filter}
            label="Filter"
            onChange={handleFilterChange}
          >
            <MenuItem value={"co_lender_id"}>Colender Id</MenuItem>
            <MenuItem value={"co_lender_name"}>Colender Name</MenuItem>
            <MenuItem value={"status"}>Status</MenuItem>
          </Select>
        </FormControl>

        {(!(filter === "status") && (
          <TextField
            id="outlined-basic"
            label="Value"
            variant="outlined"
            value={column}
            onChange={handleColumnChange}
          />
        )) ||
          (filter === "status" && (
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-label">Filter</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={column}
                label="Filter"
                onChange={handleColumnChange}
              >
                <MenuItem value={"1"}>Enabled</MenuItem>
                <MenuItem value={"0"}>Disabled</MenuItem>
              </Select>
            </FormControl>
          ))}

        <Button
          style={{
            backgroundColor: "#5e72e4",
            color: "fff#",
            marginLeft: "10px"
          }}
          onClick={handleSearch}
        >
          Search
        </Button>
        <Button
          style={{
            backgroundColor: "#5e72e4",
            color: "#fff",
            marginLeft: "10px"
          }}
          onClick={handleReset}
        >
          Reset
        </Button>

        <Button
          style={{
            float: "right",
            backgroundColor: "#5e72e4",
            color: "#fff",
            marginLeft: "auto",
            marginRight: "20px"
          }}
          disabled={
            isTagged ? !checkAccessTags(["tag_colenders_read_write"]) : false
          }
          onClick={() => {
            window.open(`/admin/add_colenders`, "_self");
          }}
        >
          Add New colenders
        </Button>
      </div>

      {isTagged ? (
        checkAccessTags(["tag_colenders_read", "tag_colenders_read_write"]) ? (
          <CardContent>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">Colender Id </StyledTableCell>
                    <StyledTableCell align="left">
                      Colender Name
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Colender Short Code
                    </StyledTableCell>
                    <StyledTableCell align="left">Status</StyledTableCell>
                    <StyledTableCell align="left">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {colendersList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((x, index) => {
                      return (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{x.co_lender_id}</StyledTableCell>
                          <StyledTableCell>{x.co_lender_name}</StyledTableCell>
                          <StyledTableCell>
                            {x.co_lender_shortcode}
                          </StyledTableCell>
                          <StyledTableCell>
                            <Switch
                              {...label}
                              checked={x.status == 1 ? true : false}
                              disabled={
                                !checkAccessTags(["tag_colenders_read_write"])
                              }
                              onChange={(e) =>
                                toggleUserStatus(e, x.co_lender_id)
                              }
                              value={x.status}
                            />
                          </StyledTableCell>
                          <StyledTableCell>
                            {
                              <Tooltip title="Edit">
                                <IconButton
                                  style={{
                                    color: "#5e72e4",
                                    cursor: "pointer"
                                  }}
                                  disabled={
                                    !checkAccessTags([
                                      "tag_colenders_read_write"
                                    ])
                                  }
                                  onClick={() => {
                                    window.open(
                                      `/admin/edit_colenders/${x._id}`,
                                      "_blank"
                                    );
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            }
                            <Tooltip title="Info">
                              <InfoIcon
                                style={{
                                  color: "#5e72e4",
                                  marginLeft: "20px",
                                  cursor: "pointer"
                                }}
                                onClick={() => {
                                  window.open(
                                    `/admin/info_colenders/${x.co_lender_id}/${x.co_lender_name}/${x.is_rps_by_co_lender}/${x.co_lender_shortcode}/${x.co_lending_share}/${x.co_lending_mode}/${x.escrow_account_number}/${x.escrow_account_beneficiary_name}/${x.escrow_account_ifsc_code}/${x.escrow_repayment_account_number?x.escrow_repayment_account_number:"-1"}/${x.escrow_repayment_account_ifsc_code?x.escrow_repayment_account_ifsc_code:"-1"}`,
                                    "_blank"
                                  );
                                }}
                              />
                            </Tooltip>
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              sx={{
                "& .MuiTablePagination-toolbar": {
                  display: "flex",
                  alignItems: "baseline"
                },
                float: "left",
                marginTop: "20px"
              }}
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={colendersList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            ></TablePagination>
          </CardContent>
        ) : null
      ) : (
        <CardContent>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Colender Id </StyledTableCell>
                  <StyledTableCell align="left">Colender Name </StyledTableCell>
                  <StyledTableCell align="left">
                    Colender Short Code
                  </StyledTableCell>
                  <StyledTableCell align="left">Status</StyledTableCell>
                  <StyledTableCell align="left">Actions</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {colendersList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((x, index) => {
                    return (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{x.co_lender_id}</StyledTableCell>
                        <StyledTableCell>{x.co_lender_name}</StyledTableCell>
                        <StyledTableCell>
                          {x.co_lender_shortcode}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Switch
                            {...label}
                            checked={x.status == 1 ? true : false}
                            onChange={(e) =>
                              toggleUserStatus(e, x.co_lender_id)
                            }
                            value={x.status}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <Tooltip title="Edit">
                            <EditIcon
                              style={{ color: "#5e72e4", cursor: "pointer" }}
                              onClick={() => {
                                window.open(
                                  `/admin/edit_colenders/${x._id}`,
                                  "_blank"
                                );
                              }}
                            />
                          </Tooltip>
                          <Tooltip title="Info">
                            <InfoIcon
                              style={{
                                color: "#5e72e4",
                                marginLeft: "20px",
                                cursor: "pointer"
                              }}
                              onClick={() => {
                                window.open(
                                  `/admin/info_colenders/${x.co_lender_id}/${x.co_lender_name}/${x.is_rps_by_co_lender}/${x.co_lender_shortcode}/${x.co_lending_share}/${x.co_lending_mode}/${x.escrow_account_number}/${x.escrow_account_beneficiary_name}/${x.escrow_account_ifsc_code}/${x.escrow_repayment_account_number?x.escrow_repayment_account_number:"-1"}/${x.escrow_repayment_account_ifsc_code?x.escrow_repayment_account_ifsc_code:"-1"}`,
                                  "_blank"
                                );
                              }}
                            />
                          </Tooltip>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            sx={{
              "& .MuiTablePagination-toolbar": {
                display: "flex",
                alignItems: "baseline"
              },
              float: "left",
              marginTop: "20px"
            }}
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={colendersList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          >
            {" "}
          </TablePagination>
        </CardContent>
      )}
    </Grid>
  );
};

export default colenders;
