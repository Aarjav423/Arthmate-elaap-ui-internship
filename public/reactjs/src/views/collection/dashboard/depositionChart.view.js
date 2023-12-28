import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getDepositionDataWatcher } from "actions/collection/dashboard.action";
import StackedBarChart from "components/Collection/StackedChart";

const DepositionChart = (props) => {
  const { companyCode } = props;
  const dispatch = useDispatch();
  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [dataInPercentage, setDataInPercentage] = useState([]);
  useEffect(() => {
    fetchDepositionData();
  }, [companyCode]);

  const fetchDepositionData = () => {
    const payload = {
      company_code: companyCode,
    };

    new Promise((resolve, reject) => {
      dispatch(getDepositionDataWatcher(payload, resolve, reject));
    })
      .then((response) => {
        loadData(response.data.deposition_data);
      })
      .catch((error) => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(error.response?.data?.message);
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };

  const loadData = (data) => {
    const PTP = data.ptp || 0;
    const RTP = data.rtp || 0;
    const Dispute = data.dispute || 0;
    const BrokenPTP = data.broken_ptp || 0;
    const Shifted = data.shifted || 0;
    const AddressNotFound = data.address_not_found || 0;
    const VisitPending = data.visit_pending || 0;
    const VisitScheduled = data.visit_scheduled || 0;

    setDataInPercentage([
      PTP,
      RTP,
      Dispute,
      BrokenPTP,
      Shifted,
      AddressNotFound,
      VisitPending,
      VisitScheduled,
    ]);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const chartlabels = [
    "PTP",
    "RTP",
    "Dispute",
    "Broken PTP",
    "Shifted",
    "Address Not Found",
    "Visit Pending",
    "Scheduled Visit",
  ];

  const total = [100, 100, 100, 100, 100, 100, 100, 100];
  const labels = {
    original: "Deposition Status",
    background: "Total",
  };
  const barColors = {
    original: [
      "#D5E4FA", // PTP
      "#E5D6FB", // RTP
      "#FBD4F5", // Dispute
      "#85B0FC", // Broken PTP
      "#FFFDC7", // Shifted
      "#E85046", // Address Not Found
      "#FFC48B", // Visit Pending
      "#FBC7D4", // Visit Scheduled
    ],
    background: [
      "#ECF2FC", // PTP
      "#F6F1FC", // RTP
      "#FFEBFC", // Dispute
      "#DFEBFF", // Broken PTP
      "#FFFEEE", // Shifted
      "#fad0cd", // Address Not Found
      "#FFF1E0", // Visit Pending
      "#FCE4EC", // Visit Scheduled
    ],
  };

  const containerStyle = {
    height: "400px",
    border: "1px solid #E2E2E2",
    borderRadius: "36px",
    background: "#FFF",
    padding: "20px",
    paddingBottom: "50px",
    margin: "auto",
    marginBottom: "20px",
  };
  const heading = "Deposition Status";

  return (
    <div style={{ padding: "10px" }}>
      <StackedBarChart
        chartlabels={chartlabels}
        dataInPercentage={dataInPercentage}
        total={total}
        barColors={barColors}
        containerStyle={containerStyle}
        heading={heading}
        labels={labels}
      />
    </div>
  );
};

export default DepositionChart;
