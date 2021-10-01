import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

function Signup(props) {
    const host = "http://localhost:5000"
    const [credential, setCredential] = useState({ name: "", email: "", password: "", cpassword: "" })
    let history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = credential;
        const response = await fetch(`${host}/api/auth/creatuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });
        const json = await response.json()
        console.log(json)
        if(json.success){
        localStorage.setItem('token', json.token)
        props.showAlert("Signup successful","success")
        history.push("/")
    } else{
        props.showAlert("invalid credentials","danger")
    }
    }
    const onChange = (e) => {
        setCredential({ ...credential, [e.target.name]: e.target.value })
    }
    return (
        <div className="container mt-2">
            <h2>Create an accout to continue</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" onChange={onChange} name="name" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" onChange={onChange} name="email" aria-describedby="emailHelp" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" onChange={onChange} name="password" minLength={5} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" onChange={onChange} name="cpassword" minLength={5} required/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup
