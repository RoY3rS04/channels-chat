import {createContext, useContext, useEffect, useRef, useState} from 'react'
import {useLoaderData, useParams, useRevalidator} from 'react-router-dom'
import MessageForm from '../components/MessageForm'
import MessageList from '../components/MessageList'
import echo from '../utilities/echo'
import ky from '../utilities/ky'
import { ChannelContext } from './App'
import clsx from 'clsx'

export async function action({params, request}) {
  
  const formData = await request.formData()

  await ky
    .post('messages', {
      json: {
        message: formData.get('message'),
        channel_id: params.channelId,
      },
    })
    .json()

  return {}
}

export async function loader({params}) {
  const messages = await ky.get(`channels/${params.channelId}`).json()

  //console.log(messages);

  return {
    messages,
  }
}

export const UnreadedContext = createContext();

export default function Room({ user }) {

  const { channelId } = useParams();
  const [unreadedMessages, setUnreadedMessages] = useState(
    isNaN(parseInt(localStorage.getItem(`unreadedMessages.${channelId}`)))
      ? 0
      : parseInt(localStorage.getItem(`unreadedMessages.${channelId}`))
  );

  const channels = useContext(ChannelContext);

  const formRef = useRef(null)
  const listRef = useRef(null)
  const { messages } = useLoaderData()
  const revalidator = useRevalidator()

  const [searchedMessages, setSearchedMessages] = useState(messages);

  let actualChannel = channels.find((channel) => channel.id === parseInt(channelId));

  useEffect(() => {
    const listener = echo
      .channel(`channels.${channelId}`)
      .listen('MessageCreated', () => {

        const unreaded = document.querySelector('.unreaded');

        if (listRef.current.scrollHeight - 40 > listRef.current.scrollTop) {
          unreaded.style.opacity = '1';
          unreaded.style.pointerEvents = 'auto';
        }

        setUnreadedMessages((prev) => prev + 1);

        localStorage.setItem(`unreadedMessages.${channelId}`, unreadedMessages + 1);

        revalidator.revalidate();
      })
    
    formRef.current.reset()
    //
    //

    return () => listener.stopListening('MessageCreated')
  
  }, [revalidator])

  function handleInputMessages(e) {
    setSearchedMessages(messages.filter((message) => {
      return message.message.trim().split(' ').filter(
        (letter) => letter !== '').join('').toLowerCase()
        .includes(e.target.value.trim().split(' ').filter(
        (letter) => letter !== '').join('').toLowerCase());
    }));
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className='flex justify-between self-center w-[90%] items-center'>
        <h2 className='flex h-12 items-center justify-center border-b border-gray-100 text-xl font-semibold'>{actualChannel?.name}</h2>
        <div className='relative self-center flex items-center justify-center'>
              <input onChange={handleInputMessages} type="text" placeholder='Search for a message' className='px-3 py-1 border-gray-400 w-full border-[1px] rounded-md mt-[20px]' />
              <svg className='absolute right-2 top-[52.5%]' xmlns="http://www.w3.org/2000/svg" fill='#d2d3d7' height="1em" viewBox="0 0 512 512">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </div>
      </div>
      <div className="relative flex flex-1 flex-col overflow-hidden p-4">
        <UnreadedContext.Provider value={unreadedMessages}>
            <MessageList messages={searchedMessages} ref={listRef} />
            <MessageForm ref={formRef} />
        </UnreadedContext.Provider>
        <button className={clsx('absolute top-0 opacity-0 pointer-events-none left-[38%] unreaded px-2 py-1 text-white bg-[#665dfe] rounded-md transition-[opacity] duration-500', {
          'opacity-100 pointer-events-auto' : localStorage.getItem(`unreadedMessages.${channelId}`) > 0
        })} onClick={(e) => {
          setUnreadedMessages(0);
          listRef.current.scrollTo(0, listRef.current.scrollHeight);
          e.target.style.opacity = '0';
          e.target.style.pointerEvents = 'none';

          localStorage.setItem(`unreadedMessages.${channelId}`, 0);
        }} type='button'>{`You have ${localStorage.getItem(`unreadedMessages.${channelId}`) ?? unreadedMessages} unreaded messages`}</button>
      </div>
    </div>
  )
}
