export const formatWallTime = (duration: Duration): string => {
  if (duration.years && duration.years > 0) {
    return `${duration.years} years`;
  } else if (duration.months && duration.months > 0) {
    return `${duration.months} months`;
  } else if (duration.weeks && duration.weeks > 0) {
    return `${duration.weeks} weeks`;
  } else if (duration.days && duration.days > 0) {
    return `${duration.days} days`;
  } else if (duration.hours && duration.hours > 0) {
    return `${duration.hours} hours`;
  } else if (duration.minutes && duration.minutes > 0) {
    return `${duration.minutes} minutes`;
  } else {
    return `${duration.seconds ?? 0} seconds`;
  }
};
