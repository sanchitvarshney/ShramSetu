import React from 'react'
import InvitationCard from '../reusable/InvitationCard'

const MailInvitationPage:React.FC = () => {
  return (
    <div className='grid grid-cols-4 gap-[30px] p-[20px] '  >
      {
        Array.from({length:12}).map((_,i)=><InvitationCard key={i}/>)
      }
    </div>
  )
}

export default MailInvitationPage
