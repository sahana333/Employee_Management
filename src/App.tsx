import React from 'react';
import Form from './form'; // Import the Form component
import './App.css'; // Optional: Include App-level styles if needed

const App: React.FC = () => {
    return (
        <div className="app-container">
            <h1>Employee Management</h1>
            <Form />
        </div>
    );
};

export default App;