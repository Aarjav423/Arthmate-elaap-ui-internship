import * as React from "react";
import {useDispatch} from "react-redux";
import IconButton from "@mui/material/IconButton";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import moment from "moment";
import {getPostmanCollectionLoanBookWatcher} from "../../actions/product";

export default function PostmanCollection(props) {
  const {product, company, type, defineError, disabled} = props;
  const dispatch = useDispatch();

  const handleDownloadJson = json => {
    const fileName = `postman-collection-${moment().format("YYYY-MM-DD")}.json`;
    const finalJson = JSON.stringify(json);
    const blob = new Blob([finalJson], {type: "application/json"});
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPostmanCollection = () => {
    const data = {
      company_id: product.company_id,
      product_id: product._id,
      loan_schema_id: product.loan_schema_id * 1,
      credit_rule_grid_id: product.credit_rule_grid_id,
      automatic_check_credit: product.automatic_check_credit,
      type: "dashboard-postman"
    };
    dispatch(
      getPostmanCollectionLoanBookWatcher(
        data,
        response => {
          handleDownloadJson(response);
        },
        error => {
          defineError(error.response.data.message);
        }
      )
    );
  };

  return (
    <IconButton
      aria-label="access-token"
      color="primary"
      disabled={disabled}
      onClick={getPostmanCollection}
    >
      <CloudDownloadIcon />
    </IconButton>
  );
}
