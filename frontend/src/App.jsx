import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions on initial render and after adding a new one
  useEffect(() => {
    const fetchTransactions = async () => {
      const API_URL = "http://localhost:6200/api" + "/transactions";
      const response = await fetch(API_URL);
      const json = await response.json();
      setTransactions(json);
    };

    fetchTransactions(); // Call initially
  }, [transactions]); // Re-run useEffect when transactions change

  async function addNewTransaction(e) {
    e.preventDefault();
    const API_URL = "http://localhost:6200/api" + "/transaction";
    const price = name.split(' ')[0];

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime
      })
    })
      .then(response => response.json())
      .then((json) => {
        setTransactions([...transactions, json]); // Update with new transaction
        setName('');
        setDescription('');
        setDatetime('');
        console.log('result', json);
      })
      .catch(error => console.error(error)); // Handle errors gracefully
  }

  function clearAllTransactions() {
    // Confirmation prompt before clearing (optional)
    if (window.confirm('Are you sure you want to clear all transactions?')) {
      setTransactions([]); // Set the state to an empty array
    }
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }

  return (
    <>
      <main>
        <h1>{balance} <span>.00</span></h1>

        <form onSubmit={addNewTransaction}>
          <div className='basic'>
            <input type='text'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={'+200 new samsung tv'} />
            <input
              type="datetime-local"
              value={datetime}
              onChange={e => setDatetime(e.target.value)}
            />
          </div>
          <div className='description'>
            <input type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={'description'} />
          </div>
          <button type='submit'>Add new Transaction</button>
        </form>
        <div className="transactions">
          {transactions.length > 0 ? (
            transactions.map(transaction => (
              <div key={transaction.id}> {/* Add unique key for performance */}
                <div className="transaction">
                  <div className="left">
                    <div className="name">{transaction.name}</div>
                    <div className="description">{transaction.description}</div>
                  </div>
                  <div className="right">
                    {console.log(transaction.price)}
                    <div className={`price ${transaction.price < 0 ? 'red' : 'green'}`}>
                      {transaction.price}
                    </div>
                    <div className="datetime">2022-12-18 15:45</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
           
            <p className="no-items">No items to display</p>
           
          )}

{transactions.length > 0 && (
                        <div className='clear-button'>
                            <button onClick={clearAllTransactions} className='clear'>Clear All</button>
                        </div>
                    )}
        </div>
      </main>
    </>
  );
}

export default App;