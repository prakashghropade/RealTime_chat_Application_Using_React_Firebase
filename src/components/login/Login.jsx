import React, { useEffect, useState } from 'react'
import './login.css'
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import {auth, db} from '../../lib/firebase'
import { doc, setDoc } from 'firebase/firestore';
import upload from '../../lib/upload';

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: ""
  });

  const [loadingr, setLoadingr] = useState(false);
  const [loadingl, setLoadingl] = useState(false);

  const handleAvatar = (e) => {
    if(e?.target?.files[0]){
      setAvatar({
          file: e.target.files[0],
          url: URL.createObjectURL(e.target.files[0])
      })
    }
  }


  const handleRegister = async (e) => {
    e.preventDefault();
    setLoadingr(true);
    const formData = new FormData(e.target);

    console.log("Formdata", formData);

    const {username, email, password} = Object.fromEntries(formData);
    
    try{
      const response = await createUserWithEmailAndPassword(auth, email, password);
      let imageUrl;

         imageUrl = await upload(avatar.file);
        
      

      await setDoc(doc(db, "users", response.user.uid), {
        username,
        email,
        avatar:avatar.file? imageUrl: "",
        id:response.user.uid,
        blocked: [],
        password
      });

      await setDoc(doc(db, "userchats", response.user.uid), {
        chats: [],
      })
       

      toast.success("Account crreated! You can login now");
      const form = e.target;

      const inputs = form.querySelectorAll('input, select, textarea');

            inputs.forEach(input => {
             input.value = '';
          });
      
    }
    catch(error){
           console.log(error);
           toast.error(error.message)
    }
    finally{
      setLoadingr(false);
    }
}

  const handleLogin = async (e) => {
          e.preventDefault();

          setLoadingl(true);
          const formData = new FormData(e.target);

          const {email, password} = Object.fromEntries(formData);
        
          
          try{
            await signInWithEmailAndPassword(auth, email, password);

          }
          catch(error){
              console.log(error);
              toast.error(error.message);
          }
          finally{
            setLoadingl(false)
          }
  }

  useEffect(() => {

  }, [loadingr, loadingl]);


    
  return (
    <div className='login'>
      <div className="item">
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
            <input type="text" name="email" id="" placeholder='Enter your Email'/>
            <input type="password" name="password" id="" placeholder='Enter your password'/>
            <button disabled={loadingl}>{loadingl ? "Loading": "Sign In"}</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
      <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
            <img src={avatar.url || "./avatar.png"} alt="" />
            <label htmlFor='file'>Upload an  image</label>
            <input type="file" name="" id="file" style={{display:'none'}} onChange={handleAvatar}/>
            <input type="text" name="username" id="" placeholder='Enter your UserName'/>
            <input type="text" name="email" id="" placeholder='Enter your Email'/>
            <input type="password" name="password" id="" placeholder='Enter your password'/>
            <button disabled={loadingr}> {loadingr ? "Loading": "Sign Up"}</button>
        </form>
      </div>
    </div>
  )
}

export default Login
