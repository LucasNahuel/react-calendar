import React from "react";
import ModalWindow from "../components/ModalWindow";
import WarningNotification from "../components/WarningNotification";

class Registration extends React.Component{
    

    usernameFieldStyle = {'border-color': 'teal'};
    passwordFieldStyle = {'border-color': 'teal'};
    repeatPasswordFieldStyle = {'border-color': 'teal'};

    timeout;

    location;


    constructor(props){
        super(props);


        this.state= {username: '', usernameError: [""], password: '', passwordError: [""], repeatPassword: '', repeatPasswordError: [""], modalWindow : null, warning : null};

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleRepeatPasswordChange = this.handleRepeatPasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleSubmit(event) {
        event.preventDefault();
        
        fetch(process.env.REACT_APP_API_URL+'/register', {
            method: 'POST',
            body: JSON.stringify({
                username : this.state.username,
                password : this.state.password
            }),
            headers: {
                'Content-type': 'application/json',
            },
        }).then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson ? await response.json() : null;
    
            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.value) || response.status;
                return Promise.reject(error);
            }
    
            this.setState({modalWindow : <ModalWindow message="Correctly saved. Proceed to log in." link="/"/>});
        })
        .catch(error => {
            this.setState({warning : <WarningNotification message={error}/>});
        });

        
    }

    handleUsernameChange(event) {

        

        if(event.target.value.length > 3){

            //check if exists in database

            clearTimeout(this.timeout);
            this.timeout = setTimeout(this.checkUsernameExist(event.target.value), 300);

            console.log(this.state.username);

        }else{
            this.setState({username: event.target.value, usernameError: ["username length should be at least 3 characters long"]});
            this.usernameFieldStyle = {'border-color': 'var(--warning-red)'};
        }
    }


    checkUsernameExist(username){
        const headers = { 'Content-Type': 'application/json' }
        fetch(process.env.REACT_APP_API_URL+'/usernameExists/'+username, { method : 'GET', headers : headers})
        .then(async response =>  this.checkUsernameExistsResponse(response, username).catch(
            error => {
                console.log(error);
            }
        ));
    }

    async checkUsernameExistsResponse(response, username) {

        const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson ? await response.json() : null;
    
            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.value) || response.status;
                return Promise.reject(error);
            }

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


                {this.state.warning}

            </div>

            


        );
    }
}

export default Registration;