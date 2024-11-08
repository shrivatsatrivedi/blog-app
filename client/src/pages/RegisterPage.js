import{useState} from "react";
export default function RegisterPage() {
    const [Username,setUsername]=  useState('');
    const [Password, setPassword] = useState('');
    async function register(ev){
               ev.preventDefault();
               
              const response =  await fetch('http://localhost:4000/register', {
                method: "POST",
                body : JSON.stringify({Username,Password}),
                headers: {'Content-Type':'application/json'},
               });
            if(response.status !== 200){
                alert('registration failed');
            }
            else{
                alert('You are registered');
            }
            }
  
    return(
       
            <form className ="register" onSubmit={register}>
                 <h1>Register</h1>
                <input type="text" 
                placeholder="Username" 
                value={Username} 
                onChange={ev => setUsername(ev.target.value)}/>
                <input type="password" placeholder="Password"  onChange={ev => setPassword(ev.target.value)}/>
                <button>Register</button>
            </form>
       
    );
}