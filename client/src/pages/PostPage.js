import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function PostPage() {
    const [postInfo, setPostInfo] = useState(null);
    const { userInfo } = useContext(UserContext);
    const { id } = useParams();

    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => {
            response.json().then(postInfo => {
                setPostInfo(postInfo);
            });
        });
    }, [id]);

    if (!postInfo) return '';

    const { title, content, cover, author, createdAt } = postInfo;

    return (
        <div className="post-page">
            <h1>{title}</h1>
            {createdAt && (
                <time>{format(new Date(createdAt), 'MMM d, yyyy  HH:mm')}</time>
            )}
            <div className="author">by {author?.Username}</div>
            {userInfo.id === author?._id && (
                <div className="edit-row">
                     <Link className="edit-button" to={`/edit/${postInfo._id}`}>
        ✏️
    </Link>
                </div>
            )}
            <div className="image">
                <img src={`http://localhost:4000/${cover}`} alt="" />
            </div>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
}
