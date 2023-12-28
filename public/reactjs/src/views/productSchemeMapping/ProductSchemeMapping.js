import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import CardContent from "@mui/material/CardContent";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@material-ui/core/styles";
import Paper from "@mui/material/Paper";
import { Button, TableBody } from "@material-ui/core";
import { AlertBox } from "../../components/AlertBox";
import Box from "@material-ui/core/Box";
import TextField from "@mui/material/TextField";
import TablePagination from "@mui/material/TablePagination";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import { storedList } from "../../util/localstorage";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Switch from "@mui/material/Switch";
import {
  getAllActiveProductRequestWatcher,
  getAllProductRequestWatcher,
  getAllProductSchemeMappingWatcher,
  getAllProductSchemeWatcher,
  toggleProductSchemeStatusWatcher,
  getAllSchemesListWatcher,
  productSchemeMappedWatcher
} from "../../actions/productSchemeMapping";
const user = storedList("user");
import  Pagination  from "../../../node_modules/react-sdk/dist/components/Pagination/Pagination"

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
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white"
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const ProductSchemeMapping = () => {
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [isOpen, setisOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [productListed, setProductListed] = useState([]);
  const [activeProductListed, setActiveProductListed] = useState([]);
  const [activeProductList, setActiveProductList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [schemaList, setSchemaList] = useState([]);
  const [dataTable, SetDataTable] = useState([]);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [value, setValue] = useState("");
  const [schemavalue, setSchemaValue] = useState("");
  const [toggleStatus, setToggleStatus] = useState();
  const [allSchemeList, setAllSchemeList] = useState([]);
  const [selectedProductmappedValue, setSelectedProductmappedValue] =
    useState("");
  const [selectedActiveProductmappedValue, setSelectedActiveProductmappedValue] =
    useState("");
  const [selectedschememappedValue, setSelectedschememappedValue] =
    useState("");
  const [tableCount, setTableCount] = useState();
  const [selectedProductItem, setSelectedProductItem] = useState(null);
  const [selectedSchemeItem, setSelectedSchemeItem] = useState(null);

  // const handleChangePage = async (event, newPage) => {
  //   setPage(newPage);
  // };
  const handleChangePage = async (newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  useEffect(() => {
    ProductLists();
    ActiveProductLists();
    getschemaList();
    getTableShow({ page: page, limit: rowsPerPage });
  }, [page, rowsPerPage]);

  useEffect(() => {
    const params = {
      product_id: value,
      scheme_id: schemavalue,
      page: page,
      limit: limit
    };
    getTableShow(params);
  }, [toggleStatus , page]);

  const onSearch = () => {
    if (!value) return showAlert("Please select product", "error");
    const filterData = {};
    const params = {
      product_id: value,
      scheme_id: schemavalue,
      page: page,
      limit: limit
    };
    filterData.page = page;
    getTableShow(params);
  };

  const ProductLists = () => {
    new Promise((resolve, reject) => {
      dispatch(getAllProductRequestWatcher({}, resolve, reject));
    })
      .then((response) => {
        setProductListed(response);
      })
      .catch((error) => {});
  };

  const ActiveProductLists = () => {
    new Promise((resolve, reject) => {
      dispatch(getAllActiveProductRequestWatcher({}, resolve, reject));
    })
      .then((response) => {
        setActiveProductListed(response);
      })
      .catch((error) => {});
  };

  const handleChangeProduct = async (event) => {
    const values = productListed.filter(
      (item) => item.key == event.target.innerText
    );
    setValue(values[0]?.value);
    setSelectedProductItem(event.target.innerText);
    setSelectedSchemeItem(null);
    setSchemaList([]);
    new Promise((resolve, reject) => {
      dispatch(
        getAllProductSchemeWatcher(
          {
            product_id: values[0]?.value
          },
          resolve,
          reject
        )
      );
    })
      .then((response) => {
        setSchemaList(response);
      })
      .catch((error) => {});
  };
  const handlechangeScheme = async (event) => {
    const valuesd = schemaList.filter(
      (item) => item.key == event.target.innerText
    );
    setSchemaValue(valuesd[0]?.value);
    setSelectedSchemeItem(event.target.innerText);
  };

  const selectedProductmapped = async (event) => {
    const values = productListed.filter(
      (item) => item.key == event.target.innerText
    );
    setSelectedProductmappedValue(values[0]?.value);
  };

  const selectedActiveProductmapped = async (event) => {
    const values = activeProductListed.filter(
      (item) => item.key == event.target.innerText
    );
    setSelectedActiveProductmappedValue(values[0]?.value);
  };

  const getschemaList = () => {
    const params = {
      page: page,
      limit: rowsPerPage
    };

    dispatch(
      getAllSchemesListWatcher(
        params,
        (response) => {
          setAllSchemeList(response.data.rows);
        },
        (error) => {}
      )
    );
  };

  const handleClose = () => {
    setOpenDialog(!openDialog);
    setisOpen(!isOpen);
    setSelectedActiveProductmappedValue("");
    setSelectedschememappedValue("");
  };

  const selectedschememapped = async (event) => {
    const values = allSchemeList.filter(
      (item) => item.scheme_name == event.target.innerText
    );
    setSelectedschememappedValue(values[0]?._id);
  };

  const onSubmitButton = () => {
    if (!selectedActiveProductmappedValue && !selectedschememappedValue)
      return showAlert("Please select product and scheme", "error");
    if (!selectedActiveProductmappedValue)
      return showAlert("Please select product", "error");
      if (!(selectedschememappedValue >= 0))
      return showAlert("Please select scheme", "error");

    const mappeddata = {
      product_id: selectedActiveProductmappedValue,
      scheme_id: selectedschememappedValue
    };

    new Promise((resolve, reject) => {
      dispatch(productSchemeMappedWatcher(mappeddata, resolve, reject));
    })
      .then((response) => {
        setProductList(response);
        setAlert(true);
        setSeverity("success");
        setAlertMessage(response.message);
        setTimeout(() => {
          handleAlertClose();
          handleClose();
          getTableShow({ page: page, limit: rowsPerPage });
          ProductLists();
        }, 2000);
      })
      .catch((error) => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(error.response.data.message);
        setTimeout(() => {
          handleAlertClose();
        }, 2000);
      });
  };

  const getTableShow = (params) => {
    const filterData = {};
    filterData.page = page;
    dispatch(
      getAllProductSchemeMappingWatcher(
        params,
        (response) => {
          SetDataTable(response.data.rows);
          setTableCount(response.data.count);
          setCount(response.data.count);
        },
        (error) => {
          setAlert(true);
          setSeverity("error");
          setAlertMessage(error.response.data.message);
          setTimeout(() => {
            handleAlertClose();
          }, 2000);
        }
      )
    );
  };

  const toggleProductStatus = (item) => {
    const data = {
      id: item._id,
      user_id: user.id,
      product_id: item.product_id,
      status: item.status ? "0" : "1"
    };
    new Promise((resolve, reject) => {
      dispatch(toggleProductSchemeStatusWatcher(data, resolve, reject));
    })
      .then((response) => {
        setToggleStatus(response);
        setAlert(true);
        setSeverity("success");
        setAlertMessage(response.message);
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
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

  const renderProductSchemePopup = () => (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
        maxWidth={"lg"}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          style={{ backgroundColor: "#5e72e4", color: "white" }}
        >
          Add Product Scheme Mapping
        </BootstrapDialogTitle>
        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            getOptionLabel={(option) => option.key}
            options={activeProductListed}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.value}>
                {option.key}
              </Box>
            )}
            onChange={(event) => selectedActiveProductmapped(event)}
            sx={{ mb: 2, mt: 2, minWidth: "410px" }}
            renderInput={(params) => (
              <TextField {...params} label="Select Product" />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={allSchemeList?.map((keyword) => keyword.scheme_name)}
            onChange={(event) => selectedschememapped(event)}
            sx={{ mb: 2, mt: 2, minWidth: "410px" }}
            renderInput={(params) => (
              <TextField {...params} label="Select Scheme" />
            )}
          />
        </Grid>
        <DialogActions style={{ marginTop: "10px" }}>
          <Button
            style={{
              backgroundColor: "white",
              color: "#5e72e4",
              textAlign: "center",
              border: "2px solid #5e72e4",
              marginLeft: "10px",
              marginRight: "10px",
              marginBottom: "5px",
              width: "200px"
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            style={{
              backgroundColor: "#5e72e4",
              color: "#fff",
              textAlign: "center",
              marginBottom: "5px",
              marginRight: "10px",
              width: "200px"
            }}
            onClick={onSubmitButton}
          >
            Submit
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };
  const label = { inputProps: { "aria-label": "Switch demo" } };

  return (
    <Grid item xs={12}>
      <Typography sx={{ mt: 2, mb: 2 }} variant="h6">
        Product Scheme Mapping
      </Typography>
      {isOpen ? renderProductSchemePopup() : null}
      <div style={{ display: "flex", alignItems: "center" }}>
        {alert ? (
          <AlertBox
            severity={severity}
            msg={alertMessage}
            onClose={handleAlertClose}
          />
        ) : null}
        <Grid item xs={3}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            getOptionLabel={(option) => option.key}
            options={productListed}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.value}>
                {option.key}
              </Box>
            )}
            onChange={(event) => handleChangeProduct(event)}
            renderInput={(params) => (
              <TextField {...params} label="Select Product" />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            disabled={!schemaList || schemaList.length === 0}
            options={schemaList?.map((item) => item.key)}
            value={selectedSchemeItem}
            onChange={(event) => handlechangeScheme(event)}
            renderInput={(params) => (
              <TextField {...params} label="Select Scheme" />
            )}
          />
        </Grid>

        <Button
          style={{
            backgroundColor: "#5e72e4",
            color: "#fff",
            marginLeft: "10px",
            height: "55px"
          }}
          onClick={onSearch}
        >
          Search
        </Button>
        <Button
          size="medium"
          style={{
            float: "right",
            backgroundColor: "#5e72e4",
            color: "#fff",
            marginLeft: "auto",
            marginRight: "20px",
            height: "55px"
          }}
          onClick={() => {
            setisOpen(!isOpen);
            setOpenDialog(!openDialog);
          }}
        >
          <AddIcon style={{ marginTop: "-2px" }} /> Add Scheme Mapping
        </Button>
      </div>

      <CardContent style={{ marginTop: "30px" }}>
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Product Name </StyledTableCell>
                <StyledTableCell align="left">Scheme Name</StyledTableCell>
                <StyledTableCell align="left">Status</StyledTableCell>
              </TableRow>
            </TableHead>
            {dataTable.length ? (
              <TableBody>
                {dataTable.map((item, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell scope="row">
                      {item.product_name}
                    </StyledTableCell>
                    <StyledTableCell scope="row">
                      {item.scheme_name}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Switch
                        {...label}
                        color="primary"
                        checked={item.status}
                        value={item.status}
                        onChange={() => toggleProductStatus(item)}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>No product scheme mapping to show</TableBody>
            )}
          </Table>
        </TableContainer>
        <Pagination onPageChange={handleChangePage} totalItems={count} itemsPerPage={10} />
        {/* <TablePagination
          sx={{
            ".MuiTablePagination-toolbar": {
              color: "rgb(41, 39, 39)",
              height: "35px",
              margin: "none"
            },

            ".MuiTablePagination-selectLabel": {
              marginBottom: "0px"
            },
            ".MuiTablePagination-displayedRows": {
              marginBottom: "-1px"
            },
            ".MuiTablePagination-select": {
              paddingTop: "6px"
            }
          }}
          rowsPerPageOptions={[15]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </CardContent>
    </Grid>
  );
};
export default ProductSchemeMapping;
