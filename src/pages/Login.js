import { render } from "react-dom";
import { useState, setState } from "react";
import { useNavigate } from "react-router-dom";

function Login(props){

    const [form, setForm] = useState({
        username: '',
        password: '',
        usernameErrors: ["*required"],
        passwordErrors: ["*required"]
    });

    const [styles, setStyles] = useState({
        usernameFieldStyle : {'border-color': 'teal'},
        passwordFieldStyle : {'border-color': 'teal'}
    });

    

    const navigate = useNavigate();

    function handleSubmit(ev) {
        fetch('http://localhost:4200/login/'+form.username+"/"+form.password).then((response) => response.json())
        .then((data) => {
            console.log(data);

            if(data.valid == true){
                //login valid, save user into localStorage and redirect to home
                localStorage.setItem("username", data.username);
                localStorage.setItem("password", data.password);
                navigate("/home");
            }else{
                //login invalid, show error message
            }
        })
        .catch((err) => {
            console.log(err.value);
        });

        ev.preventDefault();
    }

    function handleUsernameChange(ev){

        let errors = [];

        if(ev.target.value.length < 3){
            errors.push("name should be at least 3 characters long");
        }

        return { ...form, username: ev.target.value, usernameErrors : errors }
    }

    return(
        <div className="login-root">
            <div className="login-card">

                <form onSubmit={handleSubmit } className="form">

                    <h2>Login</h2>

                    <label>
                        Username:
                        <input type="text" name="username" onChange={e => {setForm(handleUsernameChange(e));}}
                        maxLength={30} style={styles.usernameFieldStyle}/>
                        <div className="input-error">{form.usernameErrors}</div>
                    </label>

                    <label>
                        Password:
                        <input type="text" name="password" maxLength={30}  onChange={e => {setForm({...form, password: e.target.value});}} style={styles.passwordFieldStyle}/>
                        <p className="input-error">{form.passwordErrors.forEach(e=>{return <p>{e.value}</p>})}</p>
                    </label>

                    <input type="submit" value="Login" className="submit-button"/>
                </form>

            </div>
        </div>
    );
}

export default Login;