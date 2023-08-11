import React from 'react'
import './css/Messagebody.css'

function Messagebody({message,time,date}) {
  return (
    <div className='message-body-main'>
          <span className="message-body">
                    {message}

          </span>
          <span className="time">
                    {date}  {time}

          </span>
      
    </div>
  )
}

export default Messagebody
