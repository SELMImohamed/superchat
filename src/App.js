import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import {useAuthState } from 'react-firebase-hooks/auth';
import {useCollectionData } from 'react-firebase-hooks/firestore';
import { useRef, useState } from 'react';

firebase.initializeApp({
  apiKey: "AIzaSyAH6SQH3EnrFPQZBX0tupLq1BLMyLlTy8U",
  authDomain: "superchat-390c9.firebaseapp.com",
  projectId: "superchat-390c9",
  storageBucket: "superchat-390c9.appspot.com",
  messagingSenderId: "433817817576",
  appId: "1:433817817576:web:fa3ecd5064737cbbbb145d",
  measurementId: "G-DNZREC6W3W"
})
const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {
  const[user]=useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        <h1>😻 CHAT DE MOHA </h1>

      </header>
       <section>
        {user ? <ChatRoom/> : <SignIn/> }
       </section>
    </div>
  );
}

function SignIn(){
  const singnInWithGoogle = ()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick={singnInWithGoogle}>Singn in with Google</button>
  )

}

function ChatRoom(){
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query,{idField:'id'});
  const [formValue,setFormValue]= useState('');
  const sendMessage = async(e) =>{
    e.preventDefault();
    const {uid,photoURL} = auth.currentUser;
    await messagesRef.add({
      text:formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL

    })
    setFormValue('');
    dummy.current.scrollIntoView({behavior : 'smooth'})};
  return(
    <>
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
      <div ref = {dummy}> </div>
    </div>
    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e)=>setFormValue(e.target.value)}/>
      <button type="submit">SEND 🕊</button>
    </form>
    </>
  )


  
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={()=>auth.signOut()}>Sign out</button>
  )
}
function ChatMessage(props){
  const {text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid?'sent':'received';
  return (
    <div className={`message ${messageClass}`}>
    <img src={photoURL}/>
   <p>{text}</p>

    </div>
  )
  
}


export default App;