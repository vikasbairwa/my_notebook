import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

function Login(props) {
    const host = "http://localhost:5000"
    const [credential, setCredential] = useState({email:"", password:""})
    let history = useHistory();
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: credential.email, password:credential.password})
          });
          const json = await response.json()
          console.log(json)
          if(json.success){
              //redirect
              localStorage.setItem('token', json.token)
              props.showAlert("Login successful","success")
              history.push("/")
          } else{
            props.showAlert("invalid details","danger")
          }
    }
    const onChange=(e)=>{
        setCredential({...credential, [e.target.name]: e.target.value})
    }

    return (
        <div className="container">
            <h2>Login to continue</h2>
        <form onSubmit={handleSubmit}>
  <div className="my-3">
    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" value={credential.email} onChange={onChange} name="email" aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
    <input type="password" name="password" value={credential.password} onChange={onChange} className="form-control" id="password"/>
  </div>
  <button type="submit" className="btn btn-primary" >Submit</button>
</form>
</div>
    )
}

export default Login
