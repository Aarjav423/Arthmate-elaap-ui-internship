import moment from 'moment';
import { verifyDateAfter1800 } from 'util/helper';

export const applicantDetailSanitizer = (e, type, name) => {
  let value = e.value;

  if (type == 'date') {
    const date = verifyDateAfter1800(moment(e).format('YYYY-MM-DD')) ? moment(e).format('YYYY-MM-DD') : e;
    value = date;
  }

  if (name === 'pan_value') {
    value = e.value.toUpperCase();
    if (value?.length >= 10) {
      value = value.substring(0, 10);
    }
  } else if (name === 'aadhaar_value') {
    if (value && isNaN(value[value.length - 1])) {
      value = value.substring(0, value.length - 1);
    } else if (value?.length >= 12) {
      value = value.substring(0, 12);
    }
  } else if (name === 'mobile_number') {
    if (value?.length >= 10) {
      value = value.substring(0, 10);
    }
  } else if (name === 'curr_addr_pincode' || name === 'per_addr_pincode') {
    if (value?.length >= 6) {
      value = value.substring(0, 6);
    }
  } else if (name === 'curr_addr_ln1' || name === 'per_addr_ln1') {
    if (value?.length >= 40) {
      value = value.substring(0, 40);
    }
  } else if (name === 'interest_rate') {
    let rawValue = value;

    if (rawValue < 0) {
      value = 0;
    } else if (rawValue > 100) {
      value = 100;
    } else {
      value = rawValue;
    }
  }

  return value;
};

export const entityDetailSanitizer = (e, type, name) => {
  let value = e.value;

  if (type == 'date') {
    const date = verifyDateAfter1800(moment(e).format('YYYY-MM-DD')) ? moment(e).format('YYYY-MM-DD') : e;
    value = date;
  }

  if (name === 'comm_pincode' || name === 'reg_addr_pincode') {
    if (value?.length >= 6) {
      value = value.substring(0, 6);
    }
  } else if (name === 'comm_addr_ln1' || name === 'reg_addr_ln1') {
    if (value?.length >= 40) {
      value = value.substring(0, 40);
    }
  }

  return value;
};

export const coApplicantSanitizer = (e, type, name) => {
  let value = e.value;

  if (type == 'date') {
    const date = verifyDateAfter1800(moment(e).format('YYYY-MM-DD')) ? moment(e).format('YYYY-MM-DD') : e;
    value = date;
  }

  if (name === 'cb_pan') {
    value = value.toUpperCase();
    if (value?.length >= 10) {
      value = value.substring(0, 10);
    }
  } else if (name === 'cb_aadhaar') {
    if (value && isNaN(value[value.length - 1])) {
      value = value.substring(0, value.length - 1);
    } else if (value?.length >= 12) {
      value = value.substring(0, 12);
    }
  } else if (name === 'cb_mobile') {
    if (value?.length >= 10) {
      value = value.substring(0, 10);
    }
  } else if (name === 'cb_pincode' || name === 'cb_per_pincode') {
    if (value?.length >= 6) {
      value = value.substring(0, 6);
    }
  } else if (name === 'cb_resi_addr_ln1' || name === 'cb_per_addr_ln1') {
    if (value?.length >= 40) {
      value = value.substring(0, 40);
    }
  }

  return value;
};

export const guarantorSanitizer = (e, type, name) => {
  let value = e.value;

  if (type == 'date') {
    const date = verifyDateAfter1800(moment(e).format('YYYY-MM-DD')) ? moment(e).format('YYYY-MM-DD') : e;
    value = date;
  }

  if (name === 'gua_pan') {
    value = value.toUpperCase();
    if (value?.length >= 10) {
      value = value.substring(0, 10);
    }
  } else if (name === 'gua_aadhaar') {
    if (value && isNaN(value[value.length - 1])) {
      value = value.substring(0, value.length - 1);
    } else if (value?.length >= 12) {
      value = value.substring(0, 12);
    }
  } else if (name === 'gua_mobile') {
    if (value?.length >= 10) {
      value = value.substring(0, 10);
    }
  } else if (name === 'gua_pincode' || name === 'gua_per_pincode') {
    if (value?.length >= 6) {
      value = value.substring(0, 6);
    }
  } else if (name === 'gua_resi_addr_ln1' || name === 'gua_per_addr_ln1') {
    if (value?.length >= 40) {
      value = value.substring(0, 40);
    }
  }

  return value;
};
