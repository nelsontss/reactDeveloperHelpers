import React from 'react'
import './Card.sass'

const Card = (props) => {
  return (
    <div className='Card col align-center justify-center'>
      <div className='title col align-center'>
        <div className='title-text'>
          <div className='text-field'>
            SEND ME A MESSAGE!
          </div>
        </div>
        <div className='title-line'>
          <div className='rec'>

          </div>
        </div>
      </div>
      <div className='form'>
        <div className='row-2 row'>
          <div className='email display-flex align-center'>
            <div className='text-field'>
              EMAIL ADRESS
            </div>
          </div>
          <div className='name display-flex align-center'>
            <div className='text-field'>
              NAME
            </div>
          </div>
        </div>
        <div className='row-1 row'>
          <div className='subject display-flex align-center'>
            <div className='text-field'>
              SUBJECT
            </div>
          </div>
          <div className='company display-flex align-center'>
            <div className='text-field'>
              COMPANY/BRAND
            </div>
          </div>
        </div>
        <div className='message display-flex'>
          <div className='text-field'>
            MESSAGE
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
