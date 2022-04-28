import React, { useState, useEffect, useRef } from 'react';
import { Post, PostCreate } from "./Posts";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './Pages.css';

const useLoadPost = (urlBase, urlRegex) => {
  const pathname = useLocation().pathname;
  const isPathValid = urlRegex.test(pathname);
  const thisPostId = isPathValid ? +pathname.substring(urlBase.length) : null;

  const [state, setState] = useState({
    posts: null,
    loading: isPathValid,
    error: isPathValid ? null : "404 not found"
  });
  const thisPost = state.posts ? state.posts.find(p => p.id === thisPostId) : null;

  useEffect(() => {
    if (isPathValid) fetch("http://localhost:7777/posts")
      .then(r => r.json())
      .then(json => setState({ posts: json, loading: false, error: null }))
      .catch(e => setState({ posts: null, loading: false, error: "Loading failure" }));
  }, []);
  return [thisPost, state.loading, state.error];
};

const HomePage = () => {
  const navigate = useNavigate();
  const [loadedPosts, setLoadedPosts] = useState(null);
  useEffect(() => { fetch("http://localhost:7777/posts").then(r => r.json()).then(setLoadedPosts) }, []);

  if (!loadedPosts) return <div>Loading...</div>

  return (
    <div className="HomePage">
      {loadedPosts.map(p =>
        <Post key={p.id}
          author="unidentified user"
          time={new Date(p.created).toLocaleTimeString()}
          content={p.content}
          onClick={e => navigate("/posts/" + p.id)}
        />
      )}
      <Link to="/posts/new"><div>Create Post</div></Link>
    </div>
  );
};

const NewPostPage = () => {
  const navigate = useNavigate();
  const lockSubmit = useRef(false);

  const onSubmit = text => {
    if (lockSubmit.current) return;
    lockSubmit.current = true;
    const onSuccess = () => { lockSubmit.current = false; navigate("/") };
    const onFail = () => { lockSubmit.current = false; alert("Failed to send post to the server") };

    fetch("http://localhost:7777/posts", {
      method: "POST",
      body: JSON.stringify({ id: 0, content: text }),
      headers: new Headers({ "Content-Type": "application/json" })
    }).then(response => { if (response.ok) onSuccess(); else onFail() })
      .catch(e => onFail());
  };

  return (
    <div className="NewPostPage">
      <PostCreate buttons={[{ text: "Submit", callback: onSubmit }]}
        onClose={e => navigate("/")} />
    </div>
  );
}

const ViewPostPage = () => {
  const [post, isLoading, error] = useLoadPost("/posts/", /^\/posts\/\d+$/);

  if (error) return <div>{error}</div>
  if (isLoading) return null;

  return (
    <div className="ViewPostPage">
      <Link to="/"><div>Main Page</div></Link>
      <Link to={"/edit/" + post.id}><div>Edit</div></Link>
      <Post key={post.id}
        author="unidentified user"
        time={new Date(post.created).toLocaleTimeString()}
        content={post.content}
      />
    </div>
  );
};

const EditPostPage = () => {
  const [post, isLoading, error] = useLoadPost("/edit/", /^\/edit\/\d+$/);
  const navigate = useNavigate();
  const lockSubmit = useRef(false);

  const onSave = text => {
    if (lockSubmit.current) return;
    lockSubmit.current = true;
    const onSuccess = () => { lockSubmit.current = false; navigate("/") };
    const onFail = () => { lockSubmit.current = false; alert("Failed to send post to the server") };

    fetch("http://localhost:7777/posts", {
      method: "POST",
      body: JSON.stringify({ id: post.id, content: text }),
      headers: new Headers({ "Content-Type": "application/json" })
    }).then(response => { if (response.ok) onSuccess(); else onFail() })
      .catch(e => onFail());
  };

  const onDelete = () => {
    if (lockSubmit.current) return;
    lockSubmit.current = true;
    const onSuccess = () => { lockSubmit.current = false; navigate("/") };
    const onFail = () => { lockSubmit.current = false; alert("Failed to send request to the server") };

    fetch("http://localhost:7777/posts/" + post.id, { method: "DELETE" })
      .then(response => { if (response.ok) onSuccess(); else onFail() })
      .catch(e => onFail());
  };

  if (error) return <div>{error}</div>
  if (isLoading) return null;

  return (
    <div className="EditPostPage">
      <PostCreate buttons={[
        { text: "Delete", callback: onDelete, color: "#df4040" },
        { text: "Save", callback: onSave }]}
        onClose={e => navigate("/")} defaultValue={post.content} />
    </div>
  );
};

export { HomePage, NewPostPage, ViewPostPage, EditPostPage };