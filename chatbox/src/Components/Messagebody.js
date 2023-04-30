import React from 'react'
import './css/Messagebody.css'

function Messagebody({message,time}) {
  return (
    <div className='message-body-main'>
          <span className="message-body">
                    {message}

          </span>
          <span className="time">
                    {time}

          </span>
      
    </div>
  )
}

export default Messagebody
