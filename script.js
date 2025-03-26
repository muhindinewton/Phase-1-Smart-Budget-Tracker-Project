document.addEventListener("DOMContentLoaded", () => {

    const transactionsPage = document.getElementById("transactions");
    const transactionsLink = document.getElementById("transactions-link");
    const homeLink = document.getElementById("home-link");
    const homePage = document.getElementById("home");

    transactionsLink.addEventListener("click", () => {
        transactionsPage.style.display = "block";
        homePage.style.display = "none";
    });
    homeLink.addEventListener("click", () => {
        homePage.style.display = "block";
        transactionsPage.style.display = "none";
    });
});