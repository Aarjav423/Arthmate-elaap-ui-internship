import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CompanyDropdown from "../../components/Company/CompanySelect";
import ProductDropdown from "../../components/Product/ProductSelect";
import {Divider, Grid} from "@mui/material";
import CustomDropdown from "../../components/custom/customSelect";
import {disbursmentChannelList} from "../loanTransaction/fields";
import {getDisbursmentDataWatcher} from "../../actions/clTransactions";
import {useDispatch} from "react-redux";
import {downloadDataInXLSXFormat} from "../../util/helper";

const DownloadDisbursement = ({isOpen, handleopenClosePopup, handleAleart}) => {
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");
  const [company, setCompany] = React.useState(null);
  const [product, setProduct] = React.useState(null);
  const [bank, setBank] = React.useState(null);
  const dispatch = useDispatch();

  const handleClose = () => {
    handleopenClosePopup();
  };

  const handleDownloadFile = data => {
    const jsonData = data?.map(record => {
      return {
        ...record,
        status: "Disbursement Approved"
      };
    });
    downloadDataInXLSXFormat(`DisbursementFile_${company?.label}`, jsonData);
    setTimeout(() => {
      handleClose();
      handleAleart(
        null,
        "Disbursement File Downloaded Successfully",
        "success"
      );
    }, 2000);
  };

  const handleDownloadChange = () => {
    dispatch(
      getDisbursmentDataWatcher(
        {
          company_id: company?.value,
          product_id: product?.value,
          record_method: bank?.value
        },
        response => {
          if (response?.data?.length) {
            handleDownloadFile(response?.data);
          } else {
            handleClose();
            handleAleart(null, "NO records found", "error");
          }
        },
        error => {
          handleClose();
          handleAleart(error, "", "error");
        }
      )
    );
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={isOpen}
        onClose={handleClose}
      >
        <DialogTitle>Download Disbursement File</DialogTitle>
        <Divider />
        <DialogContent>
          <Grid>
            <Grid sx={{margin: "10px 0", display: "flex"}} item>
              <DialogTitle>Select Partner</DialogTitle>
              <div style={{width: "500px"}}>
                <CompanyDropdown
                  placeholder="Select company"
                  company={company}
                  onCompanyChange={value => {
                    setCompany(value ? value : "");
                    setProduct(null);
                  }}
                />
              </div>
            </Grid>
            <Grid sx={{margin: "15px 0", display: "flex"}} item>
              <DialogTitle>Select Product</DialogTitle>
              <div style={{width: "500px"}}>
                <ProductDropdown
                  placeholder="Select product"
                  onProductChange={value => {
                    setProduct(value ? value : "");
                  }}
                  company={company}
                  product={product}
                />
              </div>
            </Grid>
            <Grid sx={{margin: "15px 0", display: "flex"}} item>
              <DialogTitle>Select Bank</DialogTitle>
              <div style={{width: "500px", marginLeft: "20px"}}>
                <CustomDropdown
                  placeholder="Select channel"
                  data={disbursmentChannelList}
                  value={bank ?? null}
                  handleDropdownChange={bank => setBank(bank)}
                />
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadChange}
            disabled={!company || !product || !bank}
          >
            Download
          </Button>
          <Button variant="contained" color="error" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DownloadDisbursement;
