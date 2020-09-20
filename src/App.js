import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import InstagramEmbed from 'react-instagram-embed';

import instagram from './assets/instagram.png';
import Post from './components/Post';
import { db, auth } from './firebase';
import ImageUpload from './components/ImageUpload';
import './App.css';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has log in
        setUser(authUser);
      } else {
        //user has logged out
        setUser(null);
      }
    });
    return () => {
      //perform some cleanup actions before running useeffect again
      unsubscribe();
    };
  }, [user, username]);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  return (
    <div className='app'>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className='app__form'>
            <center>
              <img className='app__headerImage2' src={instagram} alt='logo' />
              <Input
                type='text'
                placeholder='enter username'
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              <Input
                type='email'
                placeholder='enter email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Input
                type='password'
                placeholder='enter password'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </center>
            <Button
              type='submit'
              onClick={signUp}
              disabled={!username}
              variant='outlined'
              color='secondary'
              className='app__form-button'
            >
              SignUp
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className='app__form'>
            <center>
              <img className='app__headerImage2' src={instagram} alt='logo' />

              <Input
                type='email'
                placeholder='enter email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Input
                type='password'
                placeholder='enter password'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </center>
            <Button
              type='submit'
              onClick={signIn}
              disabled={!username}
              variant='outlined'
              color='secondary'
              className='app__form-button'
            >
              SignIn
            </Button>
          </form>
        </div>
      </Modal>
      <div className='app__header'>
        <img
          className='app__headerImage'
          src='https://img.icons8.com/cute-clipart/64/000000/instagram-new.png'
          alt='logo'
        />
        <img className='app__headerImage2' src={instagram} alt='logo' />
        {user ? (
          <Button onClick={() => auth.signOut()}>LogOut</Button>
        ) : (
          <div>
            <Button onClick={() => setOpenSignIn(true)}>SignIn</Button>
            <Button onClick={() => setOpen(true)}>SignUp</Button>
          </div>
        )}
      </div>
      <div className='posts'>
        <div className='posts__left'>
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        <div className='posts__right'>
          <InstagramEmbed
            url='https://www.instagram.com/p/Bp9qod8D3es/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />

          <InstagramEmbed
            url='https://www.instagram.com/p/CAIbQoNlwhm/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
          <InstagramEmbed
            url='https://www.instagram.com/p/CDtyxxCAluC/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry, you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
