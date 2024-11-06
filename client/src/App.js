import './App.css';
import Post from "./Post";
import Header from "./Header";
import Layout from "./Layout";
import IndexPage from "./pages/IndexPage";
import { Route,Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path='/' element ={<Layout />}>
      <Route index element ={
         
         <IndexPage />
       
     } />
     <Route path ={'/login'} element ={
       <div>login page</div>
       
     } />
     <Route path ={'/register'} element ={
       <div>register</div>
     } />
      </Route>
      
    </Routes>
     
  );
}
export default App;
