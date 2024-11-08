import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function Header() {
    const {setUserInfo, userInfo} = useContext(UserContext);
    useEffect(() => {
        fetch('http://localhost:4000/profile', {
                    credentials: 'include',
                }).then(response =>{
                  response.json().then(userInfo => {
                    setUserInfo(userInfo);
                  });
                });
    }, []); // Empty array means this only runs once on mount

    function logout(){
           fetch('http://localhost:4000/logout',{
   credentials : 'include',
   method : 'POST',
           });
           setUserInfo(null);
    }

     const Username = userInfo?.Username;
    return (
        <header>
            <Link to="/" className="logo">MyBlog</Link>
            <nav>
               {Username && (
                <>
                <Link to= "/create">Create new post</Link>
                <a onClick={logout}>Logout</a>
                </>
               )}
               {!Username && (
                <>
                 <Link to="/login">Login</Link>
                 <Link to="/register">Register</Link>
                </>
               )}
            </nav>
        </header>
    );
}
