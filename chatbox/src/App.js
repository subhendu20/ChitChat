

import { auth, db } from './config'
import { RecaptchaVerifier, signInWithPhoneNumber, signOut } from "firebase/auth";
import { addDoc, getDocs, collection,query,where,or } from 'firebase/firestore';
import Cookies from 'universal-cookie'
import bcrypt from 'bcryptjs'



import './App.css';
import { useEffect, useState } from 'react'
import $ from 'jquery'
import "jquery-ui-dist/jquery-ui";
import Chatbox from './Components/Chatbox';

function App() {
  //initializing cookies

  const cookie = new Cookies()



  const [userdet, setuserdet] = useState({ userid: "", name: "", number: "" })
  const [room, setroom] = useState({ id: "", member1: "", member2: "" })
  const [roomarr, setroomarr] = useState([])
  const[loading,setloading]=useState(false)

  const [logstatus, setlogstatus] = useState(false)
  const [namereq, setnamereq] = useState(true)



  const usersRef = collection(db, "users")
  const useRoom = collection(db, "rooms")


  const [mob, setmob] = useState()
  const [logobject, setlogobject] = useState("")
  const enter_mobile = (e) => {
    console.log(mob)
    setmob(e.target.value)

  }

  const [otp, setotp] = useState()
  const enter_otp = (e) => {
    console.log(otp)
    setotp(e.target.value)

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
      console.log(res)
      setlogobject(res)
    }).catch((e) => {
      console.log(e)
    })
  }





  const captchaverify = async (e) => {

    console.log("clicking")
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
      console.log(response)
    }).catch((e) => {
      console.log(e)
    })
    setnamereq(false)
  }









  // it eill replace by room db and will be fetchd fro that
  


  const login = async (e) => {
    e.preventDefault()
    var present = false;

    await getDocs(usersRef).then((res) => {
      
      res.forEach((doc) => {
        if (doc.data().name === userdet.name) {

          present = true
        
        }
      })

      
     
    })

    if(present===false){
      console.log(userdet)
      await addDoc(usersRef, userdet)
      await setuserdet({ userid: "", name: "", number: "" })
     
    }
    else{
      alert("username exists")
     
    }
    
    
    await setlogstatus(true)
    await $('#details-box,#chatbox').addClass('width')
    const salt = await bcrypt.genSaltSync(10)
    const hash = await bcrypt.hashSync(mob,salt)
    await cookie.set('logtoken',hash)
    localStorage.setItem('upermitid',mob)
   
    


    






    
   
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

  const addnewchats = async() => {
    var check =false
    var existence = false



//user sexist or not
    await getDocs(usersRef).then((res) => {
      
      res.forEach((doc) => {
        if (doc.data().number === "+91"+newchat) {
    
          existence = true
        
        }
        
    
      })
    })

//check wheather the user already in message list or not
    await getDocs(useRoom).then(async(res) => {

      
      
       res.forEach((doc) => {
        if(doc.data().member2===mob && doc.data().member1===newchat){

          check = true
          console.log("hochhe")
        }
        
      })
})



//
    if(check===false && existence===true){
      await addDoc(useRoom,{member1:mob,member2:newchat})
      console.log({member1:mob,member2:newchat})
      setsearchbar(false)
      addnewchat()

    }
    if(check===false && existence===false){
      alert("User not exist")
      setsearchbar(false)
      addnewchat()
    }
    if(check===true && existence===true){
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
    console.log(a)
    $('#details-box,#chatbox').removeClass('width')
   
    await setlogstatus(false)

    await setnamereq(true)

    localStorage.removeItem('upermitid')



  }
  const bring_detailsbox=()=>{
    $('#details-box').removeClass('none')
  }


  const change_room = async(e) => {
    if(e.member1===mob){
      await setroom({
        id: e.id,
        member2: e.member2,
        member1: e.member1
  
      })
      

    }
    
    else{
      await setroom({
        id: e.id,
        member2: e.member1,
        member1: e.member2
  
      })

    }
    if(window.innerWidth <= 500){
      $('#details-box').addClass('none')
     

    }
    
    console.log(room)
  }

  

  //useEfect functions
  const logcheck =async()=>{
    const checktk = await cookie.get('logtoken') 
   
    const getnumber=await localStorage.getItem('upermitid')
     
        if(checktk && getnumber){
          await setlogstatus(true)
          await setmob(getnumber)
          $('#details-box,#chatbox').addClass('width')
        }
    

    
    



  }

  useEffect(()=>{
    logcheck()
  })
  

  

  useEffect(()=>{
    
  
      
      
  
      
    
   

    if(mob!==undefined){
      setloading(true)
      var roomlist=[]
     
      const roomQuery = query(useRoom,or( where('member1','==',mob), where('member2','==',mob)))
      getDocs(roomQuery).then((res) => {
        res.forEach((doc)=>{
          roomlist.push({...doc.data(),id:doc.id})
  
        })
       
        setroomarr(roomlist)
       setloading(false)
     
      })
      
       
      
    }
    return ()=>{
      if(mob!==undefined){  const roomQuery = query(useRoom,or( where('member1','==',mob), where('member2','==',mob)))
      getDocs(roomQuery)}
    

    }
    


    
  },[mob,useRoom])

  


  
  return (
    <div className="App">
      <div className="details-box" id='details-box'>
        <nav className="nav">
          <span className='logo'>LOGO</span>

          {!logstatus ? <div></div>
            :
            <div className="navbuttons">

              {searchbar ? <span className='newchatadd'><input type="text" placeholder='search' id='addchat' name='member' onChange={setnewchat} /><button onClick={addnewchats}> Add</button></span> :
                <p><i class='bx bxs-message-add' onClick={opensearch}></i></p>}
              <p>menu</p>
              <p className='signout' onClick={logout}>sign out</p>
            </div>}


        </nav>
        <div className="details">
          {!logstatus ?
            <div className="signin-addname">

              <span className="signin">
                <form className="logform" >
                  {namereq ? <div id='recaptcha-container'></div> : <div></div>}
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


            </div> :
            <div className="chatdetails">

              {
                roomarr.map((e) => {
                  if(e.member1===mob){
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
        <div className="top-chat-bar">
          <span onClick={bring_detailsbox}>Back</span>
        </div>

        {
          (roomarr.length === 0) ? <div className="chatroommessage">
            <p>Star Your Chat</p>
            <p className="b">ChatBox</p>
          </div>

            :
            <div className="chats"><Chatbox room={room.id} name={room.member2} account={room.member1} /></div>
            

        }



      </div>

    </div>
  );
}

export default App;
