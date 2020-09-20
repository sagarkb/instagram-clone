import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import firebase from 'firebase';

import { db, storage } from '../firebase';
import './ImageUpload.css';

const ImageUpload = ({ username }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [progress, setProgress] = useState(0);

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };
  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        //progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        alert(error.message);
      },
      () => {
        //complete function
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection('posts').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
            setProgress(0);
            setCaption('');
            setImage(null);
          });
      }
    );
  };

  return (
    <div className='imageupload'>
      <progress className='imageupload__progress' value={progress} max='100' />
      <input
        type='text'
        placeholder='write a caption...'
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
      />
      <input
        type='file'
        onChange={handleChange}
        className='imageupload__file'
      />
      <Button
        className='imageupload__button'
        onClick={handleUpload}
        variant='contained'
        color='primary'
      >
        Post
      </Button>
    </div>
  );
};

export default ImageUpload;
