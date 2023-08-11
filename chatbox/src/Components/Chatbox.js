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
  
  
  const[relaod,setreload]=useState(0)
  const[audio,setaudio]= useState({
    ting:new Audio(sound)
  })
  const[chatclear,setchatclear]=useState(false)
  const messagesEndRef = useRef(null)

  const useChatref = collection(db, 'Chats')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
  }
  const bring_detailsbox = () => {
    $('#details-box').removeClass('none')
  }

  var messagelength=$('.right').length
  const [list, setlist] = useState({
    roomid: "",
    message: "",
    time: "",
    sender: ""
  })

  





  useEffect(() => {
    scrollToBottom()
  }, [room,relaod,filterchat]);






  // all usefull states


  


  



  //------------------------------------------- sorting function------------------------------------------//


  











  // getchats external function to get fetch dta from db
  

   







  // useeffects
  useEffect(() => {
    setchatclear(true)
    
   
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
      
       
       setchatclear(false)
       
     });
 
     // Clean up the listener when the component unmounts
     return () => unsubscribe();

  },[room])


  
  // useEffect(()=>{
  //   var len = filterchat.length
  //   if(filterchat[len-1].sender!== account){
  //     audio.ting.play()

  //   }

  // },[filterchat.length])




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

    
    
    e.preventDefault()
  
    await addDoc(useChatref, list).then(() => {
      setreload(relaod+1)
    
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
        <i className='bx bx-arrow-back'></i>Back
        </span>

      </div>
      <div className="chats">
        {filterchat.length!==0 && !chatclear  && filterchat.map((e) => {
          if (e.sender === account) {
            return <span key={e.id} className='right'><Messagebody message={e.message} time={e.time.toString().slice(15,21)} key={e.id} date={e.time.toString().slice(4,15)} /></span>

          }

          return <span key={e.id} className='left'><Messagebody message={e.message} time={e.time.toString().slice(15,21)} key={e.id} date={e.time.toString().slice(4,15)}/></span>
        })}
        

        <div ref={messagesEndRef} />

      </div>
      <div className="message-bar">
        <form action="" className="message-form">
          <input type="text" id='message-text' name="message" onChange={change} placeholder='Type message' />
          <button type='submit' onClick={submitmessage}><i className='bx bx-send'></i></button>
        </form>

      </div>

    </div>
  )
}

export default Chatbox
