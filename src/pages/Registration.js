import React from "react";
import ModalWindow from "../components/ModalWindow";

class Registration extends React.Component{
    

    usernameFieldStyle = {'border-color': 'teal'};
    passwordFieldStyle = {'border-color': 'teal'};
    repeatPasswordFieldStyle = {'border-color': 'teal'};

    timeout;

    location;


    constructor(props){
        super(props);


        this.state= {username: '', usernameError: ["*required"], password: '', passwordError: ["*required"], repeatPassword: '', repeatPasswordError: ["*required"], modalWindow : null};

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleRepeatPasswordChange = this.handleRepeatPasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleSubmit(event) {
        fetch('https://node-calendar-api.vercel.app/register', {
            method: 'POST',
            body: JSON.stringify({
                username : this.state.username,
                password : this.state.password
            }),
            headers: {
                'Content-type': 'application/json',
            },
        }).then((response) => response.json())
        .then((data) => {
            console.log(data);

            //save authentication data into localhost and redirect to home

            this.setState({modalWindow : <ModalWindow message="Registration completed, now proceed to log in" link="/"/> });


        })
        .catch((err) => {
            console.log(err.value);
        });

        event.preventDefault();
    }

    handleUsernameChange(event) {

        

        if(event.target.value.length > 3){

            //check if exists in database

            clearTimeout(this.timeout);
            this.timeout = setTimeout(this.checkUsernameExist(event.target.value), 3000);

            console.log(this.state.username);

        }else{
            this.setState({username: event.target.value, usernameError: ["username length should be at least 3 characters long"]});
            this.usernameFieldStyle = {'border-color': 'var(--warning-red)'};
        }
    }


    checkUsernameExist(username){
        const headers = { 'Content-Type': 'application/json' }
        fetch('http://localhost:4200/usernameExists/'+username, {headers})
        .then(response =>  this.checkUsernameExistsResponse(response, username));
    }

    async checkUsernameExistsResponse(response, username){
        let data = await response.json();

        if(data.value == true){

            this.setState({username: username, usernameError : ["this username is already taken"]});
            this.usernameFieldStyle = {'border-color': 'var(--warning-red)'};

        }else if(data.value == false){
            this.setState({username: username, usernameError : []});
            this.usernameFieldStyle = {'border-color': 'var(--approved-green)'};
        }
    }

    handlePasswordChange(event) {
        

        if(event.target.value.length > 7 && event.target.value === this.state.repeatPassword){
            this.setState({password: event.target.value, passwordError : [], repeatPasswordError: []});
            this.passwordFieldStyle = {'border-color': 'var(--approved-green)'};
            this.repeatPasswordFieldStyle = {'border-color': 'var(--approved-green)'};
        }else{

            if(event.target.value.length <= 7){
                this.setState({password: event.target.value, passwordError: ["password should be at least 8 characters long"]});
            }else{
                this.setState({password: event.target.value, passwordError : ["the paswords doesn't match"], repeatPasswordError: ["the passwords doesn't match"]});
            }

            this.passwordFieldStyle = {'border-color': 'var(--warning-red)'};



            
        }

        
    }

    handleRepeatPasswordChange(event) {
        

        if(event.target.value.length > 7 && this.state.password === event.target.value){
            this.setState({repeatPassword: event.target.value, passwordError: [], repeatPasswordError: []});
            this.passwordFieldStyle = {'border-color': 'var(--approved-green)'};
            this.repeatPasswordFieldStyle = {'border-color': 'var(--approved-green)'};
        }else{
            if(event.target.value.length <= 7){
                this.setState({repeatPassword: event.target.value, repeatPasswordError: ["password should be at least 8 characters long"]});
            }else{
                this.setState({repeatPassword: event.target.value, passwordError : ["the passwords doesn't match"], repeatPasswordError: ["the passwords doesn't match"]});
                this.passwordFieldStyle = {'border-color': 'var(--warning-red)'};
            }

            this.repeatPasswordFieldStyle = {'border-color': 'var(--warning-red)'};
        }

        
    }

    

    


    render(){

        return(

            <div className="register-root">

                {this.state.modalWindow}

                <form onSubmit={this.handleSubmit} className="form">

                    <h2>Register</h2>
                        
                    <label>
                        Username:
                        <input type="text" name="username" value={this.state.value} onChange={this.handleUsernameChange} style={this.usernameFieldStyle} maxLength={30}/>
                        <p className="input-error">{this.state.usernameError}</p>
                    </label>

                    <label>
                        Password:
                        <input type="text" name="password" maxLength={30} value={this.state.password} onChange={this.handlePasswordChange} style={this.passwordFieldStyle}/>
                        <p className="input-error">{this.state.passwordError}</p>
                    </label>

                    <label>
                        Reapeat Password:
                        <input type="text" name="repeatPassword" maxLength={30} value={this.state.repeatPassword} onChange={this.handleRepeatPasswordChange} style={this.repeatPasswordFieldStyle}/>
                        <p className="input-error">{this.state.repeatPasswordError}</p>
                    </label>


                    <input type="submit" value="Submit" className="submit-button" disabled={this.state.usernameError.length > 0 || this.state.passwordError.length > 0 || this.state.repeatPasswordError.length > 0}/>
                    
                </form>

            </div>

            


        );
    }
}

export default Registration;