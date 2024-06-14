import carritoLocalStorage from "./carritoLocalStorage.js";

//-----------------------------------------------------
//             Variables globales
//-----------------------------------------------------
let carrito = [];

const get = (id) => {
  carrito = carritoLocalStorage.leer();
  return carrito.find((p) => p.id == id);
};
const clear = (_) => {
  carrito = [];
  carritoLocalStorage.guardar(carrito);
};

const getAll = (_) => {
  carrito = carritoLocalStorage.leer();
  return carrito;
};

const guardar = (prod) => {
  carrito.push(prod);
  carritoLocalStorage.guardar(carrito);
};

const actualizar = (id, prod) => {
  const index = carrito.findIndex((p) => p.id == id);
  carrito.splice(index, 1, prod);
  carritoLocalStorage.guardar(carrito);
};

const eliminar = (id) => {
  const index = carrito.findIndex((p) => p.id == id);
  carrito.splice(index, 1);
  carritoLocalStorage.guardar(carrito);
};

// -------------------------------------------
//               Exportación
// -------------------------------------------
export default {
  get,
  clear,
  getAll,
  guardar,
  actualizar,
  eliminar,
};
