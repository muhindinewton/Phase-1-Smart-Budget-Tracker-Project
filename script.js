document.addEventListener("DOMContentLoaded", () => {

    const transactionForm = document.getElementById("add-transaction-form");
    const transactionList = document.getElementById("recent-transactions");
    const totalBalance = document.getElementById("total-balance");
    const totalIncome = document.getElementById("total-income");
    const totalExpense = document.getElementById("total-expense");
    const addTransactionBtn = document.getElementById("add-transaction-btn");
    const addTransactionFormSection = document.getElementById("add-transaction-form-section");
    const cancelBtn = document.getElementById("cancel-btn");
    const transactionsPage = document.getElementById("transactions");
    const transactionsLink = document.getElementById("transactions-link");
    const homeLink = document.getElementById("home-link");
    const homePage = document.getElementById("home");
    const incomeTransactionList = document.getElementById("income-transaction-list");
    const expenseTransactionList = document.getElementById("expense-transaction-list");

    // Show the Add Transaction form when the button is clicked
    addTransactionBtn.addEventListener("click", () => {
        addTransactionFormSection.style.display = "block";  // Show the form
    });
    
    // Cancel the form and hide it
    cancelBtn.addEventListener("click", () => {
        addTransactionFormSection.style.display = "none";  // Hide the form
    });
    
    
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
        fetch("https://phase-1-smart-budget-tracker-project.onrender.com/transactions")
        .then(response => response.json())
        .then(data => {
            console.log("Fetched Data:", data);
            renderHomeTransactions(data);
            renderIncomeTransactions(data);
            renderExpenseTransactions(data);
            updateSummary(data);
            // updateDistributionCharts(data);
        });
    }
    //Render transactions
    function renderHomeTransactions(transactions) {
        const recentTransactions = transactions.slice(0, 10); // Only show the first 10 transactions on Home
        transactionList.innerHTML = "";
        recentTransactions.forEach(transaction => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.category}</td>
                <td>$${transaction.amount}</td>
                <td class="${transaction.type}">${transaction.type}</td>
                <td><button onclick="deleteTransaction(${transaction.id})">Delete</button></td>
            `;
            transactionList.appendChild(row);
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

    // Handle Transaction Submission
    transactionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const amount = document.getElementById("amount").value;
        const category = document.getElementById("category").value;
        const type = document.getElementById("type").value;
        const date = document.getElementById("date").value;
        const newTransaction = { amount, category, type, date };
        fetch("https://phase-1-smart-budget-tracker-project.onrender.com/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTransaction)
        })
        .then(() => {
            fetchTransactions();
            addTransactionFormSection.style.display = "none";  // Hide the form after submission
            transactionForm.reset();
        });
    });

    // Delete a transaction
    window.deleteTransaction = (id) => {
        fetch(`https://phase-1-smart-budget-tracker-project.onrender.com/transactions/${id}`, {
            method: "DELETE"
        })
        .then(() => fetchTransactions());
    };

    // Initially load the transactions
    fetchTransactions();
});