import React, { useState } from 'react'
import './addUser.css'
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useUserStore } from '../../lib/userStore';

const Adduser = () => {

    const [user, setUser] = useState(null);

    const { currentUser } = useUserStore();

    const handleSearch = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const { username } = Object.fromEntries(formData);

        try {
            const userRef = collection(db, "users");

            const q = query(userRef, where("username", "==", username));
            const querySnapShot = await getDocs(q);

            if (!querySnapShot.empty) {
                setUser(querySnapShot.docs[0].data());
            }


        }
        catch (error) {
            console.log(error);
        }
    }

    const handleAdd = async () => {

        const chatRef = collection(db, "chats");
        const userchatRef = collection(db, "userchats");

        try {
            const newChatRef = doc(chatRef);

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: [],
            });

            await updateDoc(doc(userchatRef, user.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: currentUser.id,
                    updatedAt: Date.now(),
                })


            });
            console.log("userid", user.id);
            console.log("current id", currentUser.id);

            await updateDoc(doc(userchatRef, currentUser.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: user.id,
                    updatedAt: Date.now(),
                })
            });

        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='adduser'>
            <form onSubmit={handleSearch}>
                <input type="text" placeholder='Username' name='username' />
                <button>Search</button>
            </form>
            {user && <div className="user">
                <div className="details">
                    <img src={user.avatar || "./avatar.png"} alt="" />
                    <span>{user.username}</span>
                </div>
                <button onClick={handleAdd}>Add Users</button>

            </div>
            }
        </div>

    )
}

export default Adduser
