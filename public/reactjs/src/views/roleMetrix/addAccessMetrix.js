import React from "react";
import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {styled} from "@material-ui/core/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import {
  addAccessMetrixWatcher,
  getAccessMetrixWatcher,
  updateAccessMetrixWatcher
} from "../../actions/accessMetrix";
import {AlertBox} from "../../components/AlertBox";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import {checkAccessTags} from "../../util/uam";
import {storedList} from "../../util/localstorage";
const user = storedList("user");

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

export const AddAccessMetrix = () => {
  const dispatch = useDispatch();
  const [tag, setTag] = useState("");
  const [title, setTitle] = useState("");
  const [roleMetrixList, setTitleList] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [buttonTitle, setButtonTitle] = useState("Submit");
  const [selectedRow, setSelectedRow] = useState({});
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags([
        "tag_access_matrix_read",
        "tag_access_matrix_read_write"
      ])
    )
      getRoleMetrixList();
    if (!isTagged) getRoleMetrixList();
  }, [page]);

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 2000);
  };

  const getRoleMetrixList = () => {
    const payload = {
      page,
      limit: 10
    };
    new Promise((resolve, reject) => {
      dispatch(getAccessMetrixWatcher(payload, resolve, reject));
    })
      .then(response => {
        setTitleList(response.data.rows);
        setCount(response.data.count);
      })
      .catch(error => {
        return showAlert(error?.response?.data?.message, "error");
      });
  };

  const handleSubmit = () => {
    let data = {};
    if (title.match(/^[a-zA-Z\-_\0-9\s]+$/)) {
      new Promise((resolve, reject) => {
        if (buttonTitle === "Submit") {
          const data = {title, tag};
          dispatch(addAccessMetrixWatcher(data, resolve, reject));
        }
        if (buttonTitle === "Update") {
          data = {
            _id: selectedRow?._id,
            title: title,
            tag: tag
          };
          dispatch(updateAccessMetrixWatcher(data, resolve, reject));
        }
      })
        .then(response => {
          showAlert(response.message, "success");
          handleClear();
          getRoleMetrixList();
        })
        .catch(error => {
          return showAlert(error?.response?.data?.message, "error");
        });
    } else {
      return showAlert(
        "Title must be a string with no special characters except underscore(_) or hyphen (-)",
        "error"
      );
    }
  };

  const handleClear = () => {
    setTitle("");
    setButtonTitle("Submit");
    setTag("");
    setSelectedRow("");
  };

  const handleSetForUpdate = row => {
    setTitle(row.title);
    setTag(row.tag);
    setButtonTitle("Update");
    setSelectedRow(row);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setTitle("");
    setTag("");
    setButtonTitle("Submit");
    setSelectedRow({});
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
        <Typography sx={{mt: 2, ml: 2}} variant="h6">
          Access matrix
        </Typography>
        <CardContent>
          <Grid xs={12} sx={{mt: 2, ml: 1}} container spacing={1}>
            <Grid xs={2} item>
              <FormControl
                variant="filled"
                component={Box}
                width="100%"
                marginBottom="1.5rem!important"
              >
                <TextField
                  label="Title"
                  variant="outlined"
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={event => {
                    setTitle(event.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={2} item>
              <FormControl
                variant="filled"
                component={Box}
                width="100%"
                marginBottom="1.5rem!important"
              >
                <TextField
                  label="Tag"
                  variant="outlined"
                  type="text"
                  placeholder="Tag (Must be unique)"
                  value={tag}
                  onChange={event => {
                    setTag(event.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Box
              textAlign="center"
              marginTop="0.9rem"
              marginBottom="1.3rem"
              marginLeft="0.6rem"
            >
              <Button
                variant="contained"
                disabled={
                  isTagged
                    ? !checkAccessTags(["tag_access_matrix_read_write"])
                    : false
                }
                onClick={handleSubmit}
              >
                {buttonTitle}
              </Button>
            </Box>
            <Box
              textAlign="center"
              marginTop="0.9rem"
              marginBottom="1.3rem"
              marginLeft="0.6rem"
            >
              <Button
                variant="contained"
                color={"error"}
                disabled={
                  isTagged
                    ? !checkAccessTags(["tag_access_matrix_read_write"])
                    : false
                }
                onClick={handleClear}
              >
                Clear
              </Button>
            </Box>
          </Grid>
        </CardContent>

        {roleMetrixList && roleMetrixList.length ? (
          <CardContent>
            {isTagged ? (
              checkAccessTags([
                "tag_access_matrix_read",
                "tag_access_matrix_read_write"
              ]) ? (
                <TableContainer component={Paper}>
                  <Table sx={{minWidth: 700}} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Sr.No</StyledTableCell>
                        <StyledTableCell>Title</StyledTableCell>
                        <StyledTableCell>Tag</StyledTableCell>
                        <StyledTableCell>Action</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {roleMetrixList &&
                        roleMetrixList.map((item, index) => (
                          <StyledTableRow key={item._id}>
                            <StyledTableCell align="left">
                              {index + 1 + page * 10}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {item.title}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {item.tag}
                            </StyledTableCell>
                            <StyledTableCell>
                              <Tooltip
                                title="Edit access metrix"
                                placement="top"
                                arrow
                              >
                                <IconButton
                                  aria-label="Edit access metrix"
                                  color="primary"
                                  disabled={
                                    isTagged
                                      ? !checkAccessTags([
                                          "tag_access_matrix_read_write"
                                        ])
                                      : false
                                  }
                                  onClick={() => handleSetForUpdate(item)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                  {count ? (
                    <TablePagination
                      component="div"
                      count={count}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={10}
                      rowsPerPageOptions={[10]}
                    />
                  ) : null}
                </TableContainer>
              ) : null
            ) : (
              <TableContainer component={Paper}>
                <Table sx={{minWidth: 700}} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Sr.No</StyledTableCell>
                      <StyledTableCell>Title</StyledTableCell>
                      <StyledTableCell>Tag</StyledTableCell>
                      <StyledTableCell>Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roleMetrixList &&
                      roleMetrixList.map((item, index) => (
                        <StyledTableRow key={item._id}>
                          <StyledTableCell align="left">
                            {index + 1 + page * 10}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {item.title}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {item.tag}
                          </StyledTableCell>
                          <StyledTableCell>
                            <Tooltip
                              title="Edit access metrix"
                              placement="top"
                              arrow
                            >
                              <IconButton
                                aria-label="Edit access metrix"
                                color="primary"
                                onClick={() => handleSetForUpdate(item)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
                {count ? (
                  <TablePagination
                    component="div"
                    count={count}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={10}
                    rowsPerPageOptions={[10]}
                  />
                ) : null}
              </TableContainer>
            )}
          </CardContent>
        ) : null}
      </Grid>
    </>
  );
};
