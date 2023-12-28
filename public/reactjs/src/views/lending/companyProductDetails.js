import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllCompaniesWatcher } from "../../actions/company";
import { getProductByIdWatcher } from "../../actions/product";

const CompanyProductDetails = props => {
  const dispatch = useDispatch();
  const { company_id, product_id, title, isOpen, onTabChange } = props;
  const [company, setCompany] = useState(null);
  const [product, setProduct] = useState(null);
  const [expanded, setExpanded] = useState(isOpen);

  useEffect(() => {
    dispatch(
      getAllCompaniesWatcher(
        async companies => {
          const companyInRow = companies.filter(
            item => item._id.toString() === company_id
          )[0];
          setCompany(companyInRow);
          dispatch(
            getProductByIdWatcher(
              product_id,
              async productResp => {
                const productInRow = productResp;
                setProduct(productInRow);
              },
              productError => {}
            )
          );
        },
        error => {}
      )
    );
  }, []);

  useEffect(() => {
    setExpanded(isOpen);
  }, [isOpen]);
  return (
    <>
      <Grid item xs={12}>
        {company?.name && product?.name ? (
          <Accordion
            expanded={expanded}
            onChange={() => {
              onTabChange();
              setExpanded(!expanded);
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
                      <span style={{ color: "#6E6E6E", fontSize: "12px" }}>
                        {"Product name"}
                      </span>
                    }
                    {<div style={{ marginTop: "2px" }}>{product?.name}</div>}
                  </Typography>
                </Grid>
                <Grid xs={3} item>
                  <Typography sx={{ mb: 1.5, ml: 2 }} variant="body2">
                    {
                      <span style={{ color: "#6E6E6E", fontSize: "12px" }}>
                        {"Company name"}
                      </span>
                    }
                    {<div style={{ marginTop: "2px" }}>{company?.name}</div>}
                  </Typography>
                </Grid>
                <Grid xs={3} item>
                  <Typography sx={{ mb: 1.5, ml: 2 }} variant="body2">
                    {
                      <span style={{ color: "#6E6E6E", fontSize: "12px" }}>
                        {"Company short code"}
                      </span>
                    }
                    {<div style={{ marginTop: "2px" }}>{company?.code}</div>}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ) : null}
      </Grid>
    </>
  );
};

export default CompanyProductDetails;
