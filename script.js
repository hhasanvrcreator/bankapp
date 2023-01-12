'use strict';
const balanceField = document.querySelector('.balance');
const movementsField = document.querySelector('.movements');
const sendMoneyField = document.querySelector('#sendMoneySelectBox');
const sendingAmountField = document.querySelector('#sendingAmount');
const summryField = document.querySelector('.summry');
const debitField = document.querySelector('#debitTotal');
const creditField = document.querySelector('#creditTotal');

document.querySelector('#username').textContent = getlocal('user_name');

const accounts = JSON.parse(getlocal('accounts'));
const user_id = getlocal('user_id');

function checkLogin() {
    if (localStorage.getItem('token') == null) {
        window.location.replace(window.location.origin + '/auth/login.html');
    }
}

function setlocal(name, value) {
    localStorage.setItem(name, value);
}
function getlocal(name) {
    return localStorage.getItem(name);
}
function removelocal(...keys) {
    keys.forEach(element => {
        localStorage.removeItem(element)
    });
}

function getCurrentUser() {
    return accounts.find(({ id }) => id.toString() === user_id.toString());
}

function fetchMovements() {
    const user_account = getCurrentUser();
    balanceField.innerHTML = user_account.balance;
    let movementsHtml = '';
    if (user_account.movements.length > 0) {
        user_account.movements.slice().reverse().forEach(element => {
            movementsHtml += `<p>${element.includes('-') ? 'Debit : ' : 'Credit : '}${element}</p>`
        });
        // summryField.classList.replace('hide','show');
        summryField.style.display = "block";
        getSummry();
    } else {
        movementsHtml = '<p>No Transaction</p>';
    }
    movementsField.innerHTML = movementsHtml;
}

function fetchUsers() {
    let usersHtml = '';
    if (accounts.length > 0) {
        accounts.forEach(element => {
            if (element.id != user_id)
                usersHtml += `<option value="${element.id}">${element.name}</option>`
        });
    }
    sendMoneyField.innerHTML = usersHtml;
}


function sendMoney() {
    if(sendingAmountField.value == "" || sendingAmountField.value == null){
        alert('Please Enter Amount');
        return false;
    }
    let amount = parseInt(sendingAmountField.value);
    const receiver_id = sendMoneyField.value;
    // console.log(amount + " :::: " + receiver_id + " :::: "  + balanceField.innerHTML);
    if (amount > parseInt(balanceField.innerHTML)) {
        alert("you don't have enough amount!");
        return false;
    }
    let receiver_data_index = accounts.findIndex(element => element.id == receiver_id);
    let receiver_data = accounts.filter(element => element.id == receiver_id);
    receiver_data[0].balance += amount;
    receiver_data[0].movements.push(`+${amount}`);
    let sender_data_index = accounts.findIndex(element => element.id == user_id);
    let sender_data = accounts.filter(element => element.id == user_id);
    sender_data[0].balance -= amount;
    sender_data[0].movements.push(`-${amount}`);
    accounts[receiver_data_index] = receiver_data[0];
    accounts[sender_data_index] = sender_data[0];
    setlocal('accounts', JSON.stringify(accounts));
    sendingAmountField.value = "";
    fetchMovements();
}
document.querySelector('#sendButton').addEventListener('click', sendMoney);

function getSummry() {
    const user_account = getCurrentUser();
    const moves = user_account.movements;
    const debitSummry = moves.filter(element => element.includes('-')).reduce((acc, value) => acc + parseInt(value), 0)
    const creditSummry = moves.filter(element => element.includes('+')).reduce((acc, value) => acc + parseInt(value), 0)
    console.log('summries');
    console.log(debitSummry)
    console.log(creditSummry)
    debitField.textContent = Math.abs(debitSummry);
    creditField.textContent = Math.abs(creditSummry);
}


// logout
document.querySelector('#logoutButton').addEventListener('click', function () {
    removelocal('token', 'user_id');
    window.location.replace(window.location.origin + '/auth/login.html');
})

checkLogin();
fetchMovements();
// console.log(accounts);
fetchUsers();