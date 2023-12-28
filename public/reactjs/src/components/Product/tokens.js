import * as React from "react";
import {useState, useEffect} from "react";
import {styled} from "@material-ui/core/styles";
import {tableCellClasses} from "@mui/material/TableCell";
import {useSelector, useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {AlertBox} from "../../components/AlertBox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";
import CardContent from "@mui/material/CardContent";
import Preloader from "../../components/custom/preLoader";
import {storedList} from "../../util/localstorage";
import {
  deleteTokenWatcher,
  updateTokenStatusWatcher,
  getTokenByCompanyWatcher
} from "../../actions/token";
import CompanySelect from "../Company/CompanySelect";
import ProductSelect from "./ProductSelect";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CoLendersDropDown from "../Dropdowns/CoLendersDropdown"

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

const Tokens = () => {
  const isLoading = useSelector(state => state.profile.loading);
  const [tokens, setTokens] = useState([]);
  const [severity, setSeverity] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const dispatch = useDispatch();
  const [company, setCompany] = useState("");
  const [product, setProduct] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [coLender, setCoLender] = useState("")
  
  const handleSearch=()=>{
    if(!coLender && !company){
      return showAlert("Please select valid company or co-lender", "error");
    }
    getTokens();
  }

  const getTokens = () => {
    const data = {
      company_id: company ? company.value : null,
      product_id: product ? product.value : null,
      co_lender_id: coLender?.co_lender_id ? coLender?.co_lender_id : null
    };
    new Promise((resolve, reject) => {
      dispatch(getTokenByCompanyWatcher(data, resolve, reject));
    })
      .then(response => {
        if (!response.length) showAlert("No records found", "error");
        setTokens(response);
        setShowTable(true);
      })
      .catch(error => {
        setShowTable(false);
        setTokens([]);
        return showAlert(error.response.data.message, "error");
      });
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const toggleTokenStatus = (e, item) => {
    const data = {
      token_id: item.token_id,
      expired: e.target.checked === true ? 0 : 1
    };
    new Promise((resolve, reject) => {
      dispatch(updateTokenStatusWatcher(data, resolve, reject));
    })
      .then(response => {
        showAlert(response?.message, "success");
        getTokens();
      })
      .catch(error => {
        return showAlert(error.response.data.message, "error");
      });
  };

  const handleDeleteToken = item => {
    const user = storedList("user");
    const data = {
      token_id: item.token_id,
      user_id: user._id
    };
    new Promise((resolve, reject) => {
      dispatch(deleteTokenWatcher(data, resolve, reject));
    })
      .then(response => {
        showAlert(response.message, "success");
        getTokens();
      })
      .catch(error => {
        showAlert(error.response.data.message, "error");
      });
  };

  return (
    <>
      <CardContent>
      <Grid container>
        <Grid item xs={12}>
          <Typography mt={2} mb={2} variant="h6">
            Token list
          </Typography>
          {alert ? (
            <AlertBox
              severity={severity}
              msg={alertMessage}
              onClose={handleAlertClose}
            />
          ) : null}
          <Box>
            <Grid container spacing={1}>
              <Grid xs={3} item>
                <CompanySelect
                  placeholder="Select company"
                  company={company}
                  onCompanyChange={value => {
                    setCompany(value);
                    setProduct("");
                    setShowTable(false)
                  }}
                  isDisabled={coLender?true:false}
                />
              </Grid>
              <Grid xs={3} item >
                <ProductSelect
                  placeholder="Select product"
                  company={company}
                  product={product}
                  value={product?.name}
                  onProductChange={value => {
                    setProduct(value);
                    setShowTable(false)
                  }}
                  isDisabled={coLender?true:false}
                />
              </Grid>
              <Grid xs={3} item >
                <CoLendersDropDown
                  placeholder="Co-lenders"
                  value={coLender}
                  id={"co-lender"}
                  disabled={company?true:false}
                  onValueChange={value => {
                    setCompany("")
                    setProduct("")
                    setCoLender(value);
                    setShowTable(false)
                  }}
                />
              </Grid>
              <Grid item xs={1} textAlign={"center"} display={"flex"} justifyContent={"center"} alignItems={"center"} >
                <Button
                  variant="contained"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {showTable ?
          <Grid item xs={12} mt={2} >
            <TableContainer component={Paper}>
              <Table sx={{minWidth: 700}} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell> Token id</StyledTableCell>
                    <StyledTableCell> Token name</StyledTableCell>
                    {coLender ? <StyledTableCell> Co-lender id</StyledTableCell> : <StyledTableCell> Company id</StyledTableCell>}
                    {coLender ? null : <StyledTableCell> Product id</StyledTableCell>}
                    <StyledTableCell> Token type</StyledTableCell>
                    <StyledTableCell> Status</StyledTableCell>
                    <StyledTableCell> Delete</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tokens &&
                    tokens.map((item, index) => (
                      <TableRow key={item.token_id}>
                        <StyledTableCell scope="row">{`${item.token_id}`}</StyledTableCell>
                        <StyledTableCell scope="row">{`${item.name}`}</StyledTableCell>
                        {coLender ? <StyledTableCell scope="row">{`${
                          item.co_lender_id ? item.co_lender_id : ""
                        }`}</StyledTableCell> : 
                        <StyledTableCell scope="row">{`${
                          item.company_id ? item.company_id : ""
                        }`}</StyledTableCell>}
                        {coLender ? null : 
                        <StyledTableCell scope="row">{`${
                          item.product_id ? item.product_id : ""
                        }`}</StyledTableCell>}
                        <StyledTableCell scope="row">{`${item.type}`}</StyledTableCell>
                        <StyledTableCell align="left">
                          <Switch
                            color="primary"
                            checked={item.expired ? false : true}
                            onChange={e => toggleTokenStatus(e, item)}
                          />
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          <Tooltip title="Delete" placement="top" arrow>
                            <IconButton
                              aria-label="Edit"
                              color="primary"
                              onClick={() => handleDeleteToken(item)}
                            >
                              <DeleteForeverIcon style={{color: "red"}} />
                            </IconButton>
                          </Tooltip>
                        </StyledTableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          : null }
      </Grid>
      {isLoading && <Preloader />}
    </CardContent>
    </>
  );
};
Tokens.propTypes = {
  children: PropTypes.node
};
Tokens.defaultProps = {
  children: ""
};
export default Tokens;
