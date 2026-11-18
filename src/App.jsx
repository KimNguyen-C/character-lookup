import SetList from "./pages/SetList.jsx";
import {Routes, Route} from "react-router-dom";
import Character from "./pages/Character.jsx";
import './App.css';

function App() {
    return (
        <Routes>
            <Route exact path="/" element={<SetList />} />
            <Route path="/character/:id" element={<Character />} />
        </Routes>


    )
}

export default App;