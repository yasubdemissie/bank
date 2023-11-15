'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Yasub Demissie',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
function displayMovements(mov) {
  containerMovements.innerHTML = '';
  mov.forEach((movement, i) => {
    let type = movement > 0? 'deposit' : 'withdrawal';
    let html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${movement}€</div>
  </div>`;
  containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}

function calcAndPrintBalance(account) {
  account.Balance = account.movements.reduce(function(acc, cur) { return acc + cur}, 0)
  labelBalance.textContent = `${account.Balance}€`;
}
function interest(account) {
  account.Interest = account.movements.filter(transaction => transaction > 0).map(interest => interest * account.interestRate).reduce((acc, cur) => (acc + cur), 0) / 100;
}
function type(account) {
  account.withdrawal = account.movements.filter(transaction => transaction < 0).reduce((acc, cur) => (acc + cur), 0);
  account.deposit = account.movements.filter(transaction => transaction > 0).reduce((acc, cur) => (acc + cur), 0);
}

function userNameGenerator(accounts) {
  accounts.forEach(acc => acc.userName = acc.owner.toLowerCase().split(' ').map(element => element[0]).join(''));
}

function typeHolder(accounts) { // Deposit or Withdrawal type holder(indicator)
  accounts.forEach( (account) => type(account));
}

function interestCalculator(accounts) {
  accounts.forEach((account) => interest(account));
}

interestCalculator(accounts);
userNameGenerator(accounts);
typeHolder(accounts);
// Displaying on the document
labelSumOut.textContent = `${Math.abs(account1.withdrawal)}€`;
labelSumIn.textContent = `${account1.deposit}€`;
labelSumInterest.textContent = `${account1.Interest}€`;

//  Start the program
let currentAccount;

// A Login Code
btnLogin.addEventListener('click', function(e) {
  e.preventDefault();
  currentAccount = accounts.find(function(account) { return account.userName === inputLoginUsername.value;})
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Clearing the input field and bluring it.
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    // display the welcome message with his/her firstName
    labelWelcome.textContent = `${currentAccount.owner.split(' ')[0]}, Welcome to Bankist`;
    displayMovements(currentAccount.movements);// Displaying on the document
    calcAndPrintBalance(currentAccount);
    labelSumOut.textContent = `${Math.abs(currentAccount.withdrawal)}€`;
    labelSumIn.textContent = `${currentAccount.deposit}€`;
    labelSumInterest.textContent = `${currentAccount.Interest}€`;

    document.querySelector('.app').style.opacity = 1;
  } else labelWelcome.textContent = `${inputLoginUsername.value}, Wrong Username or password`;
})

// To transfer
btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const receiverAcc = accounts.find(account => account.userName === inputTransferTo.value);
  const amountTransfered = inputTransferAmount.value;
  inputTransferAmount.value = inputTransferTo.value = '';
  if (amountTransfered > 0 && amountTransfered <= currentAccount.Balance && receiverAcc && receiverAcc !== currentAccount) {
    currentAccount.movements.push(-amountTransfered);
    receiverAcc.movements.push(Number(amountTransfered));

    calcAndPrintBalance(currentAccount);
    displayMovements(currentAccount.movements);// Displaying on the document
    type(currentAccount);
    interest(receiverAcc);
    type(receiverAcc);
    labelSumOut.textContent = `${Math.abs(currentAccount.withdrawal)}€`;
    labelSumIn.textContent = `${currentAccount.deposit}€`;


  } else labelWelcome.textContent = `${currentAccount.owner.split(' ')[0]}, Wrong account`;
});

btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  if (inputCloseUsername?.value ===  currentAccount.userName && Number(inputClosePin?.value) === currentAccount.pin) {
    let currentAccount_index = accounts.findIndex(account => account === currentAccount);
    accounts.splice(currentAccount_index, 1);
    document.querySelector('.app').style.opacity = '0';
  }
  inputCloseUsername.value = inputClosePin.value = '';
});