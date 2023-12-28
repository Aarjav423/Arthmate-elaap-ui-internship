import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { useParams, useHistory } from "react-router-dom";
import DemoGraphicCard from "./demographicCard";
import Validation from "./manage/validation";
import { getBorrowerDetailsByIdWatcher } from "../../actions/borrowerInfo";
import { AlertBox } from "../../components/AlertBox";

const LoanDemographics = props => {
  const { open, data, loanSchemaId, onModalClose, title, ...other } = props;
  const [loanData, setLoanData] = useState(null);
  const [cardsData, setCardsData] = useState({});
  const [validationData, setValidationData] = useState({});
  //alert
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const { loan_id, product_id, company_id, loan_schema_id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const fetchLoandetails = () => {
    const params = {
      company_id: company_id,
      product_id: product_id,
      loan_id: loan_id,
      loan_schema_id: loan_schema_id
    };
    dispatch(
      getBorrowerDetailsByIdWatcher(
        params,
        result => {
          setLoanData(result);
          setValidationData(result.data);
        },
        error => {
          return showAlert(error.response.data.message, "error");
        }
      )
    );
  };

  useEffect(() => {
    fetchLoandetails();
  }, []);

  useEffect(() => {
    if (loanData) setCardsData(loanData.fieldDepartmentMapper);
  }, [loanData]);

  const onValidationError = message => {
    showAlert(message, "error");
  };

  const onValidationSuccess = message => {
    showAlert(message, "success");
  };
  const handleAlertClose = () => {
    setAlert(false);
    setAlertMessage("");
    setSeverity("");
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
      history.push("/admin/lending/loan_queue");
    }, 2000);
  };

  return (
    <CardContent>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      <Grid xs={12} container>
        {title && (
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
        )}
        <Validation
          data={validationData}
          onError={onValidationError}
          onSuccess={onValidationSuccess}
          loanSchemaId={loan_schema_id}
        />
        <Grid
          className="mt-5"
          style={{ justifyContent: "center", cursor: "pointer" }}
          xs={12}
          container
          spacing={2}
          sx={{ margin: 0 }}
        >
          {cardsData &&
            Object.keys(cardsData).map((item, index) => (
              <DemoGraphicCard
                key={index}
                title={item.toUpperCase()}
                data={cardsData[item]}
                loanData={loanData.data}
              />
            ))}
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default LoanDemographics;
