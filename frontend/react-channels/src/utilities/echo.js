import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

export default new Echo({
  broadcaster: 'pusher',
  key: 'fc805df314a7752affbc',
  cluster: 'us2',
  forceTLS: true,
})