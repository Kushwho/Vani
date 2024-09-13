export function replaceSpacesWithHyphens(inputString) {
  return inputString.replace(/ /g, "-");
}

export function replaceHyphensWithSpaces(inputString) {
  return inputString.replace(/-/g, " ");
}
