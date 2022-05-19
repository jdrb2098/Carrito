const items = document.getElementById("items");
const items2 = document.getElementById("items2");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
//objeto donde se guardara la informacion del json
let carrito = {};

//addeventlistener que espere que se cargue todo el documento html
document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  //guardar los items añadidos al carrito en un local storage
  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    pintarCarrito();
  }
});
// evento que se ejecutara al hacer click en el boton de compra de un objeto
items.addEventListener("click", (e) => {
  addCarrito(e);
});

items2.addEventListener("click", (e) => {
  btnAcction(e);
});

//Fetch para cosumir los datos de la base de datos o api en  formato json
const fetchData = async () => {
  try {
    const respuesta = await fetch("db.json");
    const data = await respuesta.json();
    //console.log(data)
    pintarCards(data);
  } catch (error) {
    console.log(error);
  }
};
// funcion para pintar en un contenedor los datos de cada producto
const pintarCards = (data) => {
  data.forEach((producto) => {
    //seleccionar el unico h5,p,img perteneciente al html de templatecard
    templateCard.querySelector("h5").textContent = producto.title;
    templateCard.querySelector("p").textContent = producto.precio;
    templateCard.querySelector("h4").textContent = producto.currency;
    templateCard
      .querySelector("img")
      .setAttribute("src", producto.thumbnailUrl);
    templateCard.querySelector("button").dataset.id = producto.id;
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);
};
// funcion para añadir objetos al carrito
const addCarrito = (e) => {
  if (e.target.classList.contains("btn-dark")) {
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
};
const setCarrito = (objeto) => {
  const producto = {
    id: objeto.querySelector(".btn-dark").dataset.id,
    title: objeto.querySelector("h5").textContent,
    precio: objeto.querySelector("p").textContent,
    cantidad: 1,
  };
  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }

  carrito[producto.id] = { ...producto };
  pintarCarrito();
};
// funcion para mostrar en contenedor los objetos del carrito
const pintarCarrito = () => {
  items2.innerHTML = "";
  Object.values(carrito).forEach((producto) => {
    templateCarrito.querySelector("th").textContent = producto.id;
    templateCarrito.querySelectorAll("td")[0].textContent = producto.title;
    templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
    templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
    templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
    templateCarrito.querySelector("span").textContent =
      producto.cantidad * producto.precio;

    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);

    localStorage.setItem("carrito", JSON.stringify(carrito));
  });

  items2.appendChild(fragment);
  pintarFooter();
};

// funcion para mostrar el footer
const pintarFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = ` <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
    return;
  }
  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const nPrecio = Object.values(carrito).reduce(
    (acc, { precio, cantidad }) => acc + cantidad * precio,
    0
  );

  templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
  templateFooter.querySelector("span").textContent = nPrecio;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const vaciar = document.getElementById("vaciar-carrito");
  vaciar.addEventListener("click", () => {
    carrito = {};
    pintarCarrito();
  });
};

const btnAcction = (e) => {
  //accion de aumentar
  if (e.target.classList.contains("btn-info")) {
    carrito[e.target.dataset.id];
    const producto = carrito[e.target.dataset.id];
    producto.cantidad = carrito[e.target.dataset.id].cantidad + 1;
    carrito[e.target.dataset.id] = { ...producto };
    pintarCarrito();
  }
  if (e.target.classList.contains("btn-danger")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad--;
    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    }
    pintarCarrito();
  }
  e.stopPropagation();
};
