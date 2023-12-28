import YearAndMonthPicker from "../DatePicker/YearAndMonthPicker";
import * as React from "react";
import Grid from "@mui/material/Grid";
import CompanyDropdown from "../Company/CompanySelect";
import ProductDropdown from "../Product/ProductSelect";

export const NewFilter = (props)=>{
  
  const {
    company,
    setCompany,
    product,
    setProduct,
    setYear,
    setMonth,
    year,
    month,
  } = props
  
  
  return (
    <>
      <Grid container m={2} border={1} spacing={2}>
        <Grid item xs={3}>
          <CompanyDropdown
            placeholder="Select company"
            company={company}
            onCompanyChange={value => {
              setCompany(value ? value : "");
              setProduct([]);
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <ProductDropdown
            placeholder="Select product"
            onProductChange={value => {
              setProduct(value ? value : "");
            }}
            company={company || null}
            product={product || null}
          />
        </Grid>
        <Grid item>
          <YearAndMonthPicker
            placeholder={"Select month"}
            views={["month"]}
            inputFormat={"MMMM"}
            value={month}
            onDateChange={date => {
              setMonth(date);
            }}
          />
        </Grid>
        <Grid item>
            <YearAndMonthPicker
              placeholder={"Select year"}
              inputFormat={"yyyy"}
              views={["year"]}
              value={year}
              onDateChange={date => {
                setYear(date)
              }}
            />
        </Grid>
      </Grid>
    </>
  )
}
