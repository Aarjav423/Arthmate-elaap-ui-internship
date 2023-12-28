import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Table from "react-sdk/dist/components/Table";
import { nachReportListData } from "../../util/nach/nachReportListData";
import { AlertBox } from "../../components/CustomAlertbox";
import "react-sdk/dist/styles/_fonts.scss";

const NachReportList = () => {
  const history = useHistory();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [reportList, setreportList] = useState(nachReportListData);

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const columns = [
    {id:'id', label:'SR. NO.'},
    {id:'report_category', label:'REPORT CATEGORY'},
    {id:'report_name', label:'REPORT NAME'},
    {id:'description', label:'REPORT DESCRIPTION'},
  ];

  const data = reportList
    ? reportList.map(row => {
        return {
          id: row.id,
          report_category: row.report_category,
          report_name: 
            <div
                disabled={row.disabled}
                onClick={() =>
                    !row.disabled && handleNav(row.report_type)
                }
            >
                <Link>{row.report_name}</Link>
            </div>,
          description: row.description,
        }
      })
    : [];

  const handleNav = (name) => {
    history.push({
      pathname: `/admin/nach-report/${name}`
    });
  };

  return (
      <>
        {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
        ) : null}

        <div 
            id="nach-report-list"
            style={{
                margin: '0 24px',
            }}
        >
            <Table
                columns={columns}
                data={data}
                customStyle={{
                    fontFamily: 'Montserrat-Medium',
                }}
            />
        </div>
      </>
  );
};

export default NachReportList;