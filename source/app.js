document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transaction-form');
    const transactionTableBody = document.querySelector('#transaction-table tbody');
    const summaryOutput = document.getElementById('summary-output');
    const printButton = document.getElementById('print-btn');
    const downloadButton = document.getElementById('download-btn');

    // Retrieve transactions from local storage
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Add transaction
    const addTransaction = (event) => {
        event.preventDefault();

        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;
        const salaryType = document.getElementById('salary').value;
        const date = document.getElementById('date').value;
        const description = document.getElementById('description').value;

        // Create transaction object
        const transaction = {
            id: Date.now(),
            amount: parseFloat(amount),
            category,
            salaryType,
            date,
            description
        };

        // Add transaction to the array and save to local storage
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        displayTransactions();
        calculateSummary();
        transactionForm.reset();
    };

    // Display transactions in table
    const displayTransactions = () => {
        transactionTableBody.innerHTML = ''; // Clear existing rows
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>₹${transaction.amount.toFixed(2)}</td>
                <td>${transaction.category}</td>
                <td>${transaction.salaryType}</td>
                <td>${transaction.date}</td>
                <td>${transaction.description || 'No description'}</td>
                <td>
                    <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">Delete</button>
                </td>
            `;
            transactionTableBody.appendChild(row);
        });
    };

    // Delete transaction
    window.deleteTransaction = (id) => {
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        displayTransactions();
        calculateSummary();
    };

    // Calculate summary based on transactions
    const calculateSummary = () => {
        let income = 0, expense = 0;
        transactions.forEach(transaction => {
            if (transaction.category.toLowerCase() === 'salary') {
                income += transaction.amount;
            } else {
                expense += transaction.amount;
            }
        });

        document.getElementById('total-income').textContent = `₹${income.toFixed(2)}`;
        document.getElementById('total-expense').textContent = `₹${expense.toFixed(2)}`;
        document.getElementById('remaining-savings').textContent = `₹${(income - expense).toFixed(2)}`;
    };

    // Print summary and transactions
    const printSummary = () => {
        const printContent = `
            <h2>Summary</h2>
            ${summaryOutput.innerHTML}
            <h2>Transactions</h2>
            ${document.getElementById('transaction-table').outerHTML}
        `;

        const originalContent = document.body.innerHTML;
        document.body.innerHTML = `<div>${printContent}</div>`;
        window.print();
        document.body.innerHTML = originalContent; // Restore original content
        location.reload(); // Reload to restore event listeners
    };

    // Download transactions as Excel (CSV format)
    const downloadAsExcel = () => {
        let csvContent = "data:text/csv;charset=utf-8,Amount,Category,Salary Type,Date,Description\n";
        transactions.forEach(transaction => {
            const row = [transaction.amount.toFixed(2), transaction.category, transaction.salaryType, transaction.date, transaction.description].join(",");
            csvContent += row + "\n";
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up after download
    };

    // Event listeners
    transactionForm.addEventListener('submit', addTransaction);
    printButton.addEventListener('click', printSummary);
    downloadButton.addEventListener('click', downloadAsExcel);

    // Initial display
    displayTransactions();
    calculateSummary();
});
