import React from "react";

const Register = (props) => {
    const { registerHandler, loginHandler,asRef } = props;
    return (
        <div className="common-wrapper d-flex align-items-center justify-content-center position-absolute">
            <div className="auth-form" ref={asRef}>
                <div className="auth-header">
                    <span className="text-end d-block cursor-pointer" onClick={registerHandler}>
                        <i class="fa-solid fa-xmark"></i>
                    </span>
                </div>
                <div className="auth-body">
                    <h2 className="text-center fw-bold mb-4">Signup</h2>
                    <div className="input-div mb-3">
                        <label className="mb-2 fw-bold">Username</label>
                        <input className="common-input" />
                    </div>
                    <div className="input-div mb-3">
                        <label className="mb-2 fw-bold">Create Password</label>
                        <input className="common-input" type="password" />
                    </div>
                    <div className="input-div mb-3">
                        <label className="mb-2 fw-bold">Confirm Password</label>
                        <input className="common-input" type="password" />
                    </div>
                    <button className="my-3">Submit</button>
                    <p className="text-center bottom-para">Already member ?
                        <a className="fw-bold cursor-pointer" onClick={loginHandler}> Sign in</a>
                    </p>
                </div>
            </div>
        </div>
    )
}
export default Register;