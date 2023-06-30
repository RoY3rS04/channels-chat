import { Link } from 'react-router-dom'
import { useUser } from '../context/auth.context';
import clsx from 'clsx';

export default function Channel({channel}) {

    const lastMessage = channel.messages[channel.messages.length - 1];

    const user = useUser();

    const senderUser =
        (lastMessage?.sender.name === user.name)
            ? 'You' : lastMessage?.sender.name;

    return (
        <Link to={`/channels/${channel.id}`} className="flex w-full px-3 py-2 items-center gap-x-2 border-[1.5px] border-gray-200 rounded-md transition-[border] duration-300 hover:border-[#827ded]">
            <div className="flex justify-center items-center rounded-full h-[50px] font-bold text-white w-[50px] bg-[#665dfe]">{channel.name[0]}</div>
            <div className="flex flex-col flex-1">
                <p className="font-semibold text-[14px]">{channel.name}</p>
                <p className='text-[13px]'>
                    {`
                    ${(senderUser ?? '') ? senderUser + ':' : ''}
                      ${lastMessage?.message ?? 'There are no messages yet'}
                    `}
                </p>
            </div>
        </Link>
    )
}