export const formatWallTime = (duration: Duration): string => {
  if (duration.years && duration.years > 0) {
    return `${duration.years} year${duration.years === 1 ? "" : "s"}`;
  } else if (duration.months && duration.months > 0) {
    return `${duration.months} month${duration.months === 1 ? "" : "s"}`;
  } else if (duration.weeks && duration.weeks > 0) {
    return `${duration.weeks} week${duration.weeks === 1 ? "" : "s"}`;
  } else if (duration.days && duration.days > 0) {
    return `${duration.days} day${duration.days === 1 ? "" : "s"}`;
  } else if (duration.hours && duration.hours > 0) {
    return `${duration.hours} hour${duration.hours === 1 ? "" : "s"}`;
  } else if (duration.minutes && duration.minutes > 0) {
    return `${duration.minutes} minute${duration.minutes === 1 ? "" : "s"}`;
  } else {
    return `${duration.seconds ?? 0} second${
      duration.seconds === 1 ? "" : "s"
    }`;
  }
};
