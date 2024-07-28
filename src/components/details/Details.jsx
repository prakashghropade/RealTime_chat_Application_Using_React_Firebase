import React from 'react'
import './details.css'
import { auth, db } from '../../lib/firebase'
import { useChatStore } from '../../lib/chatStore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { useUserStore } from '../../lib/userStore'

const Details = () => {

  const {chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock} = useChatStore();

  const {currentUser} = useUserStore();

  const  handleBlock = async () => {
        if(!user) return;

        const userDocRef = doc(db, "users", currentUser.id)

        try{
            await updateDoc(userDocRef, {
              blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            })
        }
        catch(error){

        }
  }

  return (
    <div className='details'>
      <div className="user">
        <img src={user?.avatar || "avatar.png"} alt="" />
        <h2>{user?.username}</h2>
      </div>


      <div className="info">

        <div className="option">
          <div className="title">
            <span>Chat setting</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetails">

                <img src="https://th.bing.com/th?id=OIP.YAXlTjvtEKchdMVc5laZhwHaE8&w=306&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" alt="" />
                <span>Photo_2024.png</span>
              </div>
              <img src="./download.png" alt="" className='icon'/>
            </div>
            <div className="photoItem">
              <div className="photoDetails">

                <img src="https://th.bing.com/th?id=OIP.YAXlTjvtEKchdMVc5laZhwHaE8&w=306&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" alt="" />
                <span>Photo_2024.png</span>
              </div>
              <img src="./download.png" alt="" className='icon'/>
            </div>
            <div className="photoItem">
              <div className="photoDetails">

                <img src="https://th.bing.com/th?id=OIP.YAXlTjvtEKchdMVc5laZhwHaE8&w=306&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" alt="" />
                <span>Photo_2024.png</span>
              </div>
              <img src="./download.png" alt="" className='icon'/>
            </div>
            <div className="photoItem">
              <div className="photoDetails">

                <img src="https://th.bing.com/th?id=OIP.YAXlTjvtEKchdMVc5laZhwHaE8&w=306&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" alt="" />
                <span>Photo_2024.png</span>
              </div>
              <img src="./download.png" alt="" className='icon'/>
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={() => handleBlock()}>
        { isCurrentUserBlocked ? "You are Blocked!" : isReceiverBlocked ? "User blocked" : "Block USer"}</button>
        <button className='logout' onClick={() => auth.signOut()}>Logout</button>
      </div>
   

    </div>
  )
}

export default Details
