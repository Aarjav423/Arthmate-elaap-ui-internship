import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { anchorListWatcher } from "../../actions/anchor";
import {
  StyledTableCell,
  StyledTableRow
} from "../../components/custom/TableElements";
import { storedList } from "../../util/localstorage";
import { checkAccessTags } from "../../util/uam";

const user = storedList("user");

const AnchorList = () => {
  const dispatch = useDispatch();
  const [str, setStr] = useState(null);
  const [anchorList, setAnchorList] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const history = useHistory();

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  React.useEffect(() => {
    if (isTagged && checkAccessTags(["tag_user_read", "tag_user_read_write"]))
      fetchAnchorList();
    if (!isTagged) fetchAnchorList();
  }, []);

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const fetchAnchorList = () => {
    const payload = { page, limit, str: str ? str : "null" };
    dispatch(
      anchorListWatcher(
        payload,
        response => {
          setAnchorList(response.rows);
          setCount(response.count);
        },
        error => {
          setAlert(true);
          setSeverity("error");
          setAlertMessage(error.response.data.message);
          setTimeout(() => {
            handleAlertClose();
          }, 4000);
        }
      )
    );
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };
  useEffect(() => {
    if (page >= 0) {
      fetchAnchorList();
    }
  }, [page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClick = () => {
    if (page === 0) fetchAnchorList();
    if (page !== 0) setPage(0);
  };

  return (
    <>
      <Grid item xs={12}>
        <Grid
          item
          sx={{
            mt: 6,
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Grid item xs={6} style={{ display: "flex", flexDirection: "row" }}>
            <TextField
              variant="outlined"
              label="Search anchor"
              type="text"
              name="searchScheme"
              autoComplete="off"
              value={str}
              fullWidth
              onChange={e => {
                setStr(e.target.value);
              }}
              sx={{ marginRight: "10px" }}
            />
            <Button
              variant="contained"
              color="info"
              id="search"
              onClick={handleClick}
            >
              Search
            </Button>
          </Grid>

          <Button
            variant="contained"
            color="info"
            onClick={() => {
              history.push(`/admin/anchor`);
            }}
          >
            <AddIcon /> Add Anchor
          </Button>
        </Grid>

        <CardContent>
          {anchorList && (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Anchor ID</StyledTableCell>
                    <StyledTableCell>Anchor Name</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {anchorList.map((anchor, index) => (
                    <StyledTableRow
                      key={index}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        history.push(`/admin/anchor_details/${anchor._id}`);
                      }}
                    >
                      <StyledTableCell scope="row">
                        <Typography>{anchor._id}</Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography>{anchor.name}</Typography>
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
      </Grid>
    </>
  );
};

export default AnchorList;
