import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {

    const history = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function submit(e){

        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:4000/register", {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.status === 200) {
                alert("Registration successful");
            } else {
                alert("Registration failed");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Registration failed. Please try again.");
        }
        
        

    }


  return (
    <>
        <div>Sign Up Page</div>

        <form action="POST">
            <input type="username" onChange={(e) => {setUsername(e.target.value)}} placeholder="Username"></input>
            <input type="password" onChange={(e) => {setPassword(e.target.value)}} placeholder="Password"></input>

            <input type="submit" onClick={submit}/>

        </form>


    </>
  )
}

export default SignUpPage