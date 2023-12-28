import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

export const ProductAlertBox = props => {
  const {severity, msg, onClose} = props;

  return (
    <Alert
      severity={severity}
      sx={{
        position: "top",
        left: 0,
        right: 0,
        top: '80px',
        margin:"auto",
        width: "max-content",
        zIndex: 9999
      }}
      onClose={() => onClose()}
    >
      {msg}
    </Alert>
  );
};
