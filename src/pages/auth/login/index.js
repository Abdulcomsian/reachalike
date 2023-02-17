import React from "react";
import { connect } from "react-redux";
import { authLogin } from "../../../store/actions";

const Login = (props) => {
    const { loginHandler, registerHandler, asRef, state, dispatch } = props;
    return (
        <div className="common-wrapper d-flex align-items-center justify-content-center position-absolute">
            <div className="auth-form" ref={asRef}>
                <div className="auth-header">
                    <span className="text-end d-block cursor-pointer" onClick={loginHandler}>
                        <i class="fa-solid fa-xmark"></i>
                    </span>
                </div>
                <div className="auth-body">
                    <h2 className="text-center fw-bold">Login</h2>
                    <p className="text-center my-4" >You are not connected, please login or register for better matches</p>
                    <div className="input-div mb-3">
                        <label className="mb-2 fw-bold">Username</label>
                        <input placeholder="John.doe@gmail.com" className="common-input" />
                    </div>
                    <div className="input-div mb-3">
                        <label className="mb-2 fw-bold">Password</label>
                        <input className="common-input" type="password" />
                    </div>
                    <p className="text-end">
                        <a>Forgot Password?</a>
                    </p>
                    <button className="my-3" onClick={() => dispatch(authLogin(state))}>Submit</button>
                    <p className="text-center bottom-para"> Already member ? <a className="fw-bold cursor-pointer" onClick={registerHandler}>Signup</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    state: state
});

// const mapDispatchToProps = dispatch => ({
//     increment: () => dispatch({ type: 'AUTH_LOGIN' })
// });


export default connect(mapStateToProps)(Login);