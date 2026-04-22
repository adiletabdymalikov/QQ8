import axios from "axios";
import { useEffect, useState } from "react";

function Main() {
    const [notes, setNotes] = useState([]);
    const [heading, setHeading] = useState('');
    const [description, setDescription] = useState('');

    const fetchNotes = async () => {
        try {
            const response = await axios.get('https://69dd38ef84f912a26404e7d2.mockapi.io/notes');
            if (response.status === 200) setNotes(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const postNotes = async () => {
        if (!heading.trim()) return;
        try {
            const response = await axios.post('https://69dd38ef84f912a26404e7d2.mockapi.io/notes', {
                heading: heading,
                description: description || "Нет описания"
            });
            if (response.status === 201 || response.status === 200) {
                setHeading('');
                setDescription('');
                fetchNotes();
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchNotes();
    }, [])

    return (
        <div className="notes-container">
            {/* Заголовок над карточкой */}
            <h2 className="main-title">
                📝 Мой список дел
            </h2>

            <div className="glass-panel">
                <div className="input-group-row">
                    <input 
                        type="text" 
                        placeholder="Добавьте новую задачу..." 
                        value={heading}
                        onChange={(e) => setHeading(e.target.value)} 
                    />
                    <button className="add-button" onClick={postNotes}>
                        Добавить
                    </button>
                </div>

               
                <input 
                    style={{width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box', border: '1px solid #eee', borderRadius: '5px'}}
                    type="text" 
                    placeholder="Описание (необязательно)" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} 
                />

                <div className="notes-list">
                    {notes.length > 0 ? (
                        notes.map((i) => (
                            <div className="note-card" key={i.id || Math.random()}>
                                <div className="note-title">{i.heading}</div>
                                <div className="note-desc">{i.description}</div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">Пусто!</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Main;