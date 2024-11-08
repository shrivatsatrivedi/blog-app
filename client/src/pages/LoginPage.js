import { useState } from "react";

export default function LoginPage() {
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');

    async function login(ev) {
        ev.preventDefault();
        await fetch('http://localhost:4000/login', { 
            method: 'POST',
            body: JSON.stringify({ Username, Password }),
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return (
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <input
                type="text"
                placeholder="Username"
                value={Username}
                onChange={ev => setUsername(ev.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={Password}
                onChange={ev => setPassword(ev.target.value)}
            />
            <button>Login</button>
        </form>
    );
}
