import { f } from "dropzone";
import jwt from "jsonwebtoken";

const { jsPDF } = require("jspdf");
import * as xlsx from "xlsx";
import moment from "moment";

export const verifyDateAfter1800 = value => {
  const dateAfter1800 = /\b(19|[2-9][0-9])\d{2}-([0|1])\d-([0-3])\d\b/;
  return dateAfter1800.test(value);
};
// function that returns true if value is email, false otherwise
export const verifyEmail = value => {
  const emailRex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRex.test(value);
};
// function that verifies if a string has a given length or not
export const verifyLength = (value, length) => {
  return value.length === length;
};

// function that verifies if value contains only numbers
export const verifyNumber = value => {
  const numberRex = new RegExp("^[0-9]+$");
  return numberRex.test(value);
};

// function that verifies if value contains -ve or +ve integer
export const verifyInteger = value => {
  const integerRex = /^[-+]?\d*$/;
  return integerRex.test(value);
};

export const verifyFloat = value => {
  const floatRex = /^(?:\d*\.\d{1,2}|\d+)$/;
  return floatRex.test(value);
};

export const verifyAlphaNum = value => {
  const alphanumRex = /^[a-zA-Z0-9]{1,50}$/;
  return alphanumRex.test(value);
};

export const verifyLoanKey = value => {
  const loanKeyRex = new RegExp("^[a-z0-9]{3}$");
  return loanKeyRex.test(value);
};
export const verifyProductName = value => {
  const productNameRegex = /^[a-zA-Z0-9-_]+$/;
  return productNameRegex.test(value);
};

export const verifyPincode = value => {
  const pinRex = new RegExp("^[0-9]{6}$");
  return pinRex.test(value);
};

export const verifyPhone = value => {
  const phoneRex = new RegExp("^[0-9]{10}$");
  return phoneRex.test(value);
};

export const verifyMobile = value => {
  const mobileRex = new RegExp("^[0-9]{10}$");
  return mobileRex.test(value);
};

export const verifyIfsc = value => {
  const ifscRex = new RegExp("^[A-Za-z]{4}[a-zA-Z0-9]{7}$");
  return ifscRex.test(value);
};
export const verifyNewIfsc = value => {
  const ifscRexNew = new RegExp("^([A-Z]){4}([0-9]){1}([0-9A-Z]){6}$");
  return ifscRexNew.test(value);
};

export const verifyCIN = value => {
  const cinRex = new RegExp("^[a-zA-Z0-9]{21}$");
  return cinRex.test(value);
};

export const verifySubvention = value => {
  const SubventionRex = /^(UA|UP)$/;
  return SubventionRex.test(value);
};
export const verifyName = value => {
  const nameRex = new RegExp("^[-_ a-zA-Z0-9]{1,150}$");
  return nameRex.test(value);
};

export const verifyAlphaNeumericName = value => {
  const nameRex = new RegExp("^[a-zA-Z0-9 _ -]{3,150}$");
  return nameRex.test(value);
};

export const verifyAddress = value => {
  const nameRex = new RegExp("^[-_ . , @ a-zA-Z0-9]{10,150}$");
  return nameRex.test(value);
};

export const verifyAlpha = value => {
  const alphaRex = new RegExp("^[ A-Za-z]{1,250}$");
  return alphaRex.test(value);
};

export const verifyTIN = value => {
  const tinRex = new RegExp("^[0-9]{11}$");
  return tinRex.test(value);
};

export const verifyState = value => {
  const stateRex = new RegExp("^[ A-Za-z]{2,30}$");
  return stateRex.test(value);
};

export const verifyPan = value => {
  const panRex = new RegExp("^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$");
  return panRex.test(value);
};

export const verifyDate = value => {
  const date = /^(\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$)/;
  return date.test(value);
};

export const verifyString = value => {
  const string = new RegExp("[-_ a-zA-Z0-9]{1,250}");
  return string.test(value);
};

export const VerifyBool = value => {
  const string = /^(true|false)$/;
  return string.test(value);
};

// verifies if value is a valid URL
export const verifyUrl = value => {
  try {
    new URL(value);
    return true;
  } catch (_) {
    return false;
  }
};

export const verifyGSTIN = value => {
  const gstinRex = new RegExp(
    "^([0][1-9]|[1-2][0-9]|[3][0-8]|[9][79])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$"
  );
  return gstinRex.test(value);
};

export const compareDates = (date1, date2) => {
  for (let i = 0; i < Math.max(date1.length, date2.length); i++) {
    if (date1[i] > date2[i]) return 1;
    else if (date1[i] < date2[i]) return -1;
    else if (!date1[i] && date2[i]) return -1;
    else if (date1[i] && !date2[i]) return 1;
  }
  return 0;
};

export const sortByKey = (array, key) => {
  return array.sort((a, b) => {
    var x = a[key];
    var y = b[key];
    return x < y ? -1 : x > y ? 1 : 0;
  });
};

export const verifyAlphaNeumeric = value => {
  const alphaRex = new RegExp("^[a-zA-Z0-9]*$");
  return alphaRex.test(value);
};

export const monthDateFormat = date => {
  var months = [
    "Jan.",
    "Feb.",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec."
  ];
  var ar = date.split("-");
  return `${months[ar[1] - 1]} Y${ar[0].substring(2)}`;
};

export const dayDateFormat = date => {
  var months = [
    "Jan.",
    "Feb.",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec."
  ];
  var ar = date.split("-");
  return `${ar[2]} ${months[ar[1] - 1]}`;
};

export const generateRandomColor = () => {
  var x = Math.floor(Math.random() * 256);
  var y = Math.floor(Math.random() * 256);
  var z = Math.floor(Math.random() * 256);
  var o = Math.random() * (0.8 - 0.5) + 0.5;
  var RGBColor = "rgb(" + x + "," + y + "," + z + "," + o + ")";
  return RGBColor;
};

export const VerifyPenalInterest = value => {
  const string = /^(\d{1,8})(.\d{1,4})?(UP|UA|RA|RP)$/;
  return string.test(value);
};

export const stepSizeFunction = value => {
  var stepSize = parseInt(value / 10);
  const stepSizeCount = stepSize.toString().length;
  var stepRatio = parseInt(
    Math.ceil(stepSize / Math.pow(10, stepSizeCount - 1))
  );
  return Math.pow(10, stepSizeCount - 1) * (stepSize > 0 ? stepRatio : 1);
};

export const VerifyUpfront = value => {
  const string = /^(\d{1,8})(.\d{1,4})?(UP|UA)$/;
  return string.test(value);
};

export const VerifyRear = value => {
  const string = /^(\d{1,8})(.\d{1,4})?(RA|RP)$/;
  return string.test(value);
};

export const VerifyRearV2 = value => {
  const string = /^(\d{1,8})(.\d{1,2})?(RA|RP)$/;
  return string.test(value);
};

export const VerifyInterest = value => {
  const string = /^(\d{1,8})(.\d{1,4})?(A|P)$/;
  return string.test(value);
};
export const VerifyCkycNumber = value => {
  const string = new RegExp("^[0-9]{14}$");
  return string.test(value);
};

export const isValidUrl = urlString => {
  var urlPattern =
    /^(https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  return urlPattern.test(urlString);
};

export const b64ToBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i += 1) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, {
    type: contentType
  });
  return blob;
};

export const convertImagesToPdf = file => {
  try {
    const A4_PAPER_DIMENSIONS = {
      width: 210,
      height: 297
    };

    const A4_PAPER_RATIO =
      A4_PAPER_DIMENSIONS.width / A4_PAPER_DIMENSIONS.height;

    const imageDimensionsOnA4 = dimensions => {
      const isLandscapeImage = dimensions.width >= dimensions.height;
      if (isLandscapeImage) {
        return {
          width: A4_PAPER_DIMENSIONS.width,
          height:
            A4_PAPER_DIMENSIONS.width / (dimensions.width / dimensions.height)
        };
      }

      const imageRatio = dimensions.width / dimensions.height;
      if (imageRatio > A4_PAPER_RATIO) {
        const imageScaleFactor =
          (A4_PAPER_RATIO * dimensions.height) / dimensions.width;
        const scaledImageHeight = A4_PAPER_DIMENSIONS.height * imageScaleFactor;
        return {
          height: scaledImageHeight,
          width: scaledImageHeight * imageRatio
        };
      }

      return {
        width:
          A4_PAPER_DIMENSIONS.height / (dimensions.height / dimensions.width),
        height: A4_PAPER_DIMENSIONS.height
      };
    };

    /**
     *
     * @param {ARRAY} images - check the formats here => http://raw.githack.com/MrRio/jsPDF/master/docs/module-addImage.html#~addImage
     * @param {STRING} output_method - check the formats here => http://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html#output
     * @param {Boolean} save - would you like to save the pdf?
     * @param {STRING} pdfname - if you want to save the pdf then what is it's name
     * @returns output
     */

    const generatePdfFromImages = (images, output_method, save, pdfname) => {
      const doc = new jsPDF("p", "pt", "a4", true);
      doc.deletePage(1);
      images.forEach(image => {
        const imageDimensions = imageDimensionsOnA4({
          width: image.width,
          height: image.height
        });

        doc.addPage();
        doc.addImage(image.src, image.imageType, 20, 20, 550, 550);
      });

      if (save) {
        doc.save(`${pdfname}.pdf`);
      }

      window.open(doc.output("bloburl"), "_blank");
      var out = doc.output();
      var url = "data:application/pdf;base64," + btoa(out);
      return url;
    };

    const arrayOfImages = [
      {
        src: file,
        height: "1000",
        imageType: "jpeg",
        width: "1000"
      }
    ];

    return generatePdfFromImages(
      arrayOfImages,
      "datauristring",
      false,
      Date.now()
    );
  } catch (error) {
    return error;
  }
};

export const convertTextFileToPdf = file => {
  try {
    let textpdf = file;
    const doc = new jsPDF("p", "mm", "a4");
    doc?.setFont("courier");
    doc?.setFontSize(14);

    var lMargin = 15; //left margin in mm
    var rMargin = 15; //right margin in mm
    var pdfInMM = 210; // width of A4 in mm

    var lines = doc.splitTextToSize(textpdf, pdfInMM - lMargin - rMargin);
    const pages = lines.length / 40;
    doc.text(lMargin, 20, lines);
    var out = doc.output();
    var url = "data:application/pdf;base64," + btoa(out);
    return url;
  } catch (error) {
    return error;
  }
};

export const downloadDataInXLSXFormat = (key, data) => {
  try {
    const newWB = xlsx.utils.book_new();
    const newWS = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(newWB, newWS, "File");
    xlsx.writeFile(newWB, key);
  } catch (error) {
  }
};

export const downloadGenericReports = (response, name, type) => {
  try {
    const encodedStr = encodeURIComponent(response);
    const uint8Array = new Uint8Array(encodedStr.length);
    for (let i = 0; i < encodedStr.length; i++) {
      uint8Array[i] = encodedStr.charCodeAt(i);
    }
    const newBuffer = new ArrayBuffer(uint8Array.length);
    const newUint8Array = new Uint8Array(newBuffer);
    newUint8Array.set(uint8Array);
    const buffer = Buffer.from(response);
    const arrayBuffer = buffer.buffer;
    const fileName = name;
    const blob = new Blob([arrayBuffer], { type: type });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
  }
};

export const downloadMonthlyReportDataInXLSXFormat = (key, data) => {
  try {
    const newWB = xlsx.utils.book_new();
    const newWS = xlsx.utils.json_to_sheet(data, { skipHeader: true });
    xlsx.utils.book_append_sheet(newWB, newWS, "File");
    xlsx.writeFile(newWB, key);
  } catch (error) {
  }
};

export const positiveNumbers = value => {
  return Number(value) >= 0;
};

export const enumFunction = enumValues => {
  var ar = [];
  for (var i = 0; i < enumValues.length; i++) {
    ar.push({
      value: enumValues[i],
      label: enumValues[i]
    });
  }

  return ar;
};

export const statusToDisplay = {
  open: "Open",
  batch: "Batch",
  manual: "Incomplete KYC",
  kyc_data_approved: "KYC Data Approved",
  credit_approved: "Credit Approved",
  co_lender_approval_pending: "Co-Lender Approval Pending",
  disbursal_approved: "Disbursement Approved",
  disbursal_pending: "Pending Disbursal",
  disbursement_initiated: "Disbursement Initiated",
  disbursed: "Active",
  new: "New",
  logged: "Logged",
  rejected: "Rejected",
  cancelled: "Cancelled",
  active: "Active",
  line_in_use: "Line in use",
  expired: "Expired",
  0: "Not processed",
  1: "Processed",
  9: "Error",
  Not_Match: "Not Match",
  Probable: "Probable",
  Confirmed: "Confirmed",
  Error: "Error"
};

export const loanStatusList = [
  {
    label: "Open",
    value: "open"
  },
  {
    label: "Batch",
    value: "batch"
  },
  {
    label: "Manual KYC",
    value: "manual"
  },
  {
    label: "KYC Data Approved",
    value: "kyc_data_approved"
  },
  {
    label: "Credit Approved",
    value: "credit_approved"
  },
  {
    label: "Co-Lender Approval Pending",
    value: "co_lender_approval_pending"
  },
  {
    label: "Pending Disbursal",
    value: "disbursal_pending"
  },
  {
    label: "Disbursement Approved",
    value: "disbursal_approved"
  },
  {
    label: "Disbursement Initiated",
    value: "disbursement_initiated"
  },
  {
    label: "Active",
    value: "disbursed"
  },
  {
    label: "Rejected",
    value: "rejected"
  },
  {
    label: "Cancelled",
    value: "cancelled"
  },
  {
    label: "Line in use",
    value: "line_in_use"
  },
  {
    label: "Expired",
    value: "expired"
  },
  {
    label: "Foreclosed",
    value: "foreclosed"
  }
];

export const statusToDisplayed = {
  new: "New",
  approved: "Approved",
  rejected: "Rejected",
  manual: "Manual"
};
export const leadStatusListed = [
  {
    label: "New",
    value: "new"
  },
  {
    label: "Approved",
    value: "approved"
  },
  {
    label: "Rejected",
    value: "rejected"
  },
  {
    label: "Manual",
    value: "manual"
  }
];

export const refundStatusListed = [
  {
    label: "Open",
    value: "Open"
  },
  {
    label: "Rejected",
    value: "Rejected"
  },
  {
    label: "Processed",
    value: "Processed"
  }
];

/**
 * Method to find object in array of objects
 * @param {*} arrayOfObjects
 * @param {*} desiredAttribute
 * @param {*} desiredValue
 * @returns object
 */
 export const findByAttribute = (
  arrayOfObjects,
  desiredAttribute,
  desiredValue
) => {
  const object = arrayOfObjects.find(
    (obj) => obj[desiredAttribute] == desiredValue
  );
  return object;
};

/**
 * Method to set objects ket to default
 * @param {*} object
 * @returns
 */
export const setObjectKeysToDefault = (object,defaultAttribute=null) => {
  const array = Object.keys(object);
  let json = {};

  for (let element of array) {
    json[element] = defaultAttribute && object[element] && object[element][defaultAttribute]?object[element][defaultAttribute]:null
  }

  return json;
};

/**
 * Method to convert given string to camel case
 * @param {*} str
 * @returns
 */
export const toCamel = (inputString,isFirstLetterCapital=false) => {
  return inputString.replace(/_/g, ' ')
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 && !isFirstLetterCapital ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, ' ')
    .trim();
};

export const keyValuePairs = (arrayOfObjects,key) => {
  return arrayOfObjects.reduce((accumulator, item) => {
    accumulator[item[key]] = item;
    return accumulator;
  }, {});
};

