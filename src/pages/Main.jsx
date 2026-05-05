import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { products } from "../data/products"; 

function Main() {
    const [notes, setNotes] = useState([]);
    const [cart, setCart] = useState([]); 
    const [currentUser, setCurrentUser] = useState(null); 
    const navigate = useNavigate();

   
    useEffect(() => {
        const session = localStorage.getItem('session');
        if (!session) {
            navigate('/login'); 
        } else {
            setCurrentUser(session);
            fetchNotes(session);
        }
    }, [navigate]);

   
    const fetchNotes = async (username) => {
        try {
            const response = await axios.get('https://69dd38ef84f912a26404e7d2.mockapi.io/notes');
            if (response.status === 200) {
               
                const myNotes = response.data.filter(note => note.username === username);
                setNotes(myNotes);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item => 
                item.id === product.id ? { ...item, count: item.count + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, count: 1 }]);
        }
    }

    
    const postOrder = async () => {
        if (cart.length === 0) return alert("Корзина пуста!");

        const orderSummary = cart.map(item => `${item.name} x${item.count}`).join(", ");
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.count), 0);

        try {
            const response = await axios.post('https://69dd38ef84f912a26404e7d2.mockapi.io/notes', {
                heading: `Чек #${Math.floor(Math.random() * 1000)}`,
                description: `${orderSummary} | Итого: ${totalPrice} сом`,
                username: currentUser 
            });
            if (response.status === 201 || response.status === 200) {
                setCart([]); 
                fetchNotes(currentUser); 
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('session');
        navigate('/login');
    };

    return (
        <div className="notes-container" style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
            
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px'}}>
                <div>
                    <h2 style={{margin: 0}}>📝 Касса</h2>
                    {currentUser && <small className="text-success">Аккаунт: {currentUser}</small>}
                </div>
                
                <div style={{display: 'flex', gap: '10px'}}>
                    <Link to="/Products" className="btn btn-outline-primary">🍔 Меню</Link>
                    <Link to="/dashboard" className="btn btn-light">⚙️ Админ</Link>
                    <button onClick={handleLogout} className="btn btn-danger">Выход</button>
                </div>
            </div>
            
            <div className="fast-menu" style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px'}}>
                {products.map((item) => (
                    <button 
                        key={item.id}
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => addToCart(item)}
                    >
                        + {item.name}
                    </button>
                ))}
            </div>

            <div className="glass-panel" style={{background: '#fff3cd', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #ffeeba'}}>
                <h4 style={{marginTop: 0}}>Текущий чек:</h4>
                {cart.length > 0 ? (
                    <>
                        {cart.map(item => (
                            <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                                <span>{item.name} <strong>x{item.count}</strong></span>
                                <span>{item.price * item.count} сом</span>
                            </div>
                        ))}
                        <hr />
                        <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px'}}>
                            <span>ИТОГО:</span>
                            <span>{cart.reduce((sum, item) => sum + (item.price * item.count), 0)} сом</span>
                        </div>
                        <button className="btn btn-success w-100 mt-3" onClick={postOrder}>
                            ОФОРМИТЬ ЧЕК
                        </button>
                        <button className="btn btn-link btn-sm w-100 text-danger" onClick={() => setCart([])}>Очистить</button>
                    </>
                ) : <p>Добавьте еду в чек...</p>}
            </div>

            <div className="notes-list">
                <h4>История ваших чеков:</h4>
                {notes.length > 0 ? (
                    notes.slice().reverse().map((i) => (
                        <div className="note-card" key={i.id} style={{borderLeft: '5px solid #28a745', marginBottom: '10px', padding: '15px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                            <div style={{fontWeight: 'bold'}}>{i.heading}</div>
                            <div style={{fontSize: '14px', color: '#555'}}>{i.description}</div>
                        </div>
                    ))
                ) : <p className="text-muted">У вас пока нет оформленных заказов.</p>}
            </div>
        </div>
    );
}

export default Main;