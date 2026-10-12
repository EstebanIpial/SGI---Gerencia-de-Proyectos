
let productos = JSON.parse(
  localStorage.getItem("modastock_productos") || "[]"
);

const formulario = document.getElementById("formProducto");
const listaProductos = document.getElementById("listaProductos");
const buscar = document.getElementById("buscar");
const mensaje = document.getElementById("mensaje");

// Inicio de sesión
document.getElementById("formLogin").addEventListener("submit", function(evento) {
  evento.preventDefault();

  const correo = document.getElementById("correoLogin").value.trim();
  const clave = document.getElementById("claveLogin").value;

  if (correo === "mural@estudiante.uniajc.edu.co" && clave === "12345") {
    document.getElementById("pantallaLogin").style.display = "none";
    document.getElementById("contenidoInventario").style.display = "block";

    mostrarProductos();
  } else {
    document.getElementById("mensajeLogin").textContent =
      "Correo o contraseña incorrectos.";
  }
});

// Cerrar sesión
document.getElementById("btnCerrarSesion").addEventListener("click", function() {
  document.getElementById("contenidoInventario").style.display = "none";
  document.getElementById("pantallaLogin").style.display = "block";

  document.getElementById("formLogin").reset();
  document.getElementById("mensajeLogin").textContent = "";
  formulario.classList.add("oculto");
});

// Mostrar formulario de productos
document.getElementById("btnNuevo").addEventListener("click", function() {
  formulario.classList.remove("oculto");
});

// Cancelar registro
document.getElementById("btnCancelar").addEventListener("click", function() {
  formulario.reset();
  formulario.classList.add("oculto");
  mensaje.textContent = "";
});

// Registrar producto
formulario.addEventListener("submit", function(evento) {
  evento.preventDefault();

  const producto = {
    referencia: document.getElementById("referencia").value.trim(),
    nombre: document.getElementById("nombre").value.trim(),
    categoria: document.getElementById("categoria").value,
    talla: document.getElementById("talla").value,
    color: document.getElementById("color").value.trim(),
    precio: Number(document.getElementById("precio").value),
    cantidad: Number(document.getElementById("cantidad").value),
    minimo: Number(document.getElementById("minimo").value)
  };

  const referenciaExiste = productos.some(function(p) {
    return p.referencia.toLowerCase() === producto.referencia.toLowerCase();
  });

  if (referenciaExiste) {
    mensaje.textContent = "Ya existe un producto con esa referencia.";
    return;
  }

  productos.push(producto);

  localStorage.setItem(
    "modastock_productos",
    JSON.stringify(productos)
  );

  formulario.reset();
  formulario.classList.add("oculto");

  mostrarProductos();
  mensaje.textContent = "Producto registrado correctamente.";
});

// Buscar productos
buscar.addEventListener("input", mostrarProductos);

// Mostrar productos y actualizar el resumen
function mostrarProductos() {
  const termino = buscar.value.trim().toLowerCase();

  const encontrados = productos.filter(function(p) {
    return p.nombre.toLowerCase().includes(termino) ||
      p.referencia.toLowerCase().includes(termino);
  });

  listaProductos.replaceChildren();

  if (encontrados.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");

    celda.colSpan = 7;
    celda.textContent = productos.length === 0
      ? "No hay productos registrados todavía."
      : "No se encontraron productos.";

    fila.appendChild(celda);
    listaProductos.appendChild(fila);
  }

  encontrados.forEach(function(producto) {
    let estado = "Disponible";

    if (producto.cantidad === 0) {
      estado = "Agotado";
    } else if (producto.cantidad <= producto.minimo) {
      estado = "Stock bajo";
    }

    const fila = document.createElement("tr");

    const valores = [
      producto.referencia,
      producto.nombre + " (" + producto.categoria + ")",
      producto.talla,
      producto.color,
      producto.precio.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
      }),
      producto.cantidad,
      estado
    ];

    valores.forEach(function(valor) {
      const celda = document.createElement("td");
      celda.textContent = valor;
      fila.appendChild(celda);
    });

    listaProductos.appendChild(fila);
  });

  document.getElementById("totalProductos").textContent = productos.length;

  document.getElementById("stockBajo").textContent =
    productos.filter(function(p) {
      return p.cantidad > 0 && p.cantidad <= p.minimo;
    }).length;

  document.getElementById("agotados").textContent =
    productos.filter(function(p) {
      return p.cantidad === 0;
    }).length;
}
