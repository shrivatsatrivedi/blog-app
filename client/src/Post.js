import {format} from "date-fns";

export default function Post({title, summary, cover, content, createdAt,author}) {
  return (
     <div className="container">
        <div className="post">
           <div className="image">
              <img src={'http://localhost:4000/'+cover} alt=""/>
           </div>
           <div className="text">
              <h2>{title}</h2>
              <p className="info">
                 <a className="author">{author.Username}</a>
                 <time>{format(new Date(createdAt), 'MMM d, yyyy  HH:mm')}</time>
              </p>
              <p className="summary">{summary}</p>
           </div>
        </div>
     </div>
  );
}
