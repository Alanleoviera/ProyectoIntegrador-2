// -------------------------------------------
//               Importación
// -------------------------------------------
import carritoMem from "./carritoMem.js";
import servicioCarrito from "./servicioCarrito.js";

// -------------------------------------------
//           Variables Globales
// -------------------------------------------
let refBorrar;
let refPedir;

// -------------------------------------------
//           Funciones Globales
// -------------------------------------------
function agregar(producto) {
  const id = producto.id;
  const prodExistente = carritoMem.get(id);

  if (!prodExistente) {
    producto.cantidad = 1;
    carritoMem.guardar(producto);
    return true;
  } else {
    if (prodExistente.cantidad < prodExistente.stock) {
      prodExistente.cantidad++;
      carritoMem.actualizar(id, prodExistente);
      return true;
    }
  }
  return false;
}

function render() {
  let filasTabla;

  const carrito = carritoMem.getAll();

  if (carrito.length) {
    filasTabla = `<tr>
            <th>#</th>
            <th>nombre</th>
            <th>precio</th>
            <th>marca</th>
            <th>foto</th>
            <th>cantidad</th>
            <th>subtotal</th>
            <th>acciones</th>
        </tr>`;

    for (let i = 0; i < carrito.length; i++) {
      filasTabla += `<tr>
                <td class="centrar">${carrito[i].id}</td>
                <td>${carrito[i].nombre}</td>
                <td class="centrar">$ ${carrito[i].precio}</td>
                <td>${carrito[i].marca}</td>
                <td><img width="150" src="${
                  carrito[i].foto + "?" + (1 || Math.random())
                }" alt="foto de ${carrito[i].nombre}"></td>
                <td><span id="cant-btn">
                    ${carrito[i].cantidad}
                    </span>
                    <button id="btnDecrementar-${carrito[i].id}">-</button>
                    <button id="btnIncrementar-${carrito[i].id}">+</button>
                </td>
                <td>
                    <span id="cant-btn">$ ${eval(
                      carrito[i].precio * carrito[i].cantidad
                    )}</span>
                </td>
                <td>
                    <button id="btnBorrar-${carrito[i].id}">Borrar</button>
                </td>
            </tr>`;
    }
    refBorrar.style.display = "block";
    refPedir.style.display = "block";
  } else {
    filasTabla =
      '<h2 class="msg-error">No se encontraron pedidos para mostrar</h2>';
    refBorrar.style.display = "none";
    refPedir.style.display = "none";
  }

  document.querySelector(".carrito table").innerHTML = filasTabla;
  setListeners();
}

function borrarCarrito() {
  if (confirm(`¿Está seguro de borrar el carrito?`)) {
    // borramos el producto en el recurso local
    carritoMem.clear();
    // recargamos la vista y sus listeners con los datos nuevos
    render();
  }
}

async function generarPedido() {
  const carrito = carritoMem.getAll();
  const pedido = { pedido: carrito };

  console.log("enviar pedido:", pedido);
  await servicioCarrito.enviar(pedido);
  console.log("pedido recibido!");

  carritoMem.clear();
  render();
}

function decrementarItem(id) {
  const producto = carritoMem.get(id);
  if (producto.cantidad > 1) {
    producto.cantidad--;
    carritoMem.actualizar(id, producto);
    render();
  }
}

function incrementarItem(id) {
  const producto = carritoMem.get(id);
  if (producto.cantidad < producto.stock) {
    producto.cantidad++;
    carritoMem.actualizar(id, producto);
    render();
  }
}

function setListeners() {
  const botonesBorrar = document.querySelectorAll(
    '.carrito table button[id*="btnBorrar-"]'
  );

  botonesBorrar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = boton.id.split("-")[1];
      console.log("btnBorrar id", id);

      if (confirm(`¿Está seguro de borrar el producto del carrito id ${id}?`)) {
        // borramos el producto en el recurso local
        carritoMem.eliminar(id);
        // recargamos la vista y sus listeners con los datos nuevos
        render();
      }
    });
  });

  const botonesDecrementar = document.querySelectorAll(
    '.carrito table button[id*="btnDecrementar-"]'
  );
  //console.log(botonesDecrementar)

  botonesDecrementar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = boton.id.split("-")[1];
      console.log("botonesDecrementar id", id);

      decrementarItem(id);
    });
  });

  const botonesIncrementar = document.querySelectorAll(
    '.carrito table button[id*="btnIncrementar-"]'
  );

  botonesIncrementar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = boton.id.split("-")[1];
      console.log("botonesIncrementar id", id);

      incrementarItem(id);
    });
  });
}

function start() {
  console.warn("startCarrito");

  refBorrar = document.querySelector(".carrito__borrar");
  refPedir = document.querySelector(".carrito__pedir");

  refBorrar.addEventListener("click", () => {
    borrarCarrito();
  });

  refPedir.addEventListener("click", () => {
    generarPedido();
  });

  render();
}

// -------------------------------------------
//               Exportación
// -------------------------------------------
export default {
  start,
  agregar,
};
