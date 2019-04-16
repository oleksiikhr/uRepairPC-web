'use strict'

import StorageData from '@/classes/StorageData'
import sections from '@/data/sections'
import router from '@/router'
import store from '@/store'
import axios from 'axios'
import Vue from 'vue'

export default function () {
	// Clear data from axios
	axios.defaults.headers['Authorization'] = null

	// Clear data from localStorage
	StorageData.remove.token()
	StorageData.remove.profile()
	StorageData.remove.permissions()

	// Set isLogin to false, can access for auth page
	store.commit('profile/SET_IS_LOGIN', false)

	// And move to auth page
	router.push({ name: sections.auth })

	// On auth page we can safe delete user object without errors
	Vue.nextTick(() => {

		// Clear data from store (vuex)
		const names = [
			'roles', 'users', 'permissions', 'equipments', 'equipmentTypes', 'equipmentManufacturers', 'equipmentModels'
		]

		names.forEach(name => store.commit(`${name}/CLEAR_ALL`))

		store.commit('template/CLEAR_SIDEBAR')
		store.commit('profile/SET_USER', {})
		store.commit('profile/SET_PERMISSIONS', [])
	})
}