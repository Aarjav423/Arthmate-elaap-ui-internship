export const getFirstAndLastInitials = (fullName) => {
  const words = fullName.split(" ");
  if (words.length === 1) {
    return words[0][0].toUpperCase();
  } else {
    const firstLetter = words[0][0].toUpperCase();
    const lastLetter = words[words.length - 1][0].toUpperCase();
    return firstLetter + lastLetter;
  }
};

export const formatDate = (inputDate) => {
  if (!inputDate)
    return 'N/A';

  const inputDateObj = new Date(inputDate);
  const day = inputDateObj.getDate().toString().padStart(2, "0");
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    inputDateObj
  );
  const year = inputDateObj.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  // Get the hours and minutes
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  // Determine if it's AM or PM
  const amPm = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  const formattedTime = `${(hours % 12) || 12}:${minutes} ${amPm}`;

  // Combine date and time
  const formattedDate = `${day}-${month}-${year} | ${formattedTime}`;

  return formattedDate;
};



export const getDateInFormate = (dateTime) => {
  const dbDate = new Date(dateTime);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract day, month, and year from the Date object
  const day = dbDate.getDate();
  const month = monthNames[dbDate.getMonth()];
  const year = dbDate.getFullYear();

  // Create the formatted date string
  const formattedDate = `${day} ${month} ${year}`;
  return formattedDate;
}

export const convertIntoINR = (amount, fractionDigits) => {

  if (fractionDigits == null || fractionDigits == undefined) {
    fractionDigits = 2;
  }

  const amountAsFloat = parseFloat(amount);

  if (!Number.isNaN(amountAsFloat)) {
    const amountInINR = amountAsFloat.toLocaleString('en-IN', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
    return amountInINR;
  } else {
    return amount;
  }
}

export const stringEllipsis = (text, count) => {
  if (text.length <= count) {
    return text
  }
  const newText = text.slice(0, count) + "...";
  return newText
}

// function to handle $numberDecimal format
export const convertToFloat = (value) => {
  if (typeof value === "object" && value.hasOwnProperty("$numberDecimal")) {
    return parseFloat(value.$numberDecimal);
  }
  return parseFloat(value) || 0;
};

export const snakeCaseToLetterCase = (inputString) => {
  return inputString.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export const base64ToBlob = (b64Data, contentType = "", sliceSize = 512) => {
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

export const downloadFile = (hyperLink,name)=>{
    const link = document.createElement('a');
    link.href = hyperLink; // Replace with your file's actual path
    link.download = name; // Specify the file name
    link.click();
}