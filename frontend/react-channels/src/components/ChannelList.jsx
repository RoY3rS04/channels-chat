import Channel from './Channel'

export default function ChannelList({channels}) {
  return (
    <div className="flex-1 flex flex-col items-start mt-5 space-y-4 overflow-y-scroll p-4">
      {channels.map((channel) => (
        <Channel key={channel.id} channel={channel} />
      ))}
    </div>
  )
}