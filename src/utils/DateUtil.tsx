export const dateFrom = (dateString: string) => {
  // Safari's JS cannot parse dates with "-", so change them to "/":
  return new Date(dateString.replace(/-/g, "/"))
}
