// -------------------------------------------
//               Importación
// -------------------------------------------
import productosMem from "./productosMem.js";
import servicioProductos from "./servicioProductos.js";
import carrito from "./carrito.js";
// -------------------------------------------
//           Funciones Globales
// -------------------------------------------
function render() {
  let cards = "";

  const productos = productosMem.getAll();

  if (productos.length) {
    for (let i = 0; i < productos.length; i++) {
      cards += `<section>
                        <h3>${productos[i].nombre}</h3>
                        <img src="${productos[i].foto}" />
                        <p><b>Precio:</b> $${productos[i].precio}</p>
                        <p><b>Stock:</b> ${productos[i].stock}</p>
                        <p><b>Marca:</b> ${productos[i].marca}</p>
                        <p><b>Categoría: </b>${productos[i].categoria}</p>
                        <p><b>Descripción corta: </b>${
                          productos[i].descorta
                        }</p>
                        <p><b>Descripción larga: </b>${
                          productos[i].deslarga
                        }</p>
                        <p><b>Edad desde: </b>${productos[i].edaddesde} años</p>
                        <p><b>Edad hasta: </b>${productos[i].edadhasta} años</p>
                        <br>
                        <p><b style="color:gold;">Envío: </b>${
                          productos[i].envio ? "Si" : "No"
                        }</p>
                        <button id="btnComprar-${
                          productos[i].id
                        }">Agregar al carrito</button>
                        <div id="myAlert-${
                          productos[i].id
                        }">Producto agregado al carrito</div>
                    </section>`;
    }
  } else
    cards +=
      '<h2 class="msg-error">No se encontraron productos para mostrar</h2>';

  document.querySelector(".section-cards-container").innerHTML = cards;
  setListeners();
}

function setListeners() {
  const botonesComprar = document.querySelectorAll(
    '.inicio section button[id^="btnComprar-"]'
  );

  botonesComprar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = boton.id.split("-")[1];
      const producto = productosMem.get(id);

      showAlert(id);

      if (!carrito.agregar(producto)) boton.disabled = true;
    });
  });
}

function showAlert(id) {
  let x = document.querySelector(`.inicio section div[id^="myAlert-${id}"]`);

  x.style.display = "block";
  setTimeout(function () {
    x.style.display = "none";
  }, 1500);
}

async function start() {
  console.warn("startInicio");

  const productos = await servicioProductos.getAll();
  productosMem.set(productos);

  render();
}

// -------------------------------------------
//               Exportación
// -------------------------------------------
export default {
  start,
};
