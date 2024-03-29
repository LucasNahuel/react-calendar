import { render } from "react-dom";
import { useState, setState } from "react";
import { useNavigate } from "react-router-dom";
import WarningNotification from "../components/WarningNotification";
import { Link } from "react-router-dom";

function Login(props){

    const [form, setForm] = useState({
        username: '',
        password: '',
        usernameErrors: [""],
        passwordErrors: [""]
    });

    const [styles, setStyles] = useState({
        usernameFieldStyle : {'borderColor': 'teal'},
        passwordFieldStyle : {'borderColor': 'teal'}
    });

    
    const [notification, setNotification] = useState(null);

    

    const navigate = useNavigate();

    function handleSubmit(ev) {

        ev.preventDefault();
        
        fetch(process.env.REACT_APP_API_URL+'/login/'+form.username.toLowerCase()+"/"+form.password.toLowerCase()).then((response) =>{
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

            console.log("response is ok, data:");
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
            setStyles({...styles, usernameFieldStyle : {'borderColor': 'var(--warning-red)'} });
        }else{
            
            setStyles({...styles, usernameFieldStyle : {'borderColor': 'var(--approved-green)'} });
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
            setStyles({...styles, passwordFieldStyle : {'borderColor': 'var(--warning-red)'} });
        }else{
            
            setStyles({...styles, passwordFieldStyle : {'borderColor': 'var(--approved-green)'} });
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
                        <input value={form.username} type="text" name="username" onChange={e => {setForm(handleUsernameChange(e));}}
                        maxLength={30} style={styles.usernameFieldStyle}/>
                        <div className="input-error">{form.usernameErrors}</div>
                    </label>

                    <label>
                        Password:
                        <input value={form.password} type="password" name="password" maxLength={30}  onChange={e => {setForm(handlePasswordChange(e))}} style={styles.passwordFieldStyle}/>
                        <p className="input-error">{form.passwordErrors.forEach(e=>{return <p>{e.value}</p>})}</p>
                    </label>

                    <div style={{'display': 'flex', 'flexDirection': 'row', 'justifyContent': 'end', 'gap':'1em'}}>
                       <Link className="modal-window-link" to="/register">Sign up</Link>
                       <input style={{'marginLeft':'0'}} type="submit" value="Login" className="submit-button" disabled={ form.passwordErrors.length > 0 || form.usernameErrors.length > 0}/>
                    </div>
            
               </form>

            </div>
            {notification}
        </div>
    );
}

export default Login;