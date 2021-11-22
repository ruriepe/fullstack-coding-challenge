import React, { Component } from "react";
import { Row, FormGroup, FormControl, ControlLabel, Button, HelpBlock } from 'react-bootstrap';
import './login.sass';
import { isEmail, isEmpty, isLength, isContainWhiteSpace } from 'shared/validator';

class Login extends Component {

    constructor(props) {
        super(props)

        this.state = {
            formData: {}, // Contains login form data
            errors: {}, // Contains login field errors
            formSubmitted: false, // Indicates submit status of login form
            loading: false, // Indicates in progress state of login form
            showPass: false,
            showRegister: false,
            showLogin: true,
            textButton: true,
            emailValue: "",
            shoWellcome: false
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let { formData } = this.state;
        formData[name] = value;

        this.setState({
            formData: formData
        });
    }

    validateEmail = (e) => {

        let errors = {};
        const { formData } = this.state;

        if (isEmpty(formData.email)) {
            errors.email = "Debe ingresar su cuenta de email";
        } else if (!isEmail(formData.email)) {
            errors.email = "Introduzca una cuenta de email válido";
        }

        if (isEmpty(errors)) {
            return true;
        } else {
            return errors;
        }
    }

    validatePass = (e) => {

        let errors = {};
        const { formData } = this.state;

        if (isEmpty(formData.password)) {
            errors.password = "Debe ingresar un password";
        }  else if (isContainWhiteSpace(formData.password)) {
            errors.password = "No puede ingresar espacios en blanco";
        } else if (!isLength(formData.password, { gte: 6, lte: 8, trim: true })) {
            errors.password = "Debe ingresar al menos 8 carateres";
        }

        if (isEmpty(errors)) {
            return true;
        } else {
            return errors;
        }
    }

    validateRegisterForm = (e) => {
        

        let errors = {};
        const { formData } = this.state;

        console.log(formData);

        if (isEmpty(formData.name)) {
            errors.name = "El nombre no puede ir vacio";
        }else if (!isLength(formData.name, { gte: 3, lte: 16, trim: false })) {
            errors.name = "Debe ingresar al menos 3 carateres";
        }

        if (isEmpty(formData.gender)) {
            errors.gender = "El genero no puede ir vacio";
        }

        if (isEmpty(formData.rpassword)) {
            errors.rpassword = "Debe introducir un password";
        }  else if (isContainWhiteSpace(formData.rpassword)) {
            errors.rpassword = "no puede ingresar espacios en blanco";
        } else if (!isLength(formData.rpassword, { gte: 6, lte: 8, trim: true })) {
            errors.rpassword = "Debe ingresar al menos 8 carateres y un caracter especial";
        }

        if (!isEmail(formData.email)) {
            errors.remail = "Introdusca un email valido";
        }

        if (isEmpty(errors)) {
            return true;
        } else {
            return errors;
        }
    }

    login = (e) => {

        e.preventDefault();
        const { formData } = this.state;

        //paso 1 validar email
        if(formData.email != "" && !formData.password){
            //alert("paso 1")
            let errors = this.validateEmail();
            let url = "http://localhost:8000/api/user/"+formData.email;
            if(errors === true){
                fetch(url)
                .then(res => res.json())
                .then(
                    (result) => {
                        if(result.existe == "true"){
                            this.setState({ showPass: true });
                            this.setState({ textButton: false });
                        }else{
                            let errores = {};
                            this.setState({ showLogin: false });
                            this.setState({ showRegister: true });
                            this.setState({ emailValue: formData.email });
                            formData["remail"] = this.state.emailValue;
                            this.setState({
                                formData: formData
                            });
                        }
                    },

                    (error) => {
                        console.log(error)
                    }
                )
            } else {
                this.setState({
                    errors: errors,
                    formSubmitted: true
                });
            }
        }
        //paso 2 validar password
        else if(formData.email != "" && formData.password != ""){
            //alert("paso 2")
            let errors = this.validatePass();
            if(errors === true){
                const recipeUrl = 'http://localhost:8000/api/login';
                const postBody = {
                    email: formData.email,
                    password: formData.password
                };
                const requestMetadata = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postBody)
                };

                    fetch(recipeUrl, requestMetadata)
                    .then(res => res.json())
                    .then(
                        (result) => {
                            if(result.message == "Ok"){
                                this.setState({ shoWellcome: true });
                                this.setState({ showLogin: false });
                                this.setState({ showRegister: false });
                                
                            }else{
                                let errores = {};
                                alert("verifique sus datos de acceso e intente nuevamente");
                                //this.setState({ showLogin: false });
                                //this.setState({ showRegister: true });
                            }
                        },
    
                        (error) => {
                            console.log(error)
                        }
                    )
            } else {
                this.setState({
                    errors: errors,
                    formSubmitted: true
                });
            }
        }
        //ambos están vacio
        else{
            alert("Debe introducir una cuenta de email")
        }   
    }

    register = (e) => {

        e.preventDefault();

        let errors = this.validateRegisterForm();
        const { formData } = this.state;

        if(errors === true){
            const recipeUrl = 'http://localhost:8000/api/register';
            const postBody = {
                name: formData.name,
                last_name: formData.apellido,
                gender: formData.gender,
                email: formData.remail,
                password: formData.rpassword
            };
            const requestMetadata = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postBody)
            };

            fetch(recipeUrl, requestMetadata)
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.registro == "true"){
                        this.setState({ showRegister: false });
                        this.setState({ showLogin: true });
                        this.setState({ textButton: true });
                    }
                },

                (error) => {
                    console.log(error)
                }
            )
        } else {
            this.setState({
                errors: errors,
                formSubmitted: true
            });
        }
    }

    render() {

        const { errors, formSubmitted } = this.state;

        return (
            <div className="Login">
                <Row>
                    <form onSubmit={this.login} style={{display: this.state.showLogin ? 'block' : 'none'}}>
                        <FormGroup controlId="email" validationState={ formSubmitted ? (errors.email ? 'error' : 'success') : null }>
                            <ControlLabel>Email</ControlLabel>
                            <FormControl type="text" name="email" placeholder="Ingrese su email" onChange={this.handleInputChange} />
                        { errors.email &&
                            <HelpBlock>{errors.email}</HelpBlock>
                        }
                        </FormGroup>
                        <FormGroup controlId="password" validationState={ formSubmitted ? (errors.password ? 'error' : 'success') : null } style={{display: this.state.showPass ? 'block' : 'none'}}>
                            <ControlLabel>Password</ControlLabel>
                            <FormControl type="password" name="password" placeholder="ingrese su password" onChange={this.handleInputChange}  />
                        { errors.password &&
                            <HelpBlock>{errors.password}</HelpBlock>
                        }
                        </FormGroup>
                        <Button type="submit" bsStyle="primary">{this.state.textButton ? "Validar" : "Logear"}</Button>
                    </form>

                    <form onSubmit={this.register} style={{display: this.state.showRegister ? 'block' : 'none'}}>
                        <b>Su email no existe, por favor registrese.</b>
                        <FormGroup controlId="name" validationState={ formSubmitted ? (errors.name ? 'error' : 'success') : null }>
                            <ControlLabel>Nombre</ControlLabel>
                            <FormControl type="text" name="name" placeholder="nombre" onChange={this.handleInputChange}/>
                        { errors.nombre &&
                            <HelpBlock>{errors.name}</HelpBlock>
                        }
                        </FormGroup>
                        <FormGroup controlId="apellido" validationState={ formSubmitted ? (errors.apellido ? 'error' : 'success') : null }>
                            <ControlLabel>Apellido</ControlLabel>
                            <FormControl type="text" name="apellido" placeholder="apellido" onChange={this.handleInputChange}/>
                        { errors.apellido &&
                            <HelpBlock>{errors.apellido}</HelpBlock>
                        }
                        </FormGroup>
                        <FormGroup controlId="gender" validationState={ formSubmitted ? (errors.gender ? 'error' : 'success') : null }>
                            <ControlLabel>genero</ControlLabel>
                            <FormControl type="text" name="gender" placeholder="genero" onChange={this.handleInputChange}/>
                        { errors.genero &&
                            <HelpBlock>{errors.gender}</HelpBlock>
                        }
                        </FormGroup>
                        <FormGroup controlId="remail" validationState={ formSubmitted ? (errors.remail ? 'error' : 'success') : null }>
                            <ControlLabel>Email</ControlLabel>
                            <FormControl type="text" name="remail" placeholder="Email" value={this.state.emailValue ? this.state.emailValue : ''}  />
                        { errors.remail &&
                            <HelpBlock>{errors.remail}</HelpBlock>
                        }
                        </FormGroup>
                        <FormGroup controlId="rpassword" validationState={ formSubmitted ? (errors.rpassword ? 'error' : 'success') : null }>
                            <ControlLabel>Password</ControlLabel>
                            <FormControl type="password" name="rpassword" placeholder="Password" onChange={this.handleInputChange}/>
                        { errors.password &&
                            <HelpBlock>{errors.password}</HelpBlock>
                        }
                        </FormGroup>
                        
                        <Button type="submit" bsStyle="primary">Sign-In</Button>
                    </form>

                    <div style={{display: this.state.shoWellcome ? 'block' : 'none'}}>
                        <h2>Bienvenido Usuari@</h2>
                    </div>
                </Row>
            </div>
        )
    }
}

export default Login;