import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
export default function LoginPage() {
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
  const[redirect,setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);
    async function login(ev) {
        ev.preventDefault();
       const response = await fetch('https://blog-app-silk-gamma.vercel.app/login', { 
            method: 'POST',
            body: JSON.stringify({ Username, Password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
        });
        if (response.ok){
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            });
                
        } else{
            alert('wrong credentials');
          }
    }

      if(redirect)
      {
        return <Navigate to ={'/' } />
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
