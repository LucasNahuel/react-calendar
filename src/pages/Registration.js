import React from "react";
class Registration extends React.Component{

    constructor(props){
        super(props);

        this.state= {username: '', usernameError: ["*required"], password: '', passwordError: ["*required"], repeatPassword: '', repeatPasswordError: ["*required"]};

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleRepeatPasswordChange = this.handleRepeatPasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleSubmit(event) {
        alert('A name was submitted: ' + JSON.stringify(this.state));
        event.preventDefault();
    }

    handleUsernameChange(event) {

        console.log(this.state.usernameError.length);
        if(event.target.value.length > 3){
            this.setState({username: event.target.value, usernameError : []});
        }else{
            this.setState({username: event.target.value, usernameError: ["username length should be at least 3 characters long"]});
        }
    }

    handlePasswordChange(event) {
        

        if(event.target.value.length > 7 && event.target.value === this.state.repeatPassword){
            this.setState({password: event.target.value, passwordError : [], repeatPasswordError: []});
        }else{

            if(event.target.value.length <= 7){
                this.setState({password: event.target.value, passwordError: ["password should be at least 8 characters long"]});
            }else{
                this.setState({password: event.target.value, passwordError : ["the paswords doesn't match"], repeatPasswordError: ["the passwords doesn't match"]});
            }



            
        }

        
    }

    handleRepeatPasswordChange(event) {
        

        if(event.target.value.length > 7 && this.state.password === event.target.value){
            this.setState({repeatPassword: event.target.value, passwordError: [], repeatPasswordError: []});
        }else{
            if(event.target.value.length <= 7){
                this.setState({repeatPassword: event.target.value, repeatPasswordError: ["password should be at least 8 characters long"]});
            }else{
                this.setState({repeatPassword: event.target.value, passwordError : ["the passwords doesn't match"], repeatPasswordError: ["the passwords doesn't match"]});
            }
        }

        
    }

    checkFormErrors(){
    }

    


    render(){
        return(
        
            <form onSubmit={this.handleSubmit} className="form">
            <label>
                Username:
                <input type="text" name="username" value={this.state.value} onChange={this.handleUsernameChange} style={{'border-color': this.state.usernameError.length == 0 ? 'lightgreen' : 'rgb(172, 98, 98)'}}/>
                <p className="input-error">{this.state.usernameError}</p>
            </label>

            <label>
                Password:
                <input type="text" name="password" value={this.state.password} onChange={this.handlePasswordChange} style={{'border-color': this.state.passwordError.length == 0 ? 'lightgreen' : 'rgb(172, 98, 98)'}}/>
                <p className="input-error">{this.state.passwordError}</p>
            </label>

            <label>
                Reapeat Password:
                <input type="text" name="repeatPassword" value={this.state.repeatPassword} onChange={this.handleRepeatPasswordChange} style={{'border-color': this.state.repeatPasswordError.length == 0 ? 'lightgreen' : 'rgb(172, 98, 98)'}}/>
                <p className="input-error">{this.state.repeatPasswordError}</p>
            </label>


            <input type="submit" value="Submit" className="submit-button" disabled={this.state.usernameError.length > 0 || this.state.passwordError.length > 0 || this.state.repeatPasswordError.length > 0}/>
            </form>

        );
    }
}

export default Registration;