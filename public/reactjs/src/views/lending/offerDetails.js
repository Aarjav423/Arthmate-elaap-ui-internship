import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getOfferDetailsWatcher } from "../../actions/offerDetails";

const OfferDetails = props => {
  const dispatch = useDispatch();
  const { title, loan_app_id, company_id, product_id, isOpen, onTabChange } =
    props;
  const [expanded, setExpanded] = useState(isOpen);
  const [offerDetails, setOfferDetails] = useState(null);

  useEffect(() => {
    if (loan_app_id) fetchOfferDetails();
  }, []);

  const fetchOfferDetails = () => {
    dispatch(
      getOfferDetailsWatcher(
        { loan_app_id, company_id, product_id },
        async response => {
          setOfferDetails(response.data);
        },
        error => {
        }
      )
    );
  };

  useEffect(() => {
    setExpanded(isOpen);
  }, [isOpen]);
  return (
    <>
      {offerDetails && (
        <Grid item xs={12}>
          <Accordion
            expanded={expanded}
            onChange={() => {
              onTabChange();
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" component="h2">{`${
                title || "NA"
              }`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid
                xs={12}
                container
                sx={{
                  display: "flex",
                  flexDirection: "row"
                }}
              >
                <Grid xs={3} item>
                  <Typography sx={{ mb: 1.5, ml: 2 }} variant="body2">
                    {
                      <span style={{ color: "#6E6E6E", fontSize: "14px" }}>
                        {"Offered Amount"}
                      </span>
                    }
                  </Typography>
                  <Typography sx={{ mb: 1.5, ml: 2 }} variant="body2">
                    {`₹ ${offerDetails?.offered_amount}`}
                  </Typography>
                </Grid>
                <Grid xs={3} item>
                  <Typography sx={{ mb: 1.5, ml: 2 }} variant="body2">
                    {
                      <span style={{ color: "#6E6E6E", fontSize: "14px" }}>
                        {"Offered Interest Rate"}
                      </span>
                    }
                  </Typography>
                  <Typography sx={{ mb: 1.5, ml: 2 }} variant="body2">
                    {`${offerDetails?.offered_int_rate}%`}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      )}
    </>
  );
};

export default OfferDetails;
