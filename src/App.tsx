import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Characters from "./pages/Characters";

const App: React.FC = () => {
    return (
        <Router>
            <div className="relative w-full h-full">
                <Routes>
                    <Route path="/" element={<Characters />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
