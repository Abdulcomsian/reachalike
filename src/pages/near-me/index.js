import React from "react";

const NearME = (props) => {
    const { nearMeHandler, asRef } = props;
    return (
        <div className="common-wrapper d-flex align-items-center justify-content-center position-absolute">
            <div className="auth-form near-me-form" ref={asRef}>
                <div className="auth-header">
                    <span className="text-end d-block cursor-pointer" onClick={nearMeHandler}>
                        <i class="fa-solid fa-xmark"></i>
                    </span>
                </div>
                <div className="auth-body">
                    <h2 className="text-center fw-bold">Select an option</h2>
                    <div className="near-me-btn-group mt-4">
                        <button className="w-100 mb-3">Worldwide</button>
                        <button className="mb-3">near me</button>
                    </div>
                   <div className="input-select">
                    <select className="rounded w-100">
                        <option value="choose a city">choose a city</option>
                    </select>
                   </div>
                   <button className="my-3">Submit</button>
                </div>
            </div>
        </div>
    )
}
export default NearME;