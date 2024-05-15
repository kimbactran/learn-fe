import React from 'react';
import { ReactDOM } from 'react';

function App(){
    return(
        <div>
            <h1>Kim Bắp ngu lắm</h1>
        </div>
    )
}

// Render component App vào #root element
ReactDOM.render(
    <App />,
    document.getElementById('root')
)