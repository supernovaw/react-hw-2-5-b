import React, { useRef } from 'react';
import './Post.css';
import './PostCreate.css';

const Post = ({ author, time, content, onClick }) => (
  <div className="Post" onClick={onClick}>
    <div className="header">
      <span className="author">{author}</span>
      <span className="time">{time}</span>
    </div>
    <div className="content">{content}</div>
  </div>
);

// buttons: [{ text: "Post", callback: function, color: "green" }, ...]
const PostCreate = ({ buttons, onClose, defaultValue }) => {
  const textRef = useRef(null);
  const makeHandleClick = ({ callback }) => e => callback(textRef.current.value);

  return (
    <div className="PostCreate">
      <div className="close-button" onClick={onClose}></div>
      <textarea placeholder="Create new post…" ref={textRef} defaultValue={defaultValue} />

      <div className="wrapper-bottom">{buttons.map((obj, ind) =>
        <button
          className="post-button"
          key={ind}
          onClick={makeHandleClick(obj)}
          style={{ "--accent-color": obj.color }}
        >{obj.text}</button>
      )}</div>
    </div>
  );
};

export { Post, PostCreate };