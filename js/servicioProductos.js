const url = "https://6626b1c8b625bf088c06655f.mockapi.io/api/productos/";

const getAll = async (_) => await fetch(url).then((r) => r.json());

const guardar = async (prod) =>
  await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(prod),
  }).then((r) => r.json());

const actualizar = async (id, prod) =>
  await fetch(url + id, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(prod),
  }).then((r) => r.json());

const eliminar = async (id) =>
  await fetch(url + id, {
    method: "DELETE",
  }).then((r) => r.json());

// -------------------------------------------
//               Exportación
// -------------------------------------------
export default {
  getAll,
  guardar,
  actualizar,
  eliminar,
};
