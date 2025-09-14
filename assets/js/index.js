// Fetching the products from the API
// page limit
const limit = 9;

async function getProducts(pageNum = 1) {
    try {
        const offset = (pageNum - 1) * limit;
        const response = await fetch(
            `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${limit}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.length === 0) {
            prosContainer.innerHTML = "<p>No more products</p>";
            next.disabled = true;
            return;
        } else {
            next.disabled = false;
        }
        return data;
    } catch (err) {
        console.log("Error", err);
    }
}

// getProducts().then((data) =>
//     data.forEach((product) => {
//         createCard(
//             product.id,
//             product.images?.[0],
//             product.slug,
//             product.title,
//             product.description,
//             product.category.name,
//             product.price
//         );
//     })
// );

// === (pro) stands for (product) and (pros) is the plural

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

// === HANDLING THE PAGINATION ===

// Pagination buttons
const prev = document.getElementById("prevPage");
const pageInfo = document.getElementById("pageInfo");
const next = document.getElementById("nextPage");

let currentPage = 1;

prev.addEventListener("click", (ev) => {
    if (currentPage > 1) {
        currentPage--;
        pageInfo.textContent = `Page ${currentPage}`;
        renderProducts(currentPage);
    }
});

next.addEventListener("click", (ev) => {
    currentPage++;
    pageInfo.textContent = `Page ${currentPage}`;
    renderProducts(currentPage);
});

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

renderProducts(currentPage);
