import React, { useEffect, useState } from 'react'
import './css/Chatbox.css'
import Messagebody from './Messagebody'
import $ from 'jquery'
import "jquery-ui-dist/jquery-ui";
import {  db } from '../config'
import { addDoc, getDocs, collection,query,where } from 'firebase/firestore';

function Chatbox({ room, name,account }) {

  // collectio references

  const useChatref = collection(db,'Chats')






  // all usefull states
  

  const [list, setlist] = useState({  roomid:"",
    message:"",
    time: "",
    sender:""})


  const [filterchat, setfilterchat] = useState([])










// getchats external function to get fetch dta from db
const getchats = async()=>{
  
  const chatQuery = await query(useChatref,where('roomid','==',room))
  await getDocs(chatQuery).then((res)=>{
    res.forEach((doc)=>{
      var data={...doc.data(),id:doc.id}
      setfilterchat(e=>({...e,data}))
    })
   


  })

}





// useeffects
  useEffect(() => {
    getchats()

    
  })




  // event handler functions
  const change = (e) => {
    setlist({
      roomid: room,
      message: e.target.value,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      sender:account
      
    })
    
  }
  const submitmessage = async(e) => {
    e.preventDefault()
    console.log(filterchat)
    await addDoc(useChatref,list).then(()=>{
      console.log("stored")
      $('#message-text').val('')
      setlist({  roomid:"",
      message:"",
      time: "",
      sender:""})

    })
  

   

  }




  return (
    <div className='chats-components'>
      <div className="title-bar">
        <span>{name}</span>
        <span></span>

      </div>
      <div className="chats">
        {filterchat.map((e) => {
          if(e.sender===account){
            return <span className='right'><Messagebody message={e.message} time={e.time} /></span>

          }

          return <span className='left'><Messagebody message={e.message} time={e.time} /></span>
        })}

      </div>
      <div className="message-bar">
        <form action="" className="message-form">
          <input type="text" id='message-text' name="message" onChange={change} />
          <button type='submit' onClick={submitmessage}><i class='bx bx-send'></i></button>
        </form>

      </div>

    </div>
  )
}

export default Chatbox
