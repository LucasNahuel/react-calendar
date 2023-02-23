import { render } from "react-dom";
import { useState, setState } from "react";
import { useNavigate } from "react-router-dom";
import WarningNotification from "../components/WarningNotification";

function Login(props){

    const [form, setForm] = useState({
        username: '',
        password: '',
        usernameErrors: [""],
        passwordErrors: [""]
    });

    const [styles, setStyles] = useState({
        usernameFieldStyle : {'border-color': 'teal'},
        passwordFieldStyle : {'border-color': 'teal'}
    });

    
    const [notification, setNotification] = useState(null);

    

    const navigate = useNavigate();

    function handleSubmit(ev) {
        fetch('http://localhost:4200/login/'+form.username.toLowerCase()+"/"+form.password.toLowerCase()).then((response) =>{
            console.log(response);
             if(response.ok == true){
                return response.json();
             }else{
                if(response.status == 401){

                    setNotification(<WarningNotification message="username or password incorrect, please retry."/>)
                }
             }
            })
        .then((data) => {

            
            console.log(data);

            if(data.valid == true){

                //login valid, save user into localStorage and redirect to home
                localStorage.setItem("username", data.username);
                localStorage.setItem("password", data.password);
                navigate("/home");
            }
        })
        .catch((err) => {
            console.log(err.value);
        });

        ev.preventDefault();
    }

    function handleUsernameChange(ev){

        ev.preventDefault();

        let errors = [];

        if(ev.target.value.length == 0){
            errors.push("required");
        }

        if(ev.target.value.length < 3){
            errors.push("name should be at least 3 characters long");
        }

        if(errors.length > 0){
            setStyles({...styles, usernameFieldStyle : {'border-color': 'var(--warning-red)'} });
        }else{
            
            setStyles({...styles, usernameFieldStyle : {'border-color': 'var(--approved-green)'} });
        }

        return { ...form, username: ev.target.value, usernameErrors : errors }
    }


    function handlePasswordChange(ev){

        ev.preventDefault();

        let errors = [];

        if(ev.target.value.length == 0){
            errors.push("required");
        }
        
        if(ev.target.value.length < 3 ){
            errors.push("password should be at least 3 characters long");
        }

        if(errors.length > 0){
            setStyles({...styles, passwordFieldStyle : {'border-color': 'var(--warning-red)'} });
        }else{
            
            setStyles({...styles, passwordFieldStyle : {'border-color': 'var(--approved-green)'} });
        }

        return { ...form, password: ev.target.value, passwordErrors : errors }

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
                        <input type="password" name="password" maxLength={30}  onChange={e => {setForm(handlePasswordChange(e))}} style={styles.passwordFieldStyle}/>
                        <p className="input-error">{form.passwordErrors.forEach(e=>{return <p>{e.value}</p>})}</p>
                    </label>

                    <input type="submit" value="Login" className="submit-button" disabled={ form.passwordErrors.length > 0 || form.usernameErrors.length > 0}/>
                </form>

            </div>
            {notification}
        </div>
    );
}

export default Login;