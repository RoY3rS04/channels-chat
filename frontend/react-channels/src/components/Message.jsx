import clsx from 'clsx'

import {useUser} from '../context/auth.context'

export default function Message({message}) {
  const user = useUser()
  const isAuthUser = message.sender.id === user.id

  function generateRandomColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    
    return `#${randomColor}`;
  }

  return (
    <div
      className={clsx('flex relative items-end space-x-2', {
        'self-end': isAuthUser,
      })}
    >
      {!isAuthUser && (
        <div className='absolute flex items-center justify-center bottom-[-15px] left-[-15px] rounded-full bg-white h-10 w-10'>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
          {message.sender.name[0]}
        </div>
        </div>
      )}
      <div
        className={clsx('rounded-[20px] p-4', {
          'rounded-bl-none bg-gray-100': !isAuthUser,
          'rounded-br-none text-white bg-[#665dfe]': isAuthUser,
        })}
      >
        {message.message}
      </div>
    </div>
  )
}