document.addEventListener("DOMContentLoaded", () => {
  // Initialize Google Charts
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(fetchTransactions);

  //Selecting DOM Elements
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
    addTransactionFormSection.style.display = "block"; // Show the form
  });

  // Cancel the form and hide it
  cancelBtn.addEventListener("click", () => {
    addTransactionFormSection.style.display = "none"; // Hide the form
  });

  //Fetch transactions from Database
  function fetchTransactions() {
    fetch("https://smart-budget-tracker-production.up.railway.app/transactions")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Data:", data);
        renderHomeTransactions(data);
        renderIncomeTransactions(data);
        renderExpenseTransactions(data);
        updateSummary(data);
        updateDistributionCharts(data);
      });
  }

  // Render transactions with error checking
  function renderHomeTransactions(transactions) {
    if (!Array.isArray(transactions)) {
      console.error(
        "Error: Expected an array of transactions but got:",
        transactions
      );
      alert("Failed to load transactions. Please try again.");
      return;
    }

    if (!transactionList) {
      console.error(
        "Error: transactionList is not defined or found in the DOM."
      );
      return;
    }

    const recentTransactions = transactions.slice(0, 10); // Only show the first 10 transactions on Home
    transactionList.innerHTML = "";

    recentTransactions.forEach((transaction) => {
      if (!transaction.id) {
        console.error("Skipping transaction due to missing ID:", transaction);
        return; // Skip transactions without valid IDs
      }

      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${transaction.date || "N/A"}</td>
            <td>${transaction.category || "Uncategorized"}</td>
            <td>$${transaction.amount || "0.00"}</td>
            <td class="${transaction.type || "unknown"}">${
        transaction.type || "Unknown"
      }</td>
            <td><button onclick="deleteTransaction('${
              transaction.id
            }')">Delete</button></td>
        `;

      transactionList.appendChild(row);
    });

    console.log(
      "Successfully rendered",
      recentTransactions.length,
      "transactions."
    );
  }

  function renderIncomeTransactions(transactions) {
    incomeTransactionList.innerHTML = "";
    transactions
      .filter((transaction) => transaction.type === "income")
      .forEach((transaction) => {
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
    transactions
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
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

  // Update Summary (Total Income, Expense, Balance)
  function updateSummary(transactions) {
    let income = 0,
      expense = 0;
    transactions.forEach((transaction) => {
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

  // Generate Distribution Charts (Income & Expense)
  function updateDistributionCharts(transactions) {
    google.charts.load("current", { packages: ["corechart"] });

    setTimeout(() => {
      // Prepare data for income distribution
      const incomeData = transactions.filter((t) => t.type === "income");
      const incomeCategories = {};

      incomeData.forEach((transaction) => {
        incomeCategories[transaction.category] =
          (incomeCategories[transaction.category] || 0) +
          parseFloat(transaction.amount);
      });

      // Create income chart data
      const incomeChartData = [["Category", "Amount"]];
      Object.entries(incomeCategories).forEach(([category, amount]) => {
        incomeChartData.push([category, amount]);
      });

      // Draw income chart
      const incomeChart = new google.visualization.PieChart(
        document.getElementById("income-chart")
      );
      incomeChart.draw(google.visualization.arrayToDataTable(incomeChartData), {
        title: "Income Distribution",
        pieSliceText: "percentage",
        width: "100%",
        height: "100%",
        tooltip: { trigger: "focus" },
      });

      // Prepare data for expense distribution
      const expenseData = transactions.filter((t) => t.type === "expense");
      const expenseCategories = {};

      expenseData.forEach((transaction) => {
        expenseCategories[transaction.category] =
          (expenseCategories[transaction.category] || 0) +
          parseFloat(transaction.amount);
      });

      // Create expense chart data
      const expenseChartData = [["Category", "Amount"]];
      Object.entries(expenseCategories).forEach(([category, amount]) => {
        expenseChartData.push([category, amount]);
      });

      // Draw expense chart
      const expenseChart = new google.visualization.PieChart(
        document.getElementById("expense-chart")
      );
      expenseChart.draw(
        google.visualization.arrayToDataTable(expenseChartData),
        {
          title: "Expense Distribution",
          pieSliceText: "percentage",
          width: "100%",
          height: "100%",
          tooltip: { trigger: "focus" },
        }
      );
    }, 100);
  }

  // Handle Transaction Submission
  transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const type = document.getElementById("type").value;
    const date = document.getElementById("date").value;
    const newTransaction = { amount, category, type, date };
    fetch(
      "https://smart-budget-tracker-production.up.railway.app/transactions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      }
    ).then(() => {
      fetchTransactions();
      addTransactionFormSection.style.display = "none"; // Hide the form after submission
      transactionForm.reset();
    });
  });

  // Delete a transaction
  window.deleteTransaction = (id) => {
    fetch(
      `https://smart-budget-tracker-production.up.railway.app/transactions/${id}`,
      {
        method: "DELETE",
      }
    ).then(() => fetchTransactions());
  };

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

  // Initially load the transactions
  fetchTransactions();
});
