import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import TicketForm from '@/components/TicketForm.vue'
import TicketList from '@/components/TicketList.vue'
import PrintTicket from '@/components/PrintTicket.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/new',
    name: 'new-ticket',
    component: TicketForm
  },
  {
    path: '/edit/:id',
    name: 'edit-ticket',
    component: TicketForm,
    props: true
  },
  {
    path: '/list',
    name: 'ticket-list',
    component: TicketList
  },
  {
    path: '/print/:id',
    name: 'print-ticket',
    component: PrintTicket,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router