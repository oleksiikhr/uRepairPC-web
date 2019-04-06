'use strict'

import { includePermission } from '@/scripts/utils'
import { isObject } from '@/scripts/helpers'
import menu from '@/data/menu'
import Vue from 'vue'

const state = {
	openSearch: false,
	// Uses on every page for display path
	breadcrumbs: [],
	// Restore user scroll on Page template
	pagesScroll: {},
	// History on left sidebar
	// Required id property
	sidebar: {},
	// Set dialog global on all pages (in layout)
	dialog: {},
	// Global settings for the website (logo, title, etc)
	settings: {}
}

const mutations = {
	OPEN_SEARCH(state) {
		state.openSearch = true
	},
	CLOSE_SEARCH(state) {
		state.openSearch = false
	},
	SET_BREADCRUMBS(state, arr) {
		state.breadcrumbs = arr
	},
	/**
	 * @param state
	 * @param {string} pageName
	 * @param {number} scroll
	 */
	SET_PAGE_SCROLL(state, { pageName, scroll }) {
		state.pagesScroll[pageName] = scroll
	},
	/**
	 * @param state
	 * @param {string} pageName
	 */
	REMOVE_PAGE_SCROLL(state, pageName) {
		Vue.delete(state.pagesScroll, pageName)
	},
	/**
	 * @param state
	 * @param {string} section - name (users, equipments, etc)
	 * @param {{id|*}} data
	 */
	ADD_SIDEBAR_ITEM(state, { section, data }) {
		if (!state.sidebar[section]) {
			Vue.set(state.sidebar, section, {})
		}

		// Prevent delete custom attributes (relationship)
		const oldValue = state.sidebar[section][data.id]

		Vue.set(state.sidebar[section], data.id, {
			...oldValue,
			...data
		})
	},
	/**
	 * @param state
	 * @param {string} section - name (users, equipments, etc)
	 * @param {number|string} id
	 */
	REMOVE_SIDEBAR_ITEM(state, { section, id }) {
		if (typeof id === 'undefined' || !state.sidebar[section]) {
			return
		}

		Vue.delete(state.sidebar[section], id)
	},
	/**
	 * @param state
	 * @param {object} data
	 */
	SET_SETTINGS(state, data) {
		state.settings = data
	},
	/**
	 * @param state
	 * @param { component, attrs, events } data
	 */
	OPEN_DIALOG(state, data) {
		state.dialog = data
	},
	CLOSE_DIALOG(state) {
		state.dialog = {}
	}
}

const actions = {
	//
}

const getters = {
	/**
	 * Filter global menu (sidebar, another places)
	 * by depends user role.
	 */
	menu(state, getters, rootState) {
		const userPermissions = rootState.profile.permissions
		const result = {}

		for (const [key, obj] of Object.entries(menu)) {
			if (obj.permissions && !includePermission(obj.permissions, userPermissions)) {
				continue
			}

			// Check children attribute (sub menu)
			if (isObject(obj.children)) {
				Object.entries(obj.children).forEach(([childKey, childItem]) => {
					if (childItem.permissions && !includePermission(childItem.permissions, userPermissions)) {
						delete obj.children[childKey]
					}
				})
			}

			result[key] = obj
		}

		return result
	}
}

export default {
	state, mutations, actions, getters
}
