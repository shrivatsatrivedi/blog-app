import Post from "../Post";
import {useState, useEffect} from "react";
export default function IndexPage(){
  const [posts,setPosts] = useState([]);
  useEffect(() => {
    fetch('https://blog-app-silk-gamma.vercel.app/post').then(response =>{
         response.json().then(posts => {
         setPosts(posts);
         });
    });
  }, []);
    return(
      <div>
      {posts.length >0 && posts.map(post=>(
         <Post key={post._id} {...post} />
      ))}
      </div>
    );
}