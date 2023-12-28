import { LeadMapping } from '../../msme/config/LeadStatus';
import { toCamel } from 'util/helper';
import { validateData } from '../validation';
import { bookLoansFormJsonFields } from '../../msme/views/bookLoans/bookLoansFormJson';

/**
 * Method to convert given camel case to snake case
 * @param {*} inputString
 * @returns
 */
export const toSnakeCase = (inputString) => {
  return inputString.toLowerCase().replace(/\s+/g, '_').trim();
};

/**
 *
 * @param {*} obj
 * @returns
 */
export const deepCopy = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    const newArray = [];
    for (let i = 0; i < obj.length; i++) {
      newArray[i] = deepCopy(obj[i]);
    }
    return newArray;
  }

  const newObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepCopy(obj[key]);
    }
  }

  return newObj;
};

/**
 *
 * @param {*} obj
 * @param {*} headHtml
 * @param {*} bodyHtml
 * @returns
 */
export const convertDataIntoAccordionData = (obj, headHtml, bodyHtml, rowTitles = [], formatValues = {}, statusCheck = {}, bottomComponents = {}, subAccordions = [], currentTitle = null) => {
  return Object.entries(obj).map(([key, value]) => {
    if (typeof value === 'object' && value) {
      return {
        title: key ? toCamel(key, true) : key,
        rightComponent: statusCheck[key] ? statusCheck[key] : null,
        bottomComponent: bottomComponents[key] ? bottomComponents[key] : null,
        subType: subAccordions.includes(key) ? 'accordion' : null,
        raw_title: key,
        data: convertDataIntoAccordionData(value, headHtml, bodyHtml, rowTitles, formatValues, statusCheck, bottomComponents, subAccordions, key),
      };
    } else {
      return {
        head: headHtml ? headHtml(toCamel(key, true)) : toCamel(key, true),
        body: formatValues[currentTitle] ? formatValues[currentTitle](value, key) : bodyHtml ? bodyHtml(value) : value ? value : 'N/A',
        type: rowTitles && rowTitles.includes(currentTitle) ? 'row' : 'column',
      };
    }
  });
};

/**
 * Method to remove _ and capitalize each word
 * @param {*} inputString
 * @returns
 */
export const formatTitle = (inputString) => {
  return inputString
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Method to format date
 * @param {*} timestamp
 * @returns
 */
export const formatDateTime = (timestamp) => {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const formattedDate = new Date(timestamp).toLocaleDateString('en-US', options);
  const [month, day, year] = formattedDate.split('/');

  return `${day}-${month}-${year}`;
};

/**
 *
 * @param {*} obj
 * @returns
 */
export const inverseJson = (obj) => {
  var retobj = {};
  for (var key in obj) {
    retobj[obj[key]] = key;
  }
  return retobj;
};

/**
 *
 * @param {*} array
 * @returns
 */
export const formatLeadStatus = (array) => {
  let json = {};
  for (let data of array) {
    json = {
      ...json,
      [LeadMapping[data.section_sequence_no]]: data.section_status,
    };
  }

  return json;
};

export const formatLeadSectionObject = (array) => {
  let json = {};
  for (let data of array) {
    json = {
      ...json,
      [LeadMapping[data.section_sequence_no]]: data,
    };
  }

  return json;
};

export const formatLeadRemarks = (array) => {
  let json = {};
  for (let data of array) {
    json = {
      ...json,
      [LeadMapping[data.section_sequence_no]]: data.section_remarks,
    };
  }

  return json;
};
/**
 *
 * @param {*} array
 * @returns
 */
export const formatSubSectionLeadStatus = (array) => {
  let subSectionStatus = {};
  for (let leadSection of array) {
    subSectionStatus[leadSection.section_sequence_no] = {};
    if (leadSection['subsections']) {
      for (let subSection of leadSection['subsections']) {
        subSectionStatus[leadSection.section_sequence_no] = {
          ...subSectionStatus[leadSection.section_sequence_no],
          [subSection.sub_section_code]: subSection.sub_section_status,
        };
      }
    }
  }

  return subSectionStatus;
};

const fetchInnerSectionName = (innerSectionName) => {
  let name = innerSectionName;

  if (innerSectionName == 'FINANCIAL_STATEMENT_1') {
    name = calculateFinancialYear(innerSectionName);
  } else if (innerSectionName == 'FINANCIAL_STATEMENT_2') {
    name = calculateFinancialYear(innerSectionName);
  } else if (innerSectionName == 'FINANCIAL_STATEMENT_3') {
    name = calculateFinancialYear(innerSectionName);
  }

  return name;
};

function calculateFinancialYear(name) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  let startYear, endYear;

  switch (name) {
    case 'FINANCIAL_STATEMENT_1':
      startYear = currentMonth > 2 ? currentYear : currentYear - 1;
      endYear = startYear + 1;
      break;

    case 'FINANCIAL_STATEMENT_2':
      startYear = currentMonth > 2 ? currentYear - 1 : currentYear - 2;
      endYear = currentMonth > 2 ? currentYear : currentYear - 1;
      break;

    case 'FINANCIAL_STATEMENT_3':
      startYear = currentMonth > 2 ? currentYear - 2 : currentYear - 3;
      endYear = currentMonth > 2 ? currentYear - 1 : currentYear - 2;
      break;

    default:
      return 'N/a';
  }

  return `${startYear}-${endYear}`;
}

export const formatLeadSectionValidationStatusAndRemarks = (leadSection) => {
  let subSectionStatus = {};
  if (leadSection['subsections']) {
    for (let subSection of leadSection['subsections']) {
      if (subSection['validation_checklist']) {
        for (let innerSection of subSection['validation_checklist']) {
          let innerSectionName = fetchInnerSectionName(innerSection.validation_name);
          subSectionStatus = {
            ...subSectionStatus,
            [innerSectionName]: {
              status: innerSection.validation_status == 'deviation' ? 'in_review' : innerSection.validation_status,
              remarks: innerSection.validation_remarks,
            },
          };
        }
      }
    }
  }

  return subSectionStatus
};

/**
 *
 * @param {*} json
 */
export const extractRegexElementFromJson = (json, pattern) => {
  // Define the regular expression pattern

  // Extract elements matching the pattern
  var matchingElements = {};
  for (var key in json) {
    if (pattern.test(key)) {
      matchingElements[key] = json[key];
    }
  }

  return matchingElements;
};

/**
 *
 * @param {*} str
 * @returns
 */
export const checkNumber = (str) => {
  const pattern = /^[\d*]+$/;
  if (str) {
    for (let i = 0; i < str.length; i++) {
      const isMatchingPattern = pattern.test(str[i]);
      if (!isMatchingPattern) {
        return false;
      }
    }
  }

  return true;
};

export const sanitizeResponse = (value) => {
  if (typeof value === 'object' && value.hasOwnProperty('$numberDecimal')) {
    return parseFloat(value.$numberDecimal).toFixed(2);
  }
  return String(value);
};

/**
 *
 * @param {*} arrayOfObjects s
 * @param {*} key
 * @returns
 */
export const keyValuePairs = (arrayOfObjects, key) => {
  return arrayOfObjects.reduce((accumulator, item) => {
    accumulator[item[key]] = item;
    return accumulator;
  }, {});
};

export const changeIntoDropdown = (arrayOfObjects, label,value) => {
  var options=[];

  for(let ob of arrayOfObjects){
    options.push({
      label: ob[label],
      value: ob[value]
    })
  }
  
  return options;
};

export const calculateAge = (birthMonth, birthDay, birthYear) => {
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  var currentMonth = currentDate.getMonth();
  var currentDay = currentDate.getDate();
  var calculatedAge = currentYear - birthYear;

  if (currentMonth < birthMonth - 1) {
    calculatedAge--;
  }
  if (birthMonth - 1 == currentMonth && currentDay < birthDay) {
    calculatedAge--;
  }
  return calculatedAge;
};

export const handleAge = (dob) => {
  const yyyyMmDdRegExp = /^\d{4}-\d{2}-\d{2}$/.test(dob);
  if (yyyyMmDdRegExp) {
    const age = calculateAge(dob.substring(5, 2), dob.substring(8, 2), dob.substring(0, 4));
    return age;
  } else {
    return -1;
  }
};

export const segregateString = (inputString) => {
  // Check if "_vl_" is present in the input string
  if (inputString.includes('_vl_')) {
    // Find the index of "_vl_" in the input string
    const index = inputString.indexOf('_vl_');
    const type = inputString.substring(0, index);
    const name = inputString.substring(index + 4);

    return { type, name };
  } else {
    return {};
  }
};

export const BOOK_LOAN_FORM_JSON = keyValuePairs(bookLoansFormJsonFields(), 'field');

/**
 *
 * @param {*} stateData
 * @returns
 */
export const handleFormComplete = (stateData) => {
  let tempValidation = {};
  for (let key in stateData) {
    const { type, name } = segregateString(key);
    if (!type || !name || BOOK_LOAN_FORM_JSON[name]['isOptional']) {
      continue;
    }

    const isValid = validateData(type, stateData[key]);

    if (!isValid) {
      tempValidation = {
        ...tempValidation,
        [key]: true,
      };
    }
  }

  return tempValidation;
};

export const toOrdinalCounting = (n) =>{
  const suffixes = ["st", "nd", "rd", "th"];
  const lastDigit = n % 10;
  const lastTwoDigits = n % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return n + suffixes[0];
  } else if (lastDigit === 2 && lastTwoDigits !== 12) {
    return n + suffixes[1];
  } else if (lastDigit === 3 && lastTwoDigits !== 13) {
    return n + suffixes[2];
  } else {
    return n + suffixes[3];
  }
}
