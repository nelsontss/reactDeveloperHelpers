import React from 'react'
import './LoginComponent.sass'
import { useHistory } from "react-router-dom";

const LoginComponent = (props) => {
  const history = useHistory();

  return (
    <div className='LoginComponent col align-center justify-center'>
      <div className='form'>
        <div className='email display-flex align-center'>
          <div className='text-field'>
            username
          </div>
        </div>
        <div className='subject display-flex align-center'>
          <div className='text-field'>
            password
          </div>
        </div>
      </div>
      <div className='button-text display-flex align-center' onClick={() => history.push("/home")}>
        <div className='text-field'>
          Login
        </div>
      </div>
    </div>
  )
}

export default LoginComponent
