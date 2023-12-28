const axios = require('axios');
const bodyParser = require('body-parser');
const URLS = require('../constants/apiUrls');
const helper = require('../utils/helper');

module.exports = (app) => {
  app.use(bodyParser.json());
  app.post('/api/tds_refund', (req, res) => {
    const data = req.body;
    const token = helper.generateToken(
      {
        company_id: req.body.company_id,
        product_id: req.body.product_id,
        user_id: req.body.user_id,
        type: 'dash',
      },
      60 * 5 * 1,
    );
    axios
      .post(URLS.POST_TDS_REFUND_REQUESTS, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        return res.status(400).json({
          message: error.response.data.message || 'Error while saving refund requests',
        });
      });
  });
};
