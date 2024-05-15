import { createStore } from 'https://cdn.skypack.dev/redux';

const initState = 0;
// Reducer
function reducer(state = initState, action){
    switch (action.type) {
        case 'DEPOSIT':
            return state + action.payload;
        case 'WITHDRAW':
            return state - action.payload;
        default:
            return state;
    }
}

// Store
const store = window.store = createStore(reducer);

// Action
function actionDeposit(payload) {
    return {
        type: 'DEPOSIT',
        payload
    }
}

function actionWithdraw(payload) {
    return {
        type: 'WITHDRAW',
        payload
    }
}

// DOM events
const deposit = document.querySelector('#deposit');
const withdraw = document.querySelector('#withdraw');

// Event handler
deposit.onclick = function() {
    store.dispatch(actionDeposit(10));
}

withdraw.onclick = function() {
    store.dispatch(actionWithdraw(10));
}

// Listener
store.subscribe(()=>{
    render();
})

// Render
function render(){
    const output = document.querySelector('#output');
    output.innerText = store.getState();
}

render();