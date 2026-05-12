import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { products, categories } from "../data/products";
import 'bootstrap/dist/css/bootstrap.min.css';

const Products = () => {
    const [productList, setProductList] = useState([]);
    const [currentUser, setCurrentUser] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        setProductList(products);
        
       
        const session = localStorage.getItem('session');
        if (session) {
            setCurrentUser(session);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('session');
        setCurrentUser(null);
        navigate('/login');
    };

    return (
        <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <div>
                            <h1 className="fw-bold mb-0">Меню</h1>
                            {currentUser && <small className="text-success fw-bold">Вы вошли как: {currentUser}</small>}
                        </div>
                        
                        <div className="d-flex gap-2">
                            <Link to="/main" className="btn btn-outline-dark px-4 py-2">
                                🏠 Заказы
                            </Link>

                         
                            {currentUser ? (
                                <>
                                    <Link to="/dashboard" className="btn btn-outline-primary px-4 py-2">
                                        Панель
                                    </Link>
                                    <button onClick={handleLogout} className="btn btn-danger px-4 py-2">
                                        Выход
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="btn btn-primary px-4 py-2">
                                        Вход
                                    </Link>
                                    <Link to="/register" className="btn btn-dark px-4 py-2">
                                        Регистрация
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="row g-4">
                        {productList.length > 0 ? (
                            productList.map((item) => {
                                const categoryName = categories.find(c => c.id === item.category_id)?.name || 'Общее';

                                return (
                                    <div className="col-12 col-sm-6 col-lg-4" key={item.id}>
                                        <div className="card h-100 border-0 shadow-sm p-3" style={{ borderRadius: "15px" }}>
                                            <img 
                                                src={item.image} 
                                                className="card-img-top" 
                                                alt={item.name} 
                                                style={{ height: "200px", objectFit: "cover", borderRadius: "10px" }}
                                            />
                                            <div className="card-body px-1">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <h5 className="card-title fw-bold mb-1">{item.name}</h5>
                                                    <span className="badge bg-warning text-dark">{item.price} сом</span>
                                                </div>
                                                <p className="text-muted small mb-2">{categoryName}</p>
                                                <p className="card-text text-secondary" style={{ fontSize: "0.9rem" }}>
                                                    {item.description}
                                                </p>
                                            </div>
                                            <div className="card-footer bg-transparent border-0 p-0">
                                                <button className="btn btn-primary w-100 py-2 fw-bold" style={{ borderRadius: "10px" }}>
                                                    Смотреть рецепт
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-12 text-center mt-5">
                                <p className="text-muted">Загрузка блюд...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;