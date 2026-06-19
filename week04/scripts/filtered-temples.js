const temples = [
  {
    templeName: "Aba Nigeria",
    location: "Aba, Nigeria",
    dedicated: "2005, August, 7",
    area: 11500,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
  },
  {
    templeName: "Manti Utah",
    location: "Manti, Utah, United States",
    dedicated: "1888, May, 21",
    area: 74792,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
  },
  {
    templeName: "Payson Utah",
    location: "Payson, Utah, United States",
    dedicated: "2015, June, 7",
    area: 96630,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
  },
  {
    templeName: "Yigo Guam",
    location: "Yigo, Guam",
    dedicated: "2020, May, 2",
    area: 6861,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
  },
  {
    templeName: "Washington D.C.",
    location: "Kensington, Maryland, United States",
    dedicated: "1974, November, 19",
    area: 156558,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
  },
  {
    templeName: "Lima Perú",
    location: "Lima, Perú",
    dedicated: "1986, January, 10",
    area: 9600,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
  },
  {
    templeName: "Mexico City Mexico",
    location: "Mexico City, Mexico",
    dedicated: "1983, December, 2",
    area: 116642,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
  },
  {
    templeName: "Guayaquil Ecuador",
    location: "Guayaquil, Ecuador",
    dedicated: "1999, August, 1",
    area: 45000,
    // Apunta a la carpeta 'images' y al archivo local
    imageUrl: "images/guayaquil.webp" 
  },
  {
    templeName: "Rome Italy",
    location: "Rome, Italy",
    dedicated: "2019, March, 10",
    area: 41010,
    imageUrl: "images/rome.webp"
  },
  {
    templeName: "Salt Lake",
    location: "Salt Lake City, Utah, United States",
    dedicated: "1893, April, 6",
    area: 253015,
    imageUrl: "images/salt.jpeg"
  }
];

const gallery = document.getElementById("gallery");
const filterTitle = document.getElementById("filter-title");
const navLinks = document.querySelectorAll(".navigation a");

function createTempleCard(temple) {
  const figure = document.createElement("figure");

  const img = document.createElement("img");
  img.src = temple.imageUrl;
  img.alt = `${temple.templeName} Temple`;
  img.loading = "lazy";
  img.width = 400;
  img.height = 250;

  const caption = document.createElement("figcaption");
  caption.innerHTML = `
    <h3>${temple.templeName}</h3>
    <p>Location: <span>${temple.location}</span></p>
    <p>Dedicated: <span>${temple.dedicated}</span></p>
    <p>Size: <span>${temple.area.toLocaleString()} sq ft</span></p>
  `;

  figure.appendChild(img);
  figure.appendChild(caption);
  return figure;
}

function renderTemples(list) {
  gallery.innerHTML = "";
  const fragment = document.createDocumentFragment();
  list.forEach((t) => fragment.appendChild(createTempleCard(t)));
  gallery.appendChild(fragment);
}

function getYear(temple) {
  return parseInt(temple.dedicated.split(",")[0].trim(), 10);
}

function filterTemples(filter) {
  switch (filter) {
    case "old":
      return temples.filter((t) => getYear(t) < 1900);
    case "new":
      return temples.filter((t) => getYear(t) > 2000);
    case "large":
      return temples.filter((t) => t.area > 90000);
    case "small":
      return temples.filter((t) => t.area < 10000);
    case "home":
    default:
      return temples;
  }
}

function setActive(link) {
  navLinks.forEach((l) => l.classList.remove("active"));
  link.classList.add("active");
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const filter = link.dataset.filter;
    filterTitle.textContent = link.textContent;
    renderTemples(filterTemples(filter));
    setActive(link);
    // Close mobile menu after selection
    const nav = document.querySelector(".navigation");
    const menuBtn = document.getElementById("menu");
    if (nav.classList.contains("show")) {
      nav.classList.remove("show");
      menuBtn.textContent = "☰";
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
});

const menuBtn = document.getElementById("menu");
menuBtn.addEventListener("click", () => {
  const nav = document.querySelector(".navigation");
  const isOpen = nav.classList.toggle("show");
  menuBtn.textContent = isOpen ? "✖" : "☰";
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});

// Initial render
renderTemples(temples);
setActive(document.querySelector('.navigation a[data-filter="home"]'));

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;
