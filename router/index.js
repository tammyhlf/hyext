import App from '../streamer/home'
import LuckDraw from '../streamer/luck-draw'

const routes = [
  {
    path: '/',
    component: App,
    exact: true,
    routes: [
      {
        path: '/luck-draw',
        component: LuckDraw
      }
    ]
  }
]

export default routes