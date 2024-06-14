const url = "https://6626b1c8b625bf088c06655f.mockapi.io/api/carrito/";

const enviar = async (pedido) =>
  await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(pedido),
  }).then((r) => r.json());

// -------------------------------------------
//               Exportación
// -------------------------------------------
export default {
  enviar,
};
