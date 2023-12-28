export const validateData = (type, value) => {
  switch (type) {
    case "name": {
      const name = /^[a-zA-Z]{1,50}$/;
      return name.test(value);
    }
    case "fullname": {
      const name = /^[a-zA-Z ]{1,150}$/;
      return name.test(value);
    }
    case "title": {
      const name = /^[A-Za-z0-9-@*#._+ ]{1,50}$/;
      return name.test(value);
    }
    case "description": {
      const name = /^[A-Za-z0-9-@,*#._+? ]{1,250}$/;
      return name.test(value);
    }
    case "string": {
      const string = /^.{1,250}$/;
      return string.test(value);
    }
    case "enum": {
      const string = /^.{1,250}$/;
      return string.test(value);
    }
    case "pincode": {
      const pincode = /^(\d{6})$/;
      return pincode.test(value);
    }
    case "ifsc": {
      const ifsc = /^[A-Z]{4}[0]{1}[a-zA-Z0-9]{6}$/;
      return ifsc.test(value);
    }
    case "mobile": {
      const mobile = /^(\d{10})$/;
      return mobile.test(value);
    }
    case "phone": {
      const phone = /^(\d{11})$/;
      return phone.test(value);
    }
    case "pan": {
      const pan =
        /^([A-Z]){3}([ABCFGHLJPTE]){1}([A-Z]){1}([0-9]){4}([A-Z]){1}?$/;
      return pan.test(value);
    }
    case "email": {
      const email =
        /^([a-z0-9]+(?:[._-][a-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})$/i;
      return email.test(value);
    }
    case "aadhaar": {
      const aadhaar = /(^.{8}[0-9]{4})$/;
      return aadhaar.test(value);
    }
    case "date": {
      const date = /^(\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$)/;
      return date.test(value);
    }
    case "dob": {
      const dob = /^(\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$)/;
      return dob.test(value);
    }
    case "float": {
      const float = /^(?:\d*\.\d{1,2}|\d+)$/;
      return float.test(value);
    }
    case "floatEmpty" : {
      const floatEmpty = /^(?:\d*\.\d{1,2}|\d+|)$/;      ;
      return floatEmpty.test(value);
    }
    case "passport": {
      const passport = /^[A-Z][0-9]{7}$/;
      return passport.test(value);
    }
    case "number": {
      const number = /^[0-9.]/;
      return number.test(value);
    }
    case "integer": {
      const integer = /^[-+]?\d*$/;
      return integer.test(value);
    }
    case "gst": {
      const gst =
        /^([0][1-9]|[1-2][0-9]|[3][0-8]|[9][79])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/;
      return gst.test(value);
    }
    case "driving": {
      const driving = /^([A-Z]{2}[0-9]{2}\s[0-9]{11})+$/;
      return driving.test(value);
    }
    case "alphanum": {
      const alphanum = /^[a-zA-Z0-9]{1,50}$/;
      return alphanum.test(value);
    }
    case "alphanumEmpty": {
      const alphanum = /^$|^[a-zA-Z0-9]{1,50}$/;
      return alphanum.test(value);
    }
    case "invoiceNumber": {
      const alphanum = /^$|^[a-zA-Z0-9 _ -.]{1,50}$/;
      return alphanum.test(value);
    }

    case "epic": {
      const epic = /^([a-zA-Z]){3}([0-9]){7}?$/;
      return epic.test(value);
    }
    case "ack": {
      const ack = /^([0-9]){15}$/;
      return ack.test(value);
    }
    case "uan": {
      const uan = /^\d{12}$/;
      return uan.test(value);
    }
    case "vpa": {
      const vpa = /^\w+.\w+@\w+$/;
      return vpa.test(value);
    }
    case "twodigit": {
      const twodigit = /^\d{2}$/;
      return twodigit.test(value);
    }
    case "alpha": {
      const alpha = /^[A-Za-z\s]{1,250}$/;
      return alpha.test(value);
    }
    case "alphaExtra": {
      const alpha = /^$|^[A-Za-z\s]{4,250}$/;
      return alpha.test(value);
    }
    case "singleAlpha": {
      const singleAlpha = /^[A-Z\s]{1}$/;
      return singleAlpha.test(value);
    }
    case "consent": {
      const consent = /^\w{1}$/;
      return consent.test(value);
    }
    case "consumerid": {
      const consumerid = /^\d{12}/;
      return consumerid.test(value);
    }
    case "timestamp": {
      const timestamp = /^(\d{10})$/;
      return timestamp.test(value);
    }
    case "txntype": {
      const txntype =
        /^(overdue|interest|pf|usage|repayment|manage|emi|bounce*)$/;
      return txntype.test(value);
    }
    case "bounce": {
      const bounce = /^(bounce*)$/;
      return bounce.test(value);
    }
    case "emi": {
      const emi = /^(emi*)$/;
      return emi.test(value);
    }
    case "manage": {
      const manage = /^(manage*)$/;
      return manage.test(value);
    }
    case "repayment": {
      const repayment = /^(repayment*)$/;
      return repayment.test(value);
    }
    case "usage": {
      const usage = /^(usage*)$/;
      return usage.test(value);
    }
    case "pf": {
      const pf = /^(pf*)$/;
      return pf.test(value);
    }
    case "interest": {
      const interest = /^(\d{1,8})(.\d{1,4})?(A|P)$/;
      return interest.test(value);
    }
    case "overdue": {
      const overdue = /^(overdue*)$/;
      return overdue.test(value);
    }
    case "txnentry": {
      const txnentry = /^(cr|dr*)$/;
      return txnentry.test(value);
    }
    case "usageTxnentry": {
      const dr = /^(dr*)$/;
      return dr.test(value);
    }
    case "repayTxnentry": {
      const cr = /^(cr*)$/;
      return cr.test(value);
    }
    case "decimalUARAUPRP": {
      const decimalUARAUPRP = /^(\d{1,8})(.\d{1,4})?(UA|RA|UP|RP)$/;
      return decimalUARAUPRP.test(value);
    }
    case "decimalRARP": {
      const decimalRARP = /^(\d{1,8})(.\d{1,4})?(RA|RP)$/;
      return decimalRARP.test(value);
    }
    case "decimalUAUP": {
      const decimalUAUP = /^(\d{1,8})(.\d{1,4})?(UA|UP)$/;
      return decimalUAUP.test(value);
    }
    case "decimalAP": {
      const decimalAP = /^(\d{1,8})(.\d{1,4})?(A|P)$/;
      return decimalAP.test(value);
    }
    case "duesArray": {
      return value.length;
    }
    case "pattern": {
      const pattern =
        /^(ONETIME|MONTHLY|WEEKLY|DAILY|QUARTERLY|BI-MONTHLY|FORTNIGHTLY|HALFYEARLY|YEARLY|ASPRESENTED)$/;
      return pattern.test(value);
    }
    case "boolean": {
      const boolean = /^(true|false)$/;
      return boolean.test(value);
    }
    case "alphaNeumeric": {
      const name = /^[a-zA-Z0-9 _ -]{3,150}$/;
      return name.test(value);
    }
    case "alphaNeumericExtra": {
      const name = /^$|^[a-zA-Z0-9 _ -.]{3,150}$/;
      return name.test(value);
    }
    case "ckycnumber": {
      const string = /^([0-9]){14}$/;
      return string.test(value);
    }
    case "website": {
      const website =
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
      return website.test(value);
    }
    case "+vefloat2d": {
      const positivefloat = /^$|^([0-9]+(?:[\.][0-9]{0,2})?)$/;
      return positivefloat.test(value);
    }

    case "upto500": {
      const alloclimit =
        /^$|^(5000000000|5000000000\.00|5000000000\.0|0\.00|[0-4]\d{9}\.\d{1,2}|[0-4]\d{9}|[0-9]\d{0,8}\.\d{1,2}|[0-9]\d{0,8})$/;
      return alloclimit.test(value);
    }

    case "upto20": {
      const Pricing =
        /^$|^([0-1]?[0-9](?:[\.][0-9]{0,2})?)$|^([0-2][0](?:[\.][0]{0,2})?)$/;
      return Pricing.test(value);
    }

    case "upto100": {
      const foreclosureShare = /^$|^[0-9]$|^[1-9][0-9]$|^(100)$/;
      return foreclosureShare.test(value);
    }

    case "confirmation": {
      const confirmation = /^(Y|N)$/;
      return confirmation.test(value);
    }
    case "dateTime": {
      const dateTime =
        /^(\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])\ (0[0-9]|1[0-9]|2[0123])\:([012345][0-9])\:([012345][0-9])$)/;
      return dateTime.test(value);
    }
    default: {
      return true;
    }
  }
};
