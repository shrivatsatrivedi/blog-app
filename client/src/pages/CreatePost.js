import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useState} from "react";
import {Navigate} from "react-router-dom";
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image'],
    ['clean'],
  ],
};
const  formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
];
export default function CreatePost() {
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);

    if (files && files[0]) {
      data.set('file', files[0]);
  }

  try {
      const response = await fetch('https://blog-app-silk-gamma.vercel.app/post', {
          method: 'POST',
          body: data,
          credentials: 'include',
      });

      if (response.ok) {
          setRedirect(true);
      } else {
          console.error('Server Error:', response.statusText);
      }
  } catch (error) {
      console.error('Fetch Error:', error);
  }
}
if(redirect){
   return <Navigate to ={'/'} />
}
  return (
    <form onSubmit={createNewPost}>
      <input type="title"
             placeholder={'Title'}
             value={title}
             onChange={ev => setTitle(ev.target.value)} />
      <input type="summary"
             placeholder={'Summary'}
             value={summary}
             onChange={ev => setSummary(ev.target.value)} />
      <input type="file" onChange={ev => setFiles(ev.target.files)} />
             <ReactQuill
      value={content} 
      onChange={newValue =>setContent(newValue)}
      modules={modules}
      formats={formats} />
      <button style={{marginTop:'5px'}}>Create post</button>
    </form>
  );
}