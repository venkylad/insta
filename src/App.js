import React, {useState, useEffect} from 'react'
import './App.css';
import Post from './Post'
import {db, auth} from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload'
import firebase from 'firebase'
import InstagramEmbed from 'react-instagram-embed'
 
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

const App = () => {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [openSignIn, setOpenSignIn] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        setUser(authUser)

        
      }else{
        setUser(null)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })
    ))
    })
  }, [])

  const signUp = (e) => {
    e.preventDefault()

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))

    setOpen(false)
  }

  const signIn = (e) => {
    e.preventDefault()

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false)
  }


  return(
    <div className="app">

     
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          
          <form className="app__signup">
            <center>
              <h1 className="app__logo">IMG-sta</h1>
            </center>  
              <Input type="text" placeholder="User Name" value={username}  
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input type="email" placeholder="E mail" value={email}  
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input type="password" placeholder="password" value={password}  
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>sign up</Button>
          </form>
          
        </div>
      </Modal>
      

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          
          <form className="app__signup">
            <center>
              <h1 className="app__logo">IMG-sta</h1>
            </center>  
              <Input type="email" placeholder="E mail" value={email}  
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input type="password" placeholder="password" value={password}  
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>sign in</Button>
          </form>
          
        </div>
      </Modal>

      <div className="app__header">
        <h1 className="app__logo">IMG-sta</h1>
        {
          user ? (
            <Button onClick={() => auth.signOut()}>Log out</Button>
          ) : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            </div>
            
          )
        }
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>) : (
        <h3>Need to Login</h3>
      )}

        <div className="add__posts">
          {
          posts.map(({post,id}) => (
            <Post key={id} postId={id} user={user} username={post.username} imageUrl={post.imageUrl} caption={post.caption} />
            ))
          }
        </div>
     

    </div>
  )
}

export default App;
