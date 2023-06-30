import {useEffect, useRef, useState} from 'react'
import {useLoaderData, useParams, useRevalidator} from 'react-router-dom'
import MessageForm from '../components/MessageForm'
import MessageList from '../components/MessageList'
import echo from '../utilities/echo'
import ky from '../utilities/ky'

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

export default function Room() {

  const [unreadedMessages, setUnreadedMessages] = useState(0);

  const { channelId } = useParams();
  const formRef = useRef(null)
  const listRef = useRef(null)
  const {messages} = useLoaderData()
  const revalidator = useRevalidator()

  useEffect(() => {
    const listener = echo
      .channel(`channels.${channelId}`)
      .listen('MessageCreated', revalidator.revalidate)

    formRef.current.reset()
    setUnreadedMessages((prev) => prev);
    console.log(unreadedMessages);
    //listRef.current.scrollTo(0, listRef.current.scrollHeight)

    return () => listener.stopListening('MessageCreated')
  }, [revalidator])

  return (
    <div className="flex flex-1 flex-col overflow-hidden p-4">
        <MessageList messages={messages} ref={listRef} />
        <MessageForm ref={formRef} />
    </div>
  )
}
