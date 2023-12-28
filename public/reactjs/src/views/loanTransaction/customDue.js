import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import BKTableHeader from "../../components/BKTable/BKTableHeader";
import { duesTable } from "./tableProps";
import { setAlert } from "../../actions/common";
import { storedList } from "../../util/localstorage";
import { getCustomDuesData } from "../../actions/clTransactions";

const style = {
  position: "absolute",
  top: "20%",
  left: "15%",
  width: 1500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function CustomDue(props) {
  const { handleClose, isOpen, records } = props;
  const user = storedList("user");
  const dispatch = useDispatch();
  const [customDuesData, setCustomDuesData] = useState([]);
  const [txnId, setTxnId] = useState([]);
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);

  const getDuesData = () => {
    const postData = {
      company_id: records.company_id,
      product_id: records.product_id,
      loan_id: records.loan_id,
      txn_id: records.txn_id,
      user_id: user._id,
    };
    dispatch(
      getCustomDuesData(
        postData,
        (response) => {
          if (!response.data.length) {
            return dispatch(setAlert(false, "No records found", "error"));
          }
          setTxnId(response.data[0].txn_id);
          setCustomDuesData(response.data);
        },
        (error) => {
          dispatch(setAlert(false, error.response.data.message, "error"));
          setCustomDuesData([]);
        }
      )
    );
  };

  useEffect(() => {
    getDuesData();
  }, []);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {customDuesData.length &&
            customDuesData.map((item, id) => {
              return (
                <div key={id}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Txn Id: {item.txn_id}
                  </Typography>
                  {item.dues && item.dues.length ? (
                    <TableContainer>
                      <Table style={{ width: "100%" }}>
                        <BKTableHeader headers={duesTable} />
                        <TableBody>
                          {item.dues &&
                            item.dues.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell
                                  component="td"
                                  align="left"
                                  sx={{ width: "20%" }}
                                >
                                  {index + 1}
                                </TableCell>
                                <TableCell
                                  component="td"
                                  align="left"
                                  sx={{ width: "20%" }}
                                >
                                  {row.principal_amount}
                                </TableCell>
                                <TableCell align="left" sx={{ width: "20%" }}>
                                  {row.fees}
                                </TableCell>
                                <TableCell align="left" sx={{ width: "20%" }}>
                                  {row.subvention_fees}
                                </TableCell>
                                <TableCell align="left" sx={{ width: "10%" }}>
                                  {row.processing_fees}
                                </TableCell>
                                <TableCell align="left" sx={{ width: "10%" }}>
                                  {row.usage_fee}
                                </TableCell>
                                <TableCell align="left" sx={{ width: "30%" }}>
                                  {row.upfront_interest}
                                </TableCell>
                                <TableCell align="left" sx={{ width: "30%" }}>
                                  {row.int_value}
                                </TableCell>
                                <TableCell align="left" sx={{ width: "30%" }}>
                                  {row.interest_free_days}
                                </TableCell>
                                <TableCell align="left" sx={{ width: "30%" }}>
                                  {row.exclude_interest_till_grace_period}
                                </TableCell>
                                <TableCell align="left" sx={{ width: "30%" }}>
                                  {row.tenure_in_days}
                                </TableCell>
                                <TableCell align="left" sx={{ width: "30%" }}>
                                  {row.grace_period}
                                </TableCell>
                                <TableCell align="left" sx={{ width: "30%" }}>
                                  {row.overdue_charges_per_day}
                                </TableCell>
                                <TableCell align="left" sx={{ width: "30%" }}>
                                  {row.penal_interest}
                                </TableCell>
                                <TableCell align="left" sx={{ width: "30%" }}>
                                  {row.overdue_days}
                                </TableCell>
                                <TableCell align="left" sx={{ width: "30%" }}>
                                  {row.penal_interest_days}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : null}
                </div>
              );
            })}
        </Box>
      </Modal>
    </div>
  );
}
