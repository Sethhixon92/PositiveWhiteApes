let db;

const request = indexedDB.open('Positive_White_Apes', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_apes', { autoIncrement: true });

};

request.onsuccess = function(event) {
    db = event.target.result;

    if (navigator.onLine) {
        //uploadApes();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['new_apes'], 'readwrite');

    const apesObjectStore = transaction.objectStore('new_apes');

    apesObjectStore.add(record);
}

function uploadApes() {
    const transaction = db.transaction(['new_apes'], 'readwrite');

    const apesObjectStore = transaction.objectStore('new_apes');

    const getAll = apesObjectStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
           fetch('routes/api', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
        })
          .then(response => response.json())
          .then(serverResponse => {
              if (serverResponse.message) {
                  throw new Error(serverResponse);
              }
              const transaction = db.transaction(['new_apes'], 'readwrite');
              const apesObjectStore = transaction.objectStore('new_apes');
              apesObjectStore.clear();

              alert('All transactions have been submitted!');
          })
          .catch(err=> {
              console.log(err);
          });
     }
  };
}

window.addEventListener('online', uploadApes);