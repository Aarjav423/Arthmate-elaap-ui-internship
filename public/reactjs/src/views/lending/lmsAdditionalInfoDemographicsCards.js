import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { useState } from "react";
import BasicDatePicker from "../../components/DatePicker/basicDatePicker";
import EnumDropdown from "../../components/Dropdowns/EnumDropdown";
import { verifyDateAfter1800 } from "../../util/helper";
export default function AccordianTab(props) {
  const {
    panelId,
    title,
    data,
    validationData,
    stateData,
    mappingFieldsTobeDisabled,
    nonEditableMode,
    change,
    premiumData,
    handleEditInsuranceAmount,
    handleEnumDropdownChanged,
    changeDateSelected,
    enumFields,
    loanStatus,
    ...other
  } = props;

  const [expanded, setExpanded] = useState("panel0");
  const handleChange = panel => {
    expanded !== panel ? setExpanded(panel) : setExpanded(false);
  };

  return (
    <Grid item xs={12} sx={{ m: "0.5rem" }} key={panelId}>
      <Accordion
        expanded={expanded === "panel" + panelId}
        onChange={() => {
          handleChange("panel" + panelId);
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="pane{index}bh-content"
          id="panel{index}bh-header"
        >
          <Typography variant="h6" component="h2">{`${
            title || "NA"
          }`}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid xs={12} container display={"flex"} direction={"row"}>
            {data?.map((row, index) => {
              return (
                <>
                  <Grid
                    xs={9}
                    md={3}
                    item
                    key={`${row.type}_vl_${row.field}_${index}`}
                  >
                    {enumFields?.loan[row.field]?.length ? (
                      <>
                        <Typography>
                          {`${row.title}`}{" "}
                          <span style={{ color: "red" }}>
                            {row.checked.toLowerCase() === "true" ? ` *` : ""}
                          </span>
                        </Typography>
                        {enumFields?.lead && loanStatus === "" ? (
                          <EnumDropdown
                            data={enumFields?.loan[row.field].map(item => {
                              return { label: item, value: item };
                            })}
                            id={row.field}
                            onValueChange={value => {
                              handleEnumDropdownChanged(
                                value,
                                `${row.type}_vl_${row.field}`
                              );
                            }}
                            helperText={
                              row.checked.toLowerCase() === "true"
                                ? validationData[
                                    `${row.type}_vl_${row.field}State`
                                  ] === "has-danger"
                                  ? row.validationmsg
                                  : ""
                                : stateData[`${row.type}_vl_${row.field}`] !==
                                    "" &&
                                  (validationData[
                                    `${row.type}_vl_${row.field}State`
                                  ] === "has-danger"
                                    ? row.validationmsg
                                    : "")
                            }
                            error={
                              row.checked.toLowerCase() === "true"
                                ? validationData[
                                    `${row.type}_vl_${row.field}State`
                                  ] === "has-danger"
                                : stateData[`${row.type}_vl_${row.field}`] !==
                                    "" &&
                                  validationData[
                                    `${row.type}_vl_${row.field}State`
                                  ] === "has-danger"
                            }
                          />
                        ) : (
                          stateData[`${row.type}_vl_${row.field}`]
                        )}
                      </>
                    ) : row.type === "date" ? (
                      <>
                        <Typography>
                          {`${row.title}`}{" "}
                          <span style={{ color: "red" }}>
                            {row.checked.toLowerCase() === "true" ? ` *` : ""}
                          </span>
                        </Typography>
                        <BasicDatePicker
                          placeholder={""}
                          value={
                            stateData[`${row.type}_vl_${row.field}`] || null
                          }
                          onDateChange={date => {
                            changeDateSelected(
                              verifyDateAfter1800(
                                moment(date).format("YYYY-MM-DD")
                              )
                                ? moment(date).format("YYYY-MM-DD")
                                : date,
                              `${row.type}_vl_${row.field}`
                            );
                          }}
                          error={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                                  `${row.type}_vl_${row.field}State`
                                ] === "has-danger"
                              : stateData[`${row.type}_vl_${row.field}`] !==
                                  "" &&
                                validationData[
                                  `${row.type}_vl_${row.field}State`
                                ] === "has-danger"
                          }
                          helperText={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                                  `${row.type}_vl_${row.field}State`
                                ] === "has-danger"
                                ? row.validationmsg
                                : ""
                              : stateData[`${row.type}_vl_${row.field}`] !==
                                  "" &&
                                (validationData[
                                  `${row.type}_vl_${row.field}State`
                                ] === "has-danger"
                                  ? row.validationmsg
                                  : "")
                          }
                        />
                      </>
                    ) : (
                      <>
                        <Typography>
                          {`${row.title}`}{" "}
                          <span style={{ color: "red" }}>
                            {row.checked.toLowerCase() === "true" ? ` *` : ""}
                          </span>
                        </Typography>
                        <TextField
                          fullWidth
                          variant="standard"
                          type="text"
                          name={`${row.type}_vl_${row.field}`}
                          helperText={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                                  `${row.type}_vl_${row.field}State`
                                ] === "has-danger"
                                ? row.validationmsg
                                : ""
                              : stateData[`${row.type}_vl_${row.field}`] !==
                                  "" &&
                                (validationData[
                                  `${row.type}_vl_${row.field}State`
                                ] === "has-danger"
                                  ? row.validationmsg
                                  : "")
                          }
                          error={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                                  `${row.type}_vl_${row.field}State`
                                ] === "has-danger"
                              : stateData[`${row.type}_vl_${row.field}`] !==
                                  "" &&
                                validationData[
                                  `${row.type}_vl_${row.field}State`
                                ] === "has-danger"
                          }
                          placeholder={""}
                          value={stateData[`${row.type}_vl_${row.field}`] || ""}
                          onChange={change}
                          disabled={
                            premiumData
                              ? row.field === "insurance_amount" ||
                                mappingFieldsTobeDisabled.indexOf(
                                  `${row.type}_vl_${row.field}`
                                ) > -1 ||
                                nonEditableMode
                              : mappingFieldsTobeDisabled.indexOf(
                                  `${row.type}_vl_${row.field}`
                                ) > -1 || nonEditableMode
                          }
                        />
                      </>
                    )}
                  </Grid>
                  <Grid
                    xs={1}
                    item
                    key={`${row.type}_vl_${row.field}`}
                    display={"flex"}
                    alignItems={"flex-end"}
                  >
                    {row.field === "insurance_amount" && premiumData ? (
                      <IconButton
                        component="span"
                        aria-label="edit"
                        color="primary"
                        title="Edit insurance amount"
                        onClick={() => handleEditInsuranceAmount()}
                      >
                        <EditIcon />
                      </IconButton>
                    ) : null}
                  </Grid>
                </>
              );
            })}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
