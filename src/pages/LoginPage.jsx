import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {

    const history = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function submit(e){

        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:4000/login", {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.status === 200) {
                alert("Login successful");
            } else {
                alert("Login failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Login failed. Please try again.");
        }

    }


  return (
    <>
        <div>LoginPage</div>

        <form action="POST">
            <input type="username" onChange={(e) => {setUsername(e.target.value)}} placeholder="Username"></input>
            <input type="password" onChange={(e) => {setPassword(e.target.value)}} placeholder="Password"></input>

            <input type="submit" onClick={submit}/>

        </form>


    </>
  )
}

export default LoginPage