

import { auth, db } from './config'
import { RecaptchaVerifier, signInWithPhoneNumber, signOut } from "firebase/auth";
import { addDoc, getDocs, collection, query, where, or, updateDoc , doc } from 'firebase/firestore';
import Cookies from 'universal-cookie'
import bcrypt from 'bcryptjs'
import axios from 'axios'


import './App.css';
import { useCallback, useEffect, useState } from 'react'
import $ from 'jquery'
import "jquery-ui-dist/jquery-ui";
import Chatbox from './Components/Chatbox';
import logo from './chitchat.png'

function App() {
  //initializing cookies

  const cookie = new Cookies()



  const [userdet, setuserdet] = useState({ userid: "", name: "", number: "" })
  const [room, setroom] = useState({ id: "", member1: "", member2: "" })
  const [roomarr, setroomarr] = useState([])
  const [loading, setloading] = useState(false)

  const [logstatus, setlogstatus] = useState(false)
  const [namereq, setnamereq] = useState(true)
  const[otpstatus,setotpstatus]=useState(true)



  const usersRef = collection(db, "users")
  const useRoom = collection(db, "rooms")


  const [mob, setmob] = useState()
  const [logobject, setlogobject] = useState("")
  const enter_mobile = (e) => {
    
    setmob(e.target.value)

  }

  const [otp, setotp] = useState()
  const enter_otp = (e) => {
    
    setotp(e.target.value)
    setotpstatus(false)

  }

  const setname = (e) => {
    setuserdet({
      ...userdet,
      name: e.target.value


    })

  }







  const setcaptcha = (n) => {
    const recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {}, auth

    );
    recaptchaVerifier.render()
    return signInWithPhoneNumber(auth, "+91 " + mob, recaptchaVerifier).then((res) => {
    
      setlogobject(res)
    }).catch((e) => {
      
    })
  }





  const captchaverify = async (e) => {

    
    e.preventDefault()
    const res = await setcaptcha(mob)





  }


  const verifymobile = () => {

    logobject.confirm(otp).then(async (response) => {
      setuserdet({
        ...userdet,
        userid: response.user.uid,
        number: response.user.phoneNumber,

      })
  
    }).catch((e) => {
    
    })
    setnamereq(false)
  }









  // it eill replace by room db and will be fetchd fro that



  const login = async (e) => {
    e.preventDefault()
    var present = false;
    var userid1 = null;
    var user_changeRef = null

    await getDocs(usersRef).then((res) => {

      res.forEach((doc) => {
        if (doc.data().number === userdet.number) {

          present = true
          userid1 = doc.id
          
          

        }
      })

      if(present){
        user_changeRef = doc(db, "users", userid1);
      console.log(present)

      }
      



    })
    
  
 

    if (present === false) {
      console.log(present)
      
      await addDoc(usersRef, userdet)
      

    }
    else {
      console.log(present)
      await alert("Do you want to Change your Username?")
      updateDoc(user_changeRef,{name:userdet.name})


    }

    await localStorage.setItem('upermitid', mob)


    await setlogstatus(true)
    await $('#details-box,#chatbox').addClass('width')
    const salt = await bcrypt.genSaltSync(10)
    const hash = await bcrypt.hashSync(mob, salt)
    await cookie.set('logtoken', hash)
    













  }
  const [searchbar, setsearchbar] = useState(false)

  const opensearch = () => {
    setsearchbar(true)


  }

  //add member inout value setup

  const [newchat, addnewchat] = useState()
  const setnewchat = (e) => {
    addnewchat(e.target.value)
  }

  //add new member or group in chats

  const addnewchats = async () => {
    var check = false
    var existence = false



    //user sexist or not
    await getDocs(usersRef).then((res) => {

      res.forEach((doc) => {
        if (doc.data().number === "+91" + newchat) {

          existence = true

        }


      })
    })

    //check wheather the user already in message list or not
    await getDocs(useRoom).then(async (res) => {



      res.forEach((doc) => {
        if (doc.data().member2 === mob && doc.data().member1 === newchat) {

          check = true
        
        }
        if(doc.data().member1 === mob && doc.data().member2 === newchat){
          check = true
        

        }

      })
    })



    //
    if (check === false && existence === true) {
      await addDoc(useRoom, { member1: mob, member2: newchat })
      
      setsearchbar(false)
      addnewchat()

    }
    if (check === false && existence === false) {
      alert("User not exist")
      setsearchbar(false)
      addnewchat()
    }
    if (check === true && existence === true) {
      alert("already in your list")
      setsearchbar(false)
      addnewchat()
    }
    // setsearchbar(false)
    //  addnewchat() 




  }




  // log out user and back to home page or login page

  const logout = async () => {
    cookie.remove('logtoken')
    const a = await signOut(auth)
  
    $('#details-box,#chatbox').removeClass('width')
    $('#pop-up-logout').addClass('none')

    await setlogstatus(false)

    await setnamereq(true)

    localStorage.removeItem('upermitid')



  }
 


  const change_room = async (e) => {
    if (e.member1 === localStorage.getItem('upermitid')) {
      await setroom({
        id: e.id,
        member2: e.member2,
        member1: e.member1

      })


    }

    else {
      await setroom({
        id: e.id,
        member2: e.member1,
        member1: e.member2

      })

    }
    if (window.innerWidth <= 500) {
      $('#details-box').addClass('none')


    }

  
  }



  
  const logcheck = async () => {
    const checktk = await cookie.get('logtoken')

    const getnumber = await localStorage.getItem('upermitid')

    if (checktk && getnumber) {
      await setlogstatus(true)
      await setmob(getnumber)
      $('#details-box,#chatbox').addClass('width')
    }






//useEfect functions
  }

  const toggle_popup =async()=>{
    $('#pop-up-logout').toggleClass('none')

  }

  useEffect(()=>{
    let vh = window.innerHeight * 0.01;
  
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  },[])

  useEffect(() => {
    logcheck()
  })








  useEffect(() => {
    if (localStorage.getItem('upermitid') !== undefined) {



      try {
      
        const roomQuery = query(useRoom, or(where('member1', '==', localStorage.getItem('upermitid')), where('member2', '==', localStorage.getItem('upermitid'))))
        getDocs(roomQuery).then((res) => {
          const roomlists = res.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          setroomarr(roomlists)
          

        })

      } catch (error) {
      

      }
    }

  

  }, [logstatus,searchbar])





  return (
    <div className="App">
      <div id="pop-up-logout" className='none'>
        <p>Do you want to log out?</p>
        <span><button id='log-out' onClick={logout}>Logout</button><button id='log-out-false' onClick={toggle_popup}>Cancel</button></span>
      </div>
      <div className="details-box" id='details-box'>
        <nav className="nav">
          <span className='logo'><img src={logo} alt="logo" /></span>

          {!logstatus ? <div></div>
            :
            <div className="navbuttons">

              {searchbar ? <span className='newchatadd'><input type="text" placeholder='search' id='addchat' name='member' onChange={setnewchat} /><button onClick={addnewchats}><i className='bx bxs-message-add'></i></button></span> :
                <p  onClick={opensearch}><i className='bx bxs-message-add'></i>Add new</p>}
              
              <p className='signout' onClick={toggle_popup}>sign out</p>
            </div>}


        </nav>
        <div className="details">
          {!logstatus ?
            <div className="signin-addname">

              <span className="signin">
                <form className="logform" >
                  {otpstatus ? <div><div id='recaptcha-container'></div></div> :<div></div>}
                  {
                    namereq ? <input type="number" className="monile" placeholder='Mobile number' onChange={enter_mobile} /> : <input type="text" className="name" placeholder='username' onChange={setname} />


                  }


                  {namereq ? <button type='submit' onClick={captchaverify}>verify</button> : <button onClick={login} type='submit'>Join</button>}

                </form>
                <form className='otpform'>
                  {
                    namereq ? <input type="number" className="otp" placeholder='Enter otp' onChange={enter_otp} /> : <></>


                  }
                  {namereq ? <button onClick={verifymobile} type='submit'>submit</button> : <></>}</form>


              </span>

              <span id="message">
                <p>Chit-chat is a messaging app where you can send message to other user.
                </p>
                <p>1. Enter your mobile number and otp</p>
                <p>2. Enter your name</p>
                <p>3. Click on the add new (Navigation bar)to add new chat and enter the mobile number that you want to add.</p>
                <p>*important - If you get an otp then don't click on 'I am not robot' again. </p>
              </span>


            </div> :
            <div className="chatdetails">

              {
                roomarr.map((e) => {
                  if (e.member1 === mob) {
                    return <span key={e.id} onClick={() => change_room(e)}>{e.member2}</span>
                  }
                  return <span key={e.id} onClick={() => change_room(e)}>{e.member1}</span>
                })

              }




            </div>



          }


        </div>



      </div>
      <div className="chatbox" id='chatbox'>
        

        {
          (roomarr.length === 0 || room.id==='') ? <div className="chatroommessage">
            <p>Star Your Chat with</p>
            <p className="b">Chitchat</p>
          </div>

            :
            <div className="chats"><Chatbox room={room.id} name={room.member2} account={room.member1} /></div>


        }



      </div>

    </div>
  );
}

export default App;