import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({_id, title, summary, cover, content, createdAt, author}) {
  return (
    <div className="container">
      <div className="post">
        <div className="image">
          <Link to={`/post/${_id}`}>
            <img src={cover} alt="Post Cover" />
          </Link>
        </div>
        <div className="text">
          <Link to={`/post/${_id}`}>
            <h2>{title}</h2>
          </Link>
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