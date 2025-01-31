export const seaStormColors = {
  // Base colors from palette
  blue: {
    light: "#465B65",
    medium: "#344B56",
    dark: "#233C47",
  },
  teal: {
    light: "#5B8B84",
    medium: "#4A7A73",
    dark: "#396A62",
  },
  sand: {
    light: "#F5F2F2",
    medium: "#D5CCCC",
    dark: "#C4B5B5",
    darker: "#B39E9E",
  },

  // UI Specific
  background: "#F5F2F2", // Puedes referenciar `sand.light` en lugar de repetir el valor
  cardBg: "#FFFFFF",
  text: "#233C47",
  border: "#D5CCCC",

  // Status Colors
  status: {
    optimal: "#4A7A73", // teal.medium
    warning: "#B39E9E", // sand.darker
    critical: "#8B6F6F", // Ahora está dentro del esquema de colores
  },
}

// Uso de un objeto en lugar de switch-case
export const getStatusColor = (status: "optimal" | "warning" | "critical") =>
  seaStormColors.status[status] || seaStormColors.blue.medium
