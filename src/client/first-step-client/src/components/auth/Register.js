import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from 'prop-types';

const Register = ({setAlert, register, isAuthenticated, typeOfUser}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        password2: ''
    })
    const {email, password, password2} = formData;

    const onChange = event => {
        setFormData({...formData, [event.target.name]: event.target.value});
    }

    const onSubmit = event => {
        event.preventDefault();
        if (password !== password2) {
            setAlert("Password Don't Match", 'danger');
        } else {
            register({email, password, typeOfUser});
        }
    }

    if (isAuthenticated) {
        return <Navigate to='/dashboard'/>;
    }
    return (
        <div>
            <h1>Sign Up</h1>
            <p>Create Your Account</p>
            <form onSubmit={event => onSubmit(event)}>
                <div>
                    <input type='text'
                           placeholder='Enter Email'
                           name='email'
                           value={email}
                           onChange={event => onChange(event)}
                           required/>
                </div>
                <div>
                    <input type='password'
                           placeholder='Enter Password'
                           name='password'
                           value={password}
                           onChange={event => onChange(event)}
                           required/>
                </div>
                <div>
                    <input type='password'
                           placeholder='Confirm Password'
                           name='password2'
                           value={password2}
                           onChange={event => onChange(event)}
                           required/>
                </div>
                <input type='submit' value='Register'/>
            </form>
            <p>
                Already have an account? <Link to='/login'>Sign In</Link>
            </p>
        </div>
    )
}
Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    typeOfUser: PropTypes.string.isRequired,
    isAuthenticated: PropTypes.bool
}


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {setAlert, register})(Register);