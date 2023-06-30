import {Outlet, redirect, useLoaderData, useRevalidator} from 'react-router-dom'

import ChannelList from '../components/ChannelList'
import {AuthContext} from '../context/auth.context'
import ky from '../utilities/ky'
import { createContext, useState } from 'react'

export async function loader() {
  try {
    const user = await ky.get('user').json()
    const channels = await ky.get('channels').json()

      //channels.forEach((i) => console.log(i))

    return {
      user,
      channels
    }
  } catch (err) {
    if (err.response.status === 401) {
      return redirect('/login')
    }
  }
}

export const ChannelContext = createContext();

export default function App() {

  const { user, channels } = useLoaderData();

  const [searchedChannels, setSearchedChannels] = useState(channels);

  function handleLogout() {
    localStorage.removeItem('token')

    window.location.reload()
  }
  
  function handleInputChange(e) {
    setSearchedChannels(channels.filter((channel) => {
      return channel.name.trim().split(' ').filter(
        (letter) => letter !== '').join('').toLowerCase()
        .includes(e.target.value.trim().split(' ').filter(
        (letter) => letter !== '').join('').toLowerCase());
    }));
    //console.log(searchedChannels);
  }

    return (
        <AuthContext.Provider value={user}>
      <div className="flex h-screen">
        <div className="flex w-[420px] flex-col border border-gray-100">
          <h2 className="flex h-12 items-center justify-center border-b border-gray-100 text-xl font-semibold">
            Channels
            </h2>
            <div className='relative w-[50%] self-center flex items-center justify-center'>
              <input onChange={handleInputChange} type="text" placeholder='Search channels' className='px-3 py-1 border-gray-400 border-[1px] rounded-md mt-[20px]' />
              <svg className='absolute right-2 top-[52.5%]' xmlns="http://www.w3.org/2000/svg" fill='#d2d3d7' height="1em" viewBox="0 0 512 512">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </div>
          <ChannelList channels={searchedChannels} />
          <button
            className="flex w-[50%] self-center bg-[#665dfe] text-white items-center justify-center p-3 mb-2 rounded-[20px]"
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        </div>
            <ChannelContext.Provider value={channels}>
            <Outlet user={user} />
            </ChannelContext.Provider>
      </div>
    </AuthContext.Provider>
    )
}