// fetching list of currencies
fetch('https://free.currencyconverterapi.com/api/v5/currencies')
  .then(function (response) {
    return response.json();
  })
  .then(function (myJson) {
    Object.keys(myJson).map((currencies) => {
      const currencyLists = myJson[currencies]
      Object.keys(currencyLists).map((currencyId) => {
        const currId = currencyId

        //   currencies from
        const listOfCurrenciesA = document.getElementById('currenciesA');
        const currencyFrom = document.createElement("option");
        currencyFrom.setAttribute("id", "currencyFrom");
        currencyFrom.text = currId;
        currencyFrom.value = currId;
        listOfCurrenciesA.appendChild(currencyFrom);


        //currencies to
        const listOfCurrenciesB = document.getElementById('currenciesB');
        const currencyTo = document.createElement("option");
        currencyTo.setAttribute("id", "currencyTo");
        currencyTo.text = currId;
        currencyTo.value = currId;
        listOfCurrenciesB.appendChild(currencyTo);
      });
    })
  });


window.onload = function () {
  document.getElementById('submitForm').addEventListener('click', (e) => {
    e.preventDefault();
    const currFrom = document.getElementById('currenciesA').value
    const currTo = document.getElementById('currenciesB').value
    const query = currFrom + '_' + currTo;

    // querying Api for the exchangeRate value
    fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=y`)
      .then(function (response) {
        return response.json();
      })
      .then(function (currency) {
        Object.keys(currency).map((currencyValue) => {
          const exchangeRate = currency[currencyValue].val
          // saving queries and rates in indexedDB
          // return dbPromise.then(function (db) {
          //   if (!db) return;

          //   const tx = db.transaction('conversion rates', 'readwrite');
          //   const store = tx.objectStore('conversion rates');
          //   store.put(exchangeRate, query);
          //   store.put('hello', 'bukunmi');
          //   return tx.complete;
          // });
          document.getElementById('rate').innerHTML = exchangeRate.toFixed(2);
          let inputAmount = document.getElementById('inputAmount').value;
          // currency conversion output
          const exchangeResult = exchangeRate * inputAmount;
          document.getElementById('conversionResult').innerHTML = exchangeResult.toFixed(2);
        })
      })
  });
}


// service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js', { scope: './' })
    .then((registration) => {
      console.log('service worker registered')
    })
    .catch((err) => {
      console.log('service worker failed to register', err);
    });
};



// create indexDb database
const dbPromise = idb.open('Currency-Converter', 1, upgradeDB => {
  let store = upgradeDB.createObjectStore('conversion rates');
});

