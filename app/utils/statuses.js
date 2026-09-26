export const toneForBadge = (status) => {
  switch (status) {
    case "UNTRANSLATED":
      return "info";
    case "PARTIALLY_TRANSLATED":
      return "caution";
    case "TRANSLATED":
      return "success";
    case "NOT_STARTED":
      return "critical";
    default:
      return "info";
  }
};

export const humanReadableStatus = (status) => {
  switch (status) {
    case "UNTRANSLATED":
      return "Untranslated";
    case "PARTIALLY_TRANSLATED":
      return "Partially translated";
    case "TRANSLATED":
      return "Translated";
    case "NOT_STARTED":
      return "Not started";
    default:
      return "Unknown";
  }
};
