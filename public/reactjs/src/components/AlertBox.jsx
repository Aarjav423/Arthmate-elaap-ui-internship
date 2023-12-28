import Alert from "@mui/material/Alert";

export const AlertBox = props => {
  const {severity, msg, onClose} = props;

  return (
    <Alert
      severity={severity}
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        top: props.top?props.top:'80px',
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
