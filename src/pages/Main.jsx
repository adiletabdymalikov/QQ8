import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Main() {
    const [notes, setNotes] = useState([]);
    const [appointment, setAppointment] = useState({ date: '', time: '', service: 'Стрижка' });
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    const API_URL = 'https://6a01fa240d92f63dd25323c7.mockapi.io/t/ad';

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
            const response = await axios.get(API_URL);
            if (response.status === 200) {
                const myNotes = response.data.filter(note => note.username === username);
                setNotes(myNotes);
            }
        } catch (error) {
            console.error(error);
        }
    }


    const postAppointment = async (e) => {
        e.preventDefault();
        if (!appointment.date || !appointment.time) return alert("Выберите дату и время!");

        try {
            const response = await axios.post(API_URL, {
                heading: `Запись: ${appointment.service}`,
                description: `Дата: ${appointment.date} | Время: ${appointment.time}`,
                username: currentUser,
                date: appointment.date,
                time: appointment.time
            });

            if (response.status === 201 || response.status === 200) {
                alert("Вы успешно записаны!");
                setAppointment({ date: '', time: '', service: 'Стрижка' });
                fetchNotes(currentUser);
            }
        } catch (error) {
            console.error(error);
            alert("Ошибка при записи");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('session');
        navigate('/login');
    };

    return (
        <div className="container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-0">✂️ BarberBook</h2>
                    {currentUser && <small className="text-primary">Клиент: {currentUser}</small>}
                </div>
                <button onClick={handleLogout} className="btn btn-sm btn-outline-danger">Выход</button>
            </div>


            <div className="card p-4 shadow-sm mb-5" style={{ borderRadius: '15px', border: 'none', background: '#f8f9fa' }}>
                <h4 className="mb-3">Записаться на стрижку</h4>
                <form onSubmit={postAppointment}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Услуга</label>
                        <select
                            className="form-select"
                            value={appointment.service}
                            onChange={(e) => setAppointment({ ...appointment, service: e.target.value })}
                        >
                            <option value="Мужская стрижка">Мужская стрижка</option>
                            <option value="Стрижка бороды">Стрижка бороды</option>
                            <option value="Комплекс (Голова+Борода)">Комплекс (Голова+Борода)</option>
                            <option value="Детская стрижка">Детская стрижка</option>
                        </select>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label small fw-bold">Выберите дату</label>
                            <input
                                type="date"
                                className="form-control"
                                value={appointment.date}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label small fw-bold">Выберите время</label>
                            <input
                                type="time"
                                className="form-control"
                                value={appointment.time}
                                onChange={(e) => setAppointment({ ...appointment, time: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-dark w-100 fw-bold py-2 mt-2">
                        ПОДТВЕРДИТЬ ЗАПИСЬ
                    </button>
                </form>
            </div>


            <div className="history">
                <h5 className="mb-3">Мои предстоящие визиты:</h5>
                {notes.length > 0 ? (
                    notes.slice().reverse().map((item) => (
                        <div key={item.id} className="card mb-3 p-3 shadow-sm" style={{ borderLeft: '5px solid #000' }}>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <div className="fw-bold">{item.heading}</div>
                                    <div className="text-muted small">{item.description}</div>
                                </div>
                                <span className="badge bg-success">Ожидается</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-4 border rounded bg-white text-muted">
                        У вас пока нет активных записей.
                    </div>
                )}
            </div>
        </div>
    );
}

export default Main;