const getDate = (initialDate: Date) => {
  const date = new Date(initialDate);

  const currentDate = new Date().getTime();

  const timeDifference = currentDate - date.getTime();

  const oneHourInMillis = 60 * 60 * 1000;

  const oneDayInMillis = 24 * oneHourInMillis;

  if (timeDifference <= 3600000) {
    const minutes = Math.floor(timeDifference / (60 * 1000));
    return `${minutes} min. ago`;
  } else if (timeDifference <= oneDayInMillis) {
    const hours = Math.floor(timeDifference / oneHourInMillis);
    return `${hours} hours ago`;
  }
};

export default getDate;
