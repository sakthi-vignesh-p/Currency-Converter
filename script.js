
const amount = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");

window.addEventListener('load', () => {
    fetch('https://api.frankfurter.app/currencies')
        .then(res => res.json())
        .then(data => {
            let array = Object.entries(data);
            updateOptions(array);
        });
});

function updateOptions(data) {
    data.forEach(([currencyCode, currencyName]) => {
        const optionFrom = document.createElement("option");
        optionFrom.value = currencyCode;
        optionFrom.textContent = `${currencyCode} - ${currencyName}`;
        fromCurrency.appendChild(optionFrom);

        const optionTo = document.createElement("option");
        optionTo.value = currencyCode;
        optionTo.textContent = `${currencyCode} - ${currencyName}`;
        toCurrency.appendChild(optionTo);
    });
}

document.getElementById("convertBtn").addEventListener("click", function() {
    const amountValue = parseFloat(amount.value);
    const fromCurrencyValue = fromCurrency.value;
    const toCurrencyValue = toCurrency.value;

    // Check if the user has selected the same currency for both "from" and "to" fields
    if (fromCurrencyValue === toCurrencyValue) {
        document.getElementById("conversionResult").textContent = "Please select different currencies for conversion.";
        return;
    }

    // Validate the amount input
    if (!amountValue || amountValue <= 0) {
        document.getElementById("conversionResult").textContent = "Please enter a valid amount.";
        return;
    }

    // Fetch conversion rate and display the result
    fetch(`https://api.frankfurter.app/latest?amount=${amountValue}&from=${fromCurrencyValue}&to=${toCurrencyValue}`)
        .then(response => response.json())
        .then(data => {
            const rate = data.rates[toCurrencyValue];
            if (rate) {
                const convertedAmount = (amountValue * rate).toFixed(2);
                document.getElementById("conversionResult").textContent = `${amountValue} ${fromCurrencyValue} = ${convertedAmount} ${toCurrencyValue}`;
            } else {
                document.getElementById("conversionResult").textContent = "Currency not available for conversion.";
            }
        })
        .catch(error => {
            console.error("Error fetching exchange rate:", error);
            document.getElementById("conversionResult").textContent = "Error fetching exchange rate. Please try again.";
        });
});
