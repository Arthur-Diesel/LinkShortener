export function formatExcluded(excluded: string) {
  let excludedFormatted;
  if (excluded === "true") {
    excludedFormatted = true;
  } else if (excluded === "false") {
    excludedFormatted = false;
  }

  return excludedFormatted;
}
