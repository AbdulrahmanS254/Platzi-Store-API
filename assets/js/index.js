// Fetching the products from the API
// page limit of displaying products
const limit = 9;

async function getProducts(pageNum = 1, catId) {
    try {
        const offset = (pageNum - 1) * limit;
        const response = await fetch(
            `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${limit}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.length < 9) {
            next.disabled = true;
        } else {
            next.disabled = false;
        }
        return data;
    } catch (err) {
        console.log("Getting products Error", err);
    }
}

const prosContainer = document.getElementById("productsGrid");

const createCard = (
    dataId,
    imgUrl,
    imgAlt,
    title,
    description,
    category,
    price
) => {
    const cardBody = document.createElement("div");

    cardBody.classList.add("product-card");
    cardBody.setAttribute("data-id", dataId);

    const cardImg = document.createElement("img");

    let imgReplaceUrl =
        "https://retailminded.com/wp-content/uploads/2016/03/EN_GreenOlive-1.jpg";

    cardImg.src = imgUrl;
    cardImg.alt = imgAlt;

    cardImg.onerror = () => {
        cardImg.src = imgReplaceUrl;
    };

    const proTitle = document.createElement("h3");
    proTitle.textContent = title;

    const proDescription = document.createElement("p");
    proDescription.classList.add("description");
    proDescription.classList.add("text-truncate");
    proDescription.textContent = description;

    const proCategory = document.createElement("p");
    proCategory.classList.add("category");
    proCategory.textContent = category;

    const proPrice = document.createElement("p");
    proPrice.classList.add("price");
    proPrice.textContent = `$${price}`;

    cardBody.append(cardImg, proTitle, proDescription, proCategory, proPrice);

    // redirecting when click on product to the product page with the query param
    cardBody.addEventListener("click", (ev) => {
        window.location = `./product.html?id=${dataId}`;
    });

    prosContainer.appendChild(cardBody);
};

const renderProducts = (page) => {
    prosContainer.innerHTML = "";
        getProducts(page).then((data) =>
            data.forEach((product) => {
                createCard(
                    product.id,
                    product.images?.[0],
                    product.slug,
                    product.title,
                    product.description,
                    product.category.name,
                    product.price
                );
            })
        );
};

// === Filtering with categories ===
// Getting categories from the categories api
async function getCategories() {
    try {
        let response = await fetch(
            `https://api.escuelajs.co/api/v1/categories`
        );
        if (!response.ok) {
            // study note: response.ok returns boolean
            throw new Error("Getting categories Error" + response.status);
        }
        let data = await response.json();
        return data;
    } catch (err) {
        console.log("Error", err);
    }
}

// Getting the products by category

async function getProductsByCategory(pageNum = 1, catId) {
    try {
        const offset = (pageNum - 1) * limit;
        let res = await fetch(
            `https://api.escuelajs.co/api/v1/categories/${catId}/products?offset=${offset}&limit=${limit}`
        );
        if (!res.ok) {
            throw new Error("Getting products by category Error", res.status);
        }
        let data = await res.json();
        if (data.length < 9) {
            next.disabled = true;
        } else {
            next.disabled = false;
        }
        return data;
    } catch (err) {
        console.log(err);
    }
}

// render products by category function

const renderProductsByCategory = (page, cat) => {
    prosContainer.innerHTML = "";
    getProductsByCategory(page, cat).then((data) =>
        data.forEach((product) => {
            createCard(
                product.id,
                product.images?.[0],
                product.slug,
                product.title,
                product.description,
                product.category.name,
                product.price
            );
        })
    );
};

// the select menu and the filtering logic
const selectCategory = document.getElementById("category");

const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");

const applyFilterBtn = document.getElementById("applyFilters");
const resetFilterBtn = document.getElementById("resetFilters");

const createSelect = (category, id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = category;
    selectCategory.appendChild(option);
};

getCategories().then((data) => {
    data.forEach((item) => {
        createSelect(item.name, item.id);
    });
});

let choosedCategory = null;
let productsAreFiltered = false;

selectCategory.addEventListener("change", (e) => {
    choosedCategory = selectCategory.value;

    if (choosedCategory === "all") {
        productsAreFiltered = false;
        renderProducts(currentPage);
    } else {
        productsAreFiltered = true;
        renderProductsByCategory(currentPage, choosedCategory);
    }
});

// Resetting the filter and rerendering the page
resetFilterBtn.addEventListener("click", (ev) => {
    selectCategory.value = "all";
    productsAreFiltered = false;
    choosedCategory = null;
    minPriceInput.value = "";
    maxPriceInput.value = "";
    renderProducts(currentPage);
});

// === HANDLING THE PAGINATION === //

// Pagination buttons
const prev = document.getElementById("prevPage");
const pageInfo = document.getElementById("pageInfo");
const next = document.getElementById("nextPage");

let currentPage = 1;

prev.addEventListener("click", (ev) => {
    if (currentPage > 1) {
        currentPage--;
        pageInfo.textContent = `Page ${currentPage}`;

        if (productsAreFiltered) {
            renderProductsByCategory(currentPage, choosedCategory);
        } else {
            renderProducts(currentPage);
        }
    }
});

next.addEventListener("click", (ev) => {
    currentPage++;
    pageInfo.textContent = `Page ${currentPage}`;
    if (productsAreFiltered) {
        renderProductsByCategory(currentPage, choosedCategory);
    } else {
        renderProducts(currentPage);
    }
});

// === INITIAL RENDER ===
renderProducts(currentPage);
