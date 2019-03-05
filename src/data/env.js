'use strict'
/* eslint-disable */

/** @return {boolean} */
export const isProd = ['prod', 'production'].includes(process.env.APP_ENV)

/** @return {string} */
export const axiosBaseUrl = process.env.AXIOS_BASE_URL || 'api'

