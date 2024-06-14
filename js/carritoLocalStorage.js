//-----------------------------------------------------
//             Variables globales
//-----------------------------------------------------
const guardar = (carrito) =>
  localStorage.setItem("carrito", JSON.stringify(carrito));

const leer = (_) => {
  try {
    return JSON.parse(localStorage.getItem("carrito")) || [];
  } catch {
    return [];
  }
};

// -------------------------------------------
//               Exportación
// -------------------------------------------
export default {
  guardar,
  leer,
};
