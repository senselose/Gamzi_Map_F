import React, { useState } from "react";

const PostForm_ex = ({ onAddPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");

  const handleOpenPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setLocation(data.address); // 상세 주소 저장
      },
    }).open();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !content || !location) {
      alert("모든 필드를 입력해주세요!");
      return;
    }

    const newPost = {
      title,
      content,
      location, // 상세 주소 전달
    };

    onAddPost(newPost);
    setTitle("");
    setContent("");
    setLocation("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Location:</label>
        <input type="text" value={location} readOnly />
        <button type="button" onClick={handleOpenPostcode}>
          Search Address
        </button>
      </div>
      <button type="submit">Create Post</button>
    </form>
  );
};

export default PostForm_ex;
