document.addEventListener("DOMContentLoaded", () => {

    const totalBalance = document.getElementById("total-balance");
    const totalIncome = document.getElementById("total-income");
    const totalExpense = document.getElementById("total-expense");
    const transactionsPage = document.getElementById("transactions");
    const transactionsLink = document.getElementById("transactions-link");
    const homeLink = document.getElementById("home-link");
    const homePage = document.getElementById("home");
    const incomeTransactionList = document.getElementById("income-transaction-list");
    const expenseTransactionList = document.getElementById("expense-transaction-list");

    // Show transactions page and hide home page
    transactionsLink.addEventListener("click", () => {
        transactionsPage.style.display = "block";
        homePage.style.display = "none";
    });
    // Show home page and hide transactions page
    homeLink.addEventListener("click", () => {
        homePage.style.display = "block";
        transactionsPage.style.display = "none";
    });

    //Fetch transactions from Database
    function fetchTransactions() {
        fetch("http://localhost:3000/transactions")
        .then(response => response.json())
        .then(data => {
            console.log("Fetched Data:", data);
            // renderHomeTransactions(data);
            renderIncomeTransactions(data);
            renderExpenseTransactions(data);
            updateSummary(data);
            // updateDistributionCharts(data);
        });
    }

    function renderIncomeTransactions(transactions) {
        incomeTransactionList.innerHTML = "";
        transactions.filter(transaction => transaction.type === "income")
        .forEach(transaction => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.category}</td>
                <td>$${transaction.amount}</td>
                <td class="${transaction.type}">${transaction.type}</td>
                <td><button onclick="deleteTransaction(${transaction.id})">Delete</button></td>
            `;
            incomeTransactionList.appendChild(row);
        });
    }

    function renderExpenseTransactions(transactions) {
        expenseTransactionList.innerHTML = "";
        transactions.filter(transaction => transaction.type === "expense")
        .forEach(transaction => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.category}</td>
                <td>$${transaction.amount}</td>
                <td class="${transaction.type}">${transaction.type}</td>
                <td><button onclick="deleteTransaction(${transaction.id})">Delete</button></td>
            `;
            expenseTransactionList.appendChild(row);
        });
    }

    function updateSummary(transactions) {
        let income = 0, expense = 0;
        transactions.forEach(transaction => {
            if (transaction.type === "income") {
                income += parseFloat(transaction.amount);
            } else {
                expense += parseFloat(transaction.amount);
            }
        });
        totalIncome.textContent = `$${income.toFixed(2)}`;
        totalExpense.textContent = `$${expense.toFixed(2)}`;
        totalBalance.textContent = `$${(income - expense).toFixed(2)}`;
    }

    // Initially load the transactions
    fetchTransactions();
});