// Fonction pour convertir les fichiers en base64
const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

// Exporter fonction
module.exports = convertToBase64;
