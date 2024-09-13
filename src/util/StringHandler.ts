export function replaceSpacesWithHyphens(inputString:string) {
  console.log(inputString);
  
  return inputString.replace(/ /g, "-");
}

export function replaceHyphensWithSpaces(inputString:string) {
  console.log(inputString);
  
  return inputString.replace(/-/g, " ");
}
