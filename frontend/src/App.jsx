import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./Home.jsx";
import AddTodo from "./AddTodo.jsx";

function App() {
    return (
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/add" element={<AddTodo />} />
                </Routes>
            </Router>
    );
}

export default App;
