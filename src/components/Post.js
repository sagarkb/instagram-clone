import React, { useState, useEffect } from 'react';
import { Avatar } from '@material-ui/core';

import { db } from '../firebase';
import './Post.css';

const Post = ({ postId, user, username, caption, imageUrl }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const addComment = (event) => {
    event.preventDefault();
    db.collection('posts').doc(postId).collection('comments').add({
      text: comment,
      username: user.displayName,
    });

    setComment('');
  };

  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar
          className='post__avatar'
          alt='Sagar'
          src='https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80'
        />
        <h3>{username}</h3>
      </div>

      <img className='post__image' src={imageUrl} alt='photu' />

      <div className='post__icons'>
        <img
          src='https://img.icons8.com/officel/50/000000/filled-like.png'
          alt='logo'
        />

        <img
          src='https://img.icons8.com/bubbles/50/000000/topic.png'
          alt='logo'
        />
        <img src='https://img.icons8.com/nolan/50/filled-sent.png' alt='logo' />
        <img
          className='post__bookmark'
          alt='logo'
          src='https://img.icons8.com/fluent-systems-regular/50/000000/bookmark-ribbon.png'
        />
      </div>
      <h4 className='post__caption'>
        <strong>{username}</strong>-{caption}
      </h4>
      {comments.map((comment) => (
        <p key={Math.random()}>
          <strong>{comment.username}</strong>:{comment.text}
        </p>
      ))}

      {user && (
        <form className='post__comment'>
          <input
            className='post__comment-input'
            type='text'
            placeholder='enter comment'
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <button
            className='post__comment-button'
            type='submit'
            disabled={!comment}
            onClick={addComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;
