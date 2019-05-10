'use strict'

import Vue from 'vue'

const state = {
  init: true,
  loading: false,
  list: []
}

const mutations = {
  SET_LOADING(state, toggle) {
    state.loading = toggle
  },
  SET_LIST(state, arr) {
    state.init = false
    state.list = arr
  },
  REPLACE_ITEM(state, { index, data }) {
    Vue.set(state.list, index, data)
  },
  APPEND_ITEM(state, data) {
    state.list.push(data)
  },
  DELETE_ITEM(state, index) {
    state.list.splice(index, 1)
  },
  CLEAR_ALL(state) {
    state.init = true
    state.loading = false
    state.list = []
  }
}

const actions = {
  //
}

export default {
  state, mutations, actions
}
