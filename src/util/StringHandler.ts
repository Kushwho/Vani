export function replaceSpacesWithHyphens(inputString:string) {
  return inputString.replace(/ /g, "-");
}

export function replaceHyphensWithSpaces(inputString:string) {
  return inputString.replace(/-/g, " ");
}
