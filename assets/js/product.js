let queryString = window.location.search;

let param = new URLSearchParams(queryString);

let productId = param.get("id");

async function getProduct(id) {
    try {
        let response = await fetch(
            `https://api.escuelajs.co/api/v1/products/${id}`
        );

        if (!response.ok) {
            throw new Error(response);
        }

        let productData = await response.json();
        return productData;
    } catch (err) {
        console.log("there has been a problem in fetching the product", err);
    }
}

const productImg = document.getElementById("productImage");

const productTitle = document.getElementById("productTitle");

const productDescription = document.getElementById("productDescription");

const productPrice = document.getElementById("productPrice");

const productCategory = document.getElementById("productCategory");

const pushProductData = (data) => {
    productImg.src = data.images[0];
    productImg.onerror = () => {
        productImg.src =
            "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=1024x1024&w=is&k=20&c=5aen6wD1rsiMZSaVeJ9BWM4GGh5LE_9h97haNpUQN5I=";
    };
    productTitle.innerText = data.title;
    productDescription.innerText = data.description;
    productPrice.innerText = `$${data.price}`;
    productCategory.innerText = data.category.name;
};

getProduct(productId).then((data) => {
    pushProductData(data);
});
