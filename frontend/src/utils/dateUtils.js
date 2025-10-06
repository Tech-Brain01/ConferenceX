export function formatDateForDisplay(dateString) {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  if (isNaN(d)) return "N/A";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function formatDateToInputValue(dateString) {
  // Converts date string to yyyy-mm-dd for input fields
  const d = new Date(dateString);
  return d.toISOString().split("T")[0];
}
