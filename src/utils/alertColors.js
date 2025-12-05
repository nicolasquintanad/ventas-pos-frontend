export const getAlertColor = (alerta) => {
  if (!alerta) return "default";

  const name = alerta.toLowerCase();

  if (name === "crítico" || name === "critico") return "red";
  if (name === "alto") return "orange";
  if (name === "medio") return "gold";
  if (name === "bajo") return "green";

  return "default";
};
