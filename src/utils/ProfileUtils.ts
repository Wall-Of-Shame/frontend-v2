export const isValidEmail = (email: string): boolean => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length > 7 && password.length < 73;
};

export const trimDisplayName = (name: string, count: number): string => {
  if (name.length < count + 3) {
    return name;
  } else {
    const substring = name.substring(0, count);
    const trimmed = substring.trimEnd();
    return trimmed + "...";
  }
};
