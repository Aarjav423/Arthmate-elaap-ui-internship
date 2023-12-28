import * as React from "react";
import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import CardContent from "@mui/material/CardContent";
import {styled} from "@material-ui/core/styles";
import {tableCellClasses} from "@mui/material/TableCell";
import EditIcon from "@mui/icons-material/Edit";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import {useHistory} from "react-router-dom";
import CompanyDropdown from "../../components/Company/CompanySelect";
import GenToken from "../../components/Access/GenToken";
import SetOverduesAndInterestRate from "./editProduct";
import Tooltip from "@mui/material/Tooltip";
import {storedList} from "../../util/localstorage";
import PostmanCollection from "../../components/Access/PostmanCollection";
import CompanyService from "../services/companyService";
import {
  getProductByCompanyWatcher,
  toggleProductStatusWatcher
} from "../../actions/product";
import {AlertBox} from "../../components/AlertBox";
import {checkAccessTags} from "../../util/uam";
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

let selectedRow = {};

export default function ListProduct(props) {
  const [company, setCompany] = useState(null);
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [DPDConfig, setDpdConfig] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [productDetailsModal, setProductdetailsModal] = useState(false);
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (
      isTagged &&
      company &&
      checkAccessTags(["tag_products_read", "tag_products_read_write"])
    )
      getProductsByCompanyId();
    if (!isTagged && company) getProductsByCompanyId();
  }, [company]);

  const getProductsByCompanyId = () => {
    dispatch(
      getProductByCompanyWatcher(
        company.value,
        result => {
          setProducts(result);
        },
        error => {
          setProducts([]);
        }
      )
    );
  };

  const toggleProductStatus = (e, product) => {
    const statusData = {
      id: product._id,
      status: e.target.checked === true ? 1 : 0
    };
    const tokenData = {
      company_id: product.company_id,
      loan_schema_id: product.loan_schema_id,
      user_id: user._id
    };
    dispatch(
      toggleProductStatusWatcher(
        {
          statusData,
          tokenData
        },
        result => {
          getProductsByCompanyId();
          return showAlert("Product status updated successfully", "success");
        },
        error => {
          return showAlert(error.response.data.message, "error");
        }
      )
    );
  };

  const handleNextStage = row => {
    window.open(
      `product/${row.company_id}/${row.loan_schema_id}/${row._id}`,
      "_blank"
    );
  };

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

  const handleSelectDocument = data => {
    history.push(`/admin/template/loandoc/${data.company_id}/${data._id}`);
  };

  const handleOpenProductDetails = product => {
    selectedRow = product;
    window.open(
      `product_details/${product.company_id}/${product.loan_schema_id}/${product._id}`,
      "_blank"
    );
  };

  const handleClose = () => {
    setProductdetailsModal(false);
  };

  return (
    <>
      <CardContent>
        <Grid item xs={12}>
          {alert ? (
            <AlertBox
              severity={severity}
              msg={alertMessage}
              onClose={handleAlertClose}
            />
          ) : null}
        </Grid>
        {showTable ? (
          <Box sx={{marginLeft: "0px"}} py={3}>
            <Grid xs={12} sm={3} item>
              <CompanyDropdown
                placeholder="Select company"
                onCompanyChange={value => setCompany(value)}
                width="300px"
                company={company}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                marginTop: "30px"
              }}
            >
              <Typography variant="h6">Product list</Typography>

              {isTagged && products.length ? (
                checkAccessTags([
                  "tag_products_read",
                  "tag_products_read_write"
                ]) ? (
                  <TableContainer component={Paper}>
                    <Table sx={{minWidth: 700}} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell> Name</StyledTableCell>
                          <StyledTableCell> Lending API token</StyledTableCell>
                          <StyledTableCell>Postman collection</StyledTableCell>
                          <StyledTableCell> Configuration</StyledTableCell>
                          <StyledTableCell> Details</StyledTableCell>
                          <StyledTableCell> status</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products &&
                          products.map(item => (
                            <StyledTableRow key={item.name}>
                              <StyledTableCell scope="row">
                                {item.name}
                              </StyledTableCell>
                              <StyledTableCell align="left" sx={{width: "20%"}}>
                                <GenToken
                                  disabled={
                                    !checkAccessTags([
                                      "tag_products_read_write"
                                    ])
                                  }
                                  product={item}
                                  company={company}
                                  user={user}
                                  defineError={errMsg => {
                                    showAlert(errMsg, "error");
                                  }}
                                  type="api"
                                />
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                <PostmanCollection
                                  product={item}
                                  disabled={
                                    !checkAccessTags([
                                      "tag_products_read_write"
                                    ])
                                  }
                                  defineError={errMsg => {
                                    showAlert(errMsg, "error");
                                  }}
                                />
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {
                                  <Tooltip
                                    title="Edit Product"
                                    placement="top"
                                    arrow
                                  >
                                    <IconButton
                                      aria-label="access-token"
                                      color="primary"
                                      title="Edit Product"
                                      disabled={
                                        !checkAccessTags([
                                          "tag_products_read_write"
                                        ])
                                      }
                                      onClick={() => handleNextStage(item)}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                }
                                <Tooltip
                                  title="Upload Document Template"
                                  placement="top"
                                  arrow
                                >
                                  <IconButton
                                    aria-label="access-token"
                                    color="primary"
                                    disabled={
                                      !checkAccessTags([
                                        "tag_products_read_write"
                                      ])
                                    }
                                    onClick={() => handleSelectDocument(item)}
                                  >
                                    <UploadFileOutlinedIcon />
                                  </IconButton>
                                </Tooltip>
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                <IconButton
                                  aria-label="open product details"
                                  color="primary"
                                  onClick={() => {
                                    handleOpenProductDetails(item);
                                  }}
                                >
                                  <InfoIcon />
                                </IconButton>
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                <Switch
                                  color="primary"
                                  checked={item.status ? true : false}
                                  disabled={
                                    !checkAccessTags([
                                      "tag_products_read_write"
                                    ])
                                  }
                                  onChange={e => toggleProductStatus(e, item)}
                                />
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : null
              ) : products.length ? (
                <TableContainer component={Paper}>
                  <Table sx={{minWidth: 700}} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell> Name</StyledTableCell>
                        <StyledTableCell> Lending API token</StyledTableCell>
                        <StyledTableCell> Postman collection </StyledTableCell>
                        <StyledTableCell> Configuration</StyledTableCell>
                        <StyledTableCell> Details</StyledTableCell>
                        <StyledTableCell> status</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products &&
                        products.map(item => (
                          <StyledTableRow key={item.name}>
                            <StyledTableCell scope="row">
                              {item.name}
                            </StyledTableCell>
                            <StyledTableCell align="left" sx={{width: "20%"}}>
                              <GenToken
                                product={item}
                                company={company}
                                user={user}
                                defineError={errMsg => {
                                  showAlert(errMsg, "error");
                                }}
                                type="api"
                              />
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              <PostmanCollection
                                product={item}
                                defineError={errMsg => {
                                  showAlert(errMsg, "error");
                                }}
                              />
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {
                                <Tooltip
                                  title="Edit Product"
                                  placement="top"
                                  arrow
                                >
                                  <IconButton
                                    aria-label="access-token"
                                    color="primary"
                                    title="Edit Product"
                                    onClick={() => handleNextStage(item)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                              }
                              <Tooltip
                                title="Upload Document Template"
                                placement="top"
                                arrow
                              >
                                <IconButton
                                  aria-label="access-token"
                                  color="primary"
                                  onClick={() => handleSelectDocument(item)}
                                >
                                  <UploadFileOutlinedIcon />
                                </IconButton>
                              </Tooltip>
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              <IconButton
                                aria-label="open product details"
                                color="primary"
                                onClick={() => {
                                  handleOpenProductDetails(item);
                                }}
                              >
                                <InfoIcon />
                              </IconButton>
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              <Switch
                                color="primary"
                                checked={item.status ? true : false}
                                onChange={e => toggleProductStatus(e, item)}
                              />
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : null}
            </Grid>
          </Box>
        ) : (
          <SetOverduesAndInterestRate
            selectedProducts={DPDConfig}
            company={company}
            backToProductList={backToProductList}
          />
        )}

        {isTagged && company ? (
          checkAccessTags(["tag_user_read", "tag_user_read_write"]) ? (
            <CompanyService
              disabled={!checkAccessTags(["tag_products_read_write"])}
              company={company}
            />
          ) : null
        ) : company ? (
          <CompanyService company={company} />
        ) : null}
      </CardContent>
    </>
  );
}
