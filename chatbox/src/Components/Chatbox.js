import React, { useEffect, useState, useRef } from 'react'
import './css/Chatbox.css'
import Messagebody from './Messagebody'
import $ from 'jquery'
import "jquery-ui-dist/jquery-ui";
import { db } from '../config'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { addDoc, getDocs, collection, query, where,orderBy ,onSnapshot } from 'firebase/firestore';
import sound from './css/Whatsapp Message - Sent - Sound.mp3'

function Chatbox({ room, name, account }) {
  const [filterchat, setfilterchat] = useState([])
  const[relaod,setreload]=useState(false)
  const[audio,setaudio]= useState({
    ting:new Audio(sound)
  })
  const messagesEndRef = useRef(null)

  const useChatref = collection(db, 'Chats')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  const bring_detailsbox = () => {
    $('#details-box').removeClass('none')
  }

  useEffect(() => {
    scrollToBottom()
  }, [room,relaod,filterchat]);






  // all usefull states


  const [list, setlist] = useState({
    roomid: "",
    message: "",
    time: "",
    sender: ""
  })


  



  //------------------------------------------- sorting function------------------------------------------//


  











  // getchats external function to get fetch dta from db
  

   







  // useeffects
  useEffect(() => {
     // Set up the real-time listener for the chat query
     const chatQuery = query(useChatref, where('roomid', '==', room));
     const unsubscribe = onSnapshot(chatQuery, snapshot => {
       const chatlists = snapshot.docs.map(doc => {
         const docData = doc.data();
         if (docData.time) {
           docData.time = docData.time.toDate();
         } else {
           docData.time = null;
         }
         return { id: doc.id, ...docData };
       });
 
       chatlists.sort((a, b) => a.time - b.time);
       setfilterchat(chatlists);
       
     });
 
     // Clean up the listener when the component unmounts
     return () => unsubscribe();

  },[room,relaod])


  




  // event handler functions
  const change = (e) => {
    setlist({
      roomid: room,
      message: e.target.value,
      time: new Date(),
      sender: account

    })

  }
  const submitmessage = async (e) => {
    setreload(true)
    e.preventDefault()
  
    await addDoc(useChatref, list).then(() => {
      setreload(false)
    
      $('#message-text').val('')
      setlist({
        roomid: "",
        message: "",
        time: "",
        sender: ""
      })

    })




  }




  return (
    <div className='chats-components'>
      <div className="title-bar">
        <span>{name}</span>
        <span className="top-chat-bar" onClick={bring_detailsbox}>
        <i class='bx bx-arrow-back'></i>Back
        </span>

      </div>
      <div className="chats">
        {filterchat.length!==0 && filterchat.map((e) => {
          if (e.sender === account) {
            return <span className='right'><Messagebody message={e.message} time={e.time.toString().slice(15,21)} key={e.id} /></span>

          }

          return <span className='left'><Messagebody message={e.message} time={e.time.toString().slice(15,21)} key={e.id} /></span>
        })}

        <div ref={messagesEndRef} />

      </div>
      <div className="message-bar">
        <form action="" className="message-form">
          <input type="text" id='message-text' name="message" onChange={change} placeholder='Type message' />
          <button type='submit' onClick={submitmessage}><i class='bx bx-send'></i></button>
        </form>

      </div>

    </div>
  )
}

export default Chatbox
