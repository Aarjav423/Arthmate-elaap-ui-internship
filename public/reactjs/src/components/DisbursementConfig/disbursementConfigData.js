import * as React from "react";
import {useDispatch} from "react-redux";
import PropTypes from "prop-types";
import {getDisbursementConfigChannelByCIDPID} from "../../actions/disbursementConfigChannel";

const DisbursementConfigData = ({
  company,
  product,
  updateDisbursementChannel
}) => {
  const [config, setConfig] = React.useState(null);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!product || !company) setConfig(null);
    if (company && product) {
      dispatch(
        getDisbursementConfigChannelByCIDPID(
          {company_id: company.value, product_id: product.value},
          result => {
            setConfig(result);
            updateDisbursementChannel({
              label: result.disburse_channel,
              value: result.disburse_channel
            });
          },
          error => {
            updateDisbursementChannel(null);
            setConfig(null);
          }
        )
      );
    }
  }, [product]);

  return (
    <>
      <p style={{padding: "0 10px 0 10px", margin: 0}}>
        <span>Channel configured is: </span>
        {config ? config.disburse_channel : "NA"}
      </p>
    </>
  );
};

DisbursementConfigData.propTypes = {
  children: PropTypes.node
};

DisbursementConfigData.defaultProps = {
  children: ""
};

export default DisbursementConfigData;
