// -------------------------------------------
//               Importación
// -------------------------------------------
import inicio from "./inicio.js";
import alta from "./alta.js";
import carrito from "./carrito.js";
import contacto from "./contacto.js";
import nosotros from "./nosotros.js";

// -------------------------------------------
//           Funciones Globales
// -------------------------------------------
function cargarPlantilla(id) {
  id = id || "inicio";
  const main = document.querySelector("main");
  const url = "./plantillas/" + id + ".html";

  const start = {
    inicio: inicio.start,
    alta: alta.start,
    carrito: carrito.start,
    contacto: contacto.start,
    nosotros: nosotros.start,
  };

  const xhr = new XMLHttpRequest();
  xhr.open("get", url);
  xhr.addEventListener("load", () => {
    if (xhr.status == 200) {
      const plantilla = xhr.response;

      // Cargamos el código HTML de la plantilla seleccionada
      main.innerHTML = plantilla;
      start[id]();
    }
  });
  xhr.send();
}

function cargarPlantillas() {
  const links = document.querySelectorAll("header nav a");

  // --------- carga de la vista de navegación inicial ---------
  const id = location.hash.slice(1);
  cargarPlantilla(id);

  // --------- carga de las vistas de navegación (dinámicas) ---------
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = link.id;
      location.hash = id;
    });
  });

  const link = document.querySelector("#boton-carrito");
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const id = "carrito";
    location.hash = id;
  });

  const link2 = document.querySelector("#logo");
  link2.addEventListener("click", (e) => {
    e.preventDefault();
    const id = "inicio";
    location.hash = id;
  });

  window.addEventListener("hashchange", () => {
    const id = location.hash.slice(1);
    cargarPlantilla(id);
  });
}

function startMain() {
  console.warn("startMain");
  cargarPlantillas();
}

// -------------------------------------------
//               Ejecución
// -------------------------------------------
window.onload = startMain;
