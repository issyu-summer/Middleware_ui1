import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Group from '../components/Group.vue'
import Private from '../components/Private.vue'
import Chat from '../components/Chat.vue'
import Test from '../components/Chatgroup.vue'


Vue.use(VueRouter)

// 用于解决重复导航问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const routes = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: "/group",
        component: Group
    },
    {
        path: "/private",
        component: Private
    },
    {
        path: "/chat",
        component: Chat
    },
    {
        path: "/chatgroup",
        component: Test
    },
   
]


const router = new VueRouter({
    routes
})

export default router
