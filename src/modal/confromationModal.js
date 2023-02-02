import React, { useState, useEffect } from 'react';
import './style.css';
import { Link, Navigate } from "react-router-dom";

const ConfromationModal = (props)=>{
    const {asRef,chatType} = props;
    const [confoamtionBtn, setConformationBtn] = useState(false);
    const [checkedOurAge, setCheckedOurAge] = useState(false);
    const [checkedTermCondtion, setCheckedTermCondtion] = useState(false);

    const ourAgeHandler = () => {
        setCheckedOurAge(!checkedOurAge);
    };
    const ourTermConditionHandler = () =>{
        setCheckedTermCondtion(!checkedTermCondtion);
    }
    useEffect(() => {
        if(checkedOurAge && checkedTermCondtion){
            setConformationBtn(true)
        } else{
            setConformationBtn(false)
        }
      }, [checkedOurAge,checkedTermCondtion])
    return(
        <div className="common-wrapper d-flex align-items-center justify-content-center position-absolute">
            <div className='conformation-box' ref={asRef}>
                <div className='checkbox-input d-flex align-items-baseline mb-3'>
                    <input type="checkbox" onChange={ourAgeHandler}/>
                    <label className='ms-2'><b>OUR AGE RESTRICTIONS HAVE CHANGED. YOU MUST BE 18 OR OLDER TO USE REACH ALIKE.</b> Persons under the age of 18 may not use Reach Alike. See our updated Terms of Service for more info. <b>By checking the box you acknowledge and represent that you comply with these age restrictions.</b></label>
                </div>
                <div className='checkbox-input d-flex align-items-baseline mb-4'>
                    <input type="checkbox" onChange={ourTermConditionHandler}/>
                    <label className='ms-2'>By checking the box you acknowledge that you have reviewed and agree to be bound by Reach Alike Terms of Service, Privacy Policy, and Community Guidelines.</label>
                </div>
               <Link to={chatType == "Text" ? "/chat": "/audio-chat"}><button className='confirm-btn rounded' style={{opacity: confoamtionBtn ? 1 : 0.5, pointerEvents: confoamtionBtn? 'all':'none'}} >Confirm & Continue</button></Link>
            </div>
        </div>
    )
}
export default ConfromationModal;