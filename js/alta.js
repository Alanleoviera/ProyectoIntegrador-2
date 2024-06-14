// -------------------------------------------
//               Importación
// -------------------------------------------
import productosMem from "./productosMem.js";
import servicioProductos from "./servicioProductos.js";

// -------------------------------------------
//           Variables Globales
// -------------------------------------------
let editarID;
let refNombre;
let refPrecio;
let refStock;
let refMarca;
let refCategoria;
let refDesCorta;
let refDesLarga;
let refEdadDesde;
let refEdadHasta;
let refFoto;
let refEnvio;
let refBotonAgregarActualizar;
// -------------------------------------------
//           Funciones Globales
// -------------------------------------------
function copiarProductoEnFormulario(producto) {
  //console.log(producto)
  for (let campo in producto) {
    const ref = document.getElementById(campo);
    if (ref) ref[ref.id == "envio" ? "checked" : "value"] = producto[campo];
  }
}

function ponerBotonAgregar() {
  refBotonAgregarActualizar.classList.remove("btnActualizar");
  refBotonAgregarActualizar.classList.add("btnAgregar");
  refBotonAgregarActualizar.innerText = "Agregar";
}

function ponerBotonActualizar() {
  refBotonAgregarActualizar.classList.add("btnActualizar");
  refBotonAgregarActualizar.classList.remove("btnAgregar");
  refBotonAgregarActualizar.innerText = "Actualizar";
}

function borrarFormulario() {
  refNombre.value = "";
  refPrecio.value = "";
  refStock.value = "";
  refMarca.value = "";
  refCategoria.value = "";
  refDesCorta.value = "";
  refDesLarga.value = "";
  refEdadDesde.value = "";
  refEdadHasta.value = "";
  refFoto.value = "";
  refEnvio.checked = false;
}

function formularioValido(producto) {
  for (let campo in producto) {
    if (campo != "envio") {
      if (!producto[campo]) return false;
    }
  }
  return true;
}

async function agregarActualizar(e) {
  e.preventDefault();
  let nombre = refNombre.value;
  let precio = +refPrecio.value;
  let stock = +refStock.value;
  let marca = refMarca.value;
  let categoria = refCategoria.value;
  let desCorta = refDesCorta.value;
  let desLarga = refDesLarga.value;
  let edadDesde = refEdadDesde.value;
  let edadHasta = refEdadHasta.value;
  let foto = refFoto.value;
  let envio = refEnvio.checked;

  let producto = {
    nombre: nombre,
    precio: precio,
    stock: stock,
    marca: marca,
    categoria: categoria,
    descorta: desCorta,
    deslarga: desLarga,
    edaddesde: edadDesde,
    edadhasta: edadHasta,
    foto: foto,
    envio: envio,
  };

  if (formularioValido(producto)) {
    console.log(producto);

    if (editarID) {
      producto.id = editarID;

      // actualizamos el producto en el recurso remoto
      const productoActualizado = await servicioProductos.actualizar(
        editarID,
        producto
      );
      // actualizamos el producto en el recurso local
      productosMem.actualizar(productoActualizado.id, productoActualizado);

      editarID = null;
      ponerBotonAgregar();
    } else {
      // guardamos el producto en el recurso remoto
      const productoGuardado = await servicioProductos.guardar(producto);
      // guardamos el producto en el recurso local
      productosMem.guardar(productoGuardado);
    }

    // actualizamos la vista y sus listeners con los nuevos datos
    render();

    borrarFormulario();
  } else alert("Los datos en el formulario no son válidos");
}

function render() {
  let filasTabla;
  const productos = productosMem.getAll();

  if (productos.length) {
    filasTabla = `<tr>
            <th>#</th>
            <th>nombre</th>
            <th>precio</th>
            <th>stock</th>
            <th>marca</th>
            <th>categoria</th>
            <th>descripción corta</th>
            <th>descripción larga</th>
            <th>edad desde</th>
            <th>edad hasta</th>
            <th>foto</th>
            <th>envío</th>
            <th>acciones</th>
        </tr>`;

    for (let i = 0; i < productos.length; i++) {
      filasTabla += `<tr>
                <td class="centrar">${productos[i].id}</td>
                <td>${productos[i].nombre}</td>
                <td class="centrar"> $ ${productos[i].precio}</td>
                <td class="centrar">${productos[i].stock}</td>
                <td>${productos[i].marca}</td>
                <td>${productos[i].categoria}</td>
                <td>${productos[i].descorta}</td>
                <td>${productos[i].deslarga}</td>
                <td>${productos[i].edaddesde}</td>
                <td>${productos[i].edadhasta}</td>
                <td><img width="150" src="${
                  productos[i].foto + "?" + (1 || Math.random())
                }" alt="foto de ${productos[i].nombre}"></td>
                <td class="centrar">${productos[i].envio ? "Si" : "No"}</td>
                <td>
                    <button ${editarID ? "disabled" : ""} id="btnBorrar-${
        productos[i].id
      }">Borrar</button>
                    ${
                      editarID && editarID == productos[i].id
                        ? `<button id="btnCancelar-${productos[i].id}">Cancelar</button>`
                        : `<button id="btnEditar-${productos[i].id}">Editar</button>`
                    }
                </td>
            </tr>`;
    }
  } else
    filasTabla =
      '<h2 class="msg-error">No se encontraron productos para mostrar</h2>';

  document.querySelector("table").innerHTML = filasTabla;
  setListeners();
}

function setListeners() {
  const botonesBorrar = document.querySelectorAll(
    '.alta table button[id*="btnBorrar-"]'
  );

  botonesBorrar.forEach((boton) => {
    boton.addEventListener("click", async () => {
      const id = boton.id.split("-")[1];
      console.log("btnBorrar id", id);

      if (confirm(`¿Está seguro de borrar el producto de id ${id}?`)) {
        // borramos el producto en el recurso remoto
        const productoBorrado = await servicioProductos.eliminar(id);
        // borramos el producto en el recurso local
        productosMem.eliminar(productoBorrado.id);
        // recargamos la vista y sus listeners con los datos nuevos
        render();
      }
    });
  });

  const botonesEditar = document.querySelectorAll(
    '.alta table button[id*="btnEditar-"]'
  );

  botonesEditar.forEach((boton) => {
    boton.addEventListener("click", async () => {
      const id = boton.id.split("-")[1];
      console.log("btnEditar id", id);

      editarID = id;

      const producto = productosMem.get(id);

      copiarProductoEnFormulario(producto);

      ponerBotonActualizar();

      render();
    });
  });

  const botonesCancelar = document.querySelectorAll(
    '.alta table button[id*="btnCancelar-"]'
  );

  botonesCancelar.forEach((boton) => {
    boton.addEventListener("click", async () => {
      const id = boton.id.split("-")[1];
      console.log("btnCancelar id", id);

      editarID = null;

      borrarFormulario();
      ponerBotonAgregar();

      render();
    });
  });
}

async function start() {
  console.warn("startAlta");

  editarID = null;

  // referencias a elementos de entrada por sus IDs
  refNombre = document.getElementById("nombre");
  refPrecio = document.getElementById("precio");
  refStock = document.getElementById("stock");
  refMarca = document.getElementById("marca");
  refCategoria = document.getElementById("categoria");
  refDesCorta = document.getElementById("descorta");
  refDesLarga = document.getElementById("deslarga");
  refEdadDesde = document.getElementById("edaddesde");
  refEdadHasta = document.getElementById("edadhasta");
  refFoto = document.getElementById("foto");
  refEnvio = document.getElementById("envio");

  refBotonAgregarActualizar = document.querySelector(".alta form button");

  let refFormAlta = document.querySelector("main form");
  refFormAlta.onsubmit = agregarActualizar;

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
