import * as React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { storedList } from "../../util/localstorage";
import { AlertBox } from "../../components/AlertBox";
import { Link } from "react-router-dom";
import Pagination from "../../../node_modules/react-sdk/dist/components/Pagination/Pagination";
import Table from "react-sdk/dist/components/Table/Table";
import { getCustomerDataWatcher } from "../../actions/customer";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Button from "react-sdk/dist/components/Button";

const CustomerQueue=(props) => {
    const [customerData,setCustomerData]=useState([]);
    const history = useHistory();
    const dispatch = useDispatch();
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchText,setSearchText]=useState("");
    const [filter,setFilter]=useState({
    page:0,
    limit:rowsPerPage,
    str:""});
    const [severity, setSeverity] = useState("");
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);
    const user = storedList("user");
    const [flag,setFlag]=useState(true);
    useEffect(()=>{
        if (flag)
        {
            getCustomerList(filter);
            setFlag(false);
        }

    },[flag])
    const customStyle = {
      height: "10vh", width: "25.3vw", maxWidth: "100%", paddingTop: "0.4%", marginLeft: "2%",fontSize:"0.65vw"
    }
    const customStyle1={
       width: "100%", maxWidth: "100%", paddingTop: "0.3%",paddingBottom:"0.1%",fontSize:"130%",fontFamily:"Montserrat-Regular"
    }
    const customButtonClass = { borderRadius:'8px', width: '145px', height: '56px' };

    const getCustomerList = async (filter) => {
      if (filter)
      {
        dispatch(
          getCustomerDataWatcher(
              filter,
              async(result)=>{
                  if (!result?.count) {
                      setCount(0);
                      setCustomerData([]);  
                      setAlert(true);
                      setSeverity("error");
                      setAlertMessage("No records found");
                      setTimeout(() => {
                          handleAlertClose();
                      }, 4000);
                      
                  }
                  else{
                      setCount(result?.count);
                      setCustomerData(result?.data.slice(0,rowsPerPage));
                  }
              },
              (error) => {
                  setCount(0);
                  setCustomerData([]);
                  setAlert(true);
                  setSeverity("error");
                  setAlertMessage(error?.response?.data?.message);
                  setTimeout(() => {
                    handleAlertClose();
                  }, 4000);
                }

          )
      )
      }
      
    }
    useEffect(()=>{
      filter.limit=rowsPerPage
      filter.page=0;
      getCustomerList(filter);
    },[rowsPerPage])

    const handleChangePage = (event, newPage) => {;
      setPage(event);
      filter.page = event;
      filter.limit = rowsPerPage;
      getCustomerList(filter);
    };

    const handleAlertClose = () => {
        setAlert(false);
        setSeverity("");
        setAlertMessage("");
      };

    const handleSearch = () => {
        const str=searchText.replace(/\s+/g, " ").trim();
        filter.str=str;
        filter.page=0;
        getCustomerList(filter);
    };

    const columns = [
        {
            id: "cust_id",
            label: "CUSTOMER ID",
            format: (rowData) => rowData?.customer_id
          },
        
        {
          id: "fullName",
          label: "CUSTOMER NAME",
          format: (rowData) =>
            `${rowData.customer_name}`
        },
        { id: "created_at", label: "JOINING DATE",format: (rowData) => rowData?.joining_date},
        {
          id:"loans",label:"LOANS",format:(rowData)=> rowData?.no_of_loans
        },
        {
          id:"lines",label:"LINES",format:(rowData)=> rowData?.no_of_lines
        },
        {
          id:"totalExposure",label:"TOTAL EXPOSURE",format:(rowData)=>new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(rowData?.total_exposure)
        },
        {
          id:"action",label:"ACTION",format:(rowData)=> <Link onClick={() => handleOpenCustomerProfile(rowData)}>View</Link>
        }



      ];
      const handleOpenCustomerProfile = (rowData) => {
        window.open(
          `/admin/customer/customerProfile/${rowData.customer_id}`,
          "_blank"
        );
      };
      return (
        <>
        {alert?<AlertBox severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}/>:null}

          <div style={{display:"flex"}}>
          <InputBox
          id="search"
          label="Search"
          customClass={{
            height: "56px", width: "25.3vw", maxWidth: "100%", paddingTop: "0.4%", marginLeft: "2%",fontSize:"0.8vw",marginRight:"2%"
          }}
          customInputClass={{
            width: "100%", maxWidth: "100%", paddingTop: "0.3%",paddingBottom:"0.1%",fontSize:"1vw",fontFamily:"Montserrat-Regular"
         }}
         onClick={e => {
          setSearchText(e.value);
        }}

          />
          <Button 
          id="search"
          label="Search"
          buttonType="primary"
          onClick={handleSearch}
          customStyle={customButtonClass}
          />
          </div>

       {customerData.length? <Table
            customStyle={{width:"95%",marginLeft:"2%"}}
            data={customerData}
            columns={columns}
        />:null}
        {count ?  <Pagination
                onPageChange={handleChangePage}
                totalItems={count}
                itemsPerPage={rowsPerPage}
  
                
              /> : null }

        </>

      );
}
export default CustomerQueue;

