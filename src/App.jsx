import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main.jsx';
import Products from './pages/Products';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Главная страница с вашими заметками */}
          <Route path="/main" element={<Main />} />
          
          {/* Страница продуктов */}
          <Route path="/products" element={<Products />} />
          
          {/* Редирект, если зашли на пустую страницу */}
          <Route path="/" element={<Main />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;