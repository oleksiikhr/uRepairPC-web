'use strict'

import '@babel/polyfill'
import SettingsFrontend from '@/classes/SettingsFrontend'
import filterComponents from '@/components/filters/index'
import locale from 'element-ui/lib/locale/lang/ua'
import VueSocketIO from 'vue-socket.io-extended'
import StorageData from '@/classes/StorageData'
import { serverSocket } from '@/data/env'
import prototypes from '@/prototypes'
import directives from '@/directives'
import ElementUI from 'element-ui'
import NProgress from 'nprogress'
import io from 'socket.io-client'
import router from '@/router'
import App from '@/App.vue'
import moment from 'moment'
import store from '@/store'
import Vue from 'vue'

// Import Service Worker
import '@/scripts/sw'

// Import styles
import '@/styles/index'

// Connect libraries to Vue
Vue.use(ElementUI, { locale })
Vue.use(VueSocketIO, io(serverSocket, {
	query: {
		token: StorageData.token
	}
}))

// Prevent the production tip on Vue startup
Vue.config.productionTip = false

// Other libraries
moment.locale('uk')
NProgress.configure({ showSpinner: false })

/**
 * Install global prototypes
 * @var {Array} prototypes
 * @example Vue.$axios | this.$axios
 */
prototypes.forEach((prototype) => {
	Vue.use(prototype)
})

/**
 * Install global directives
 * @var {Array} directives
 */
directives.forEach((directive) => {
	Vue.use(directive)
})

/**
 * Install global Filter Components
 * @example <filter-core />
 * @see @/components/filters
 */
filterComponents.forEach((component) => {
	Vue.use(component)
})

// Set init config
SettingsFrontend.init()
store.dispatch('profile/init')

new Vue({
	el: '#app',
	store,
	router,
	render: h => h(App)
})
