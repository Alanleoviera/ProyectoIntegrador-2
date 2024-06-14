function start() {
  console.warn("startContacto");

  document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("contact-form");
    formulario.addEventListener("submit", (e) => {
      e.preventDefault();
      formulario.reset();
    });
  });
}

// -------------------------------------------
//               Exportación
// -------------------------------------------
export default {
  start,
};
