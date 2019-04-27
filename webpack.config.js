'use strict'

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const Dotenv = require('dotenv-webpack')
const path = require('path')
require('dotenv').config()

/** @type {boolean} */
const isDev = ['dev', 'development'].includes(process.env.NODE_ENV)

/** @type {object} */
const settings = {
	mode: isDev ? 'development' : 'production',
	entry: [
		'./src/main.js'
	],
	output: {
		filename: 'assets/[name].[hash].js',
		chunkFilename: 'assets/chunks/[name].[hash].js',
		publicPath: '/',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: isDev ? 'inline-source-map' : false,
	devServer: {
		publicPath: '/',
		contentBase: './dist',
		host: process.env.WEBPACK_HOST_DEV || 'localhost',
		hot: true,
		writeToDisk: true,
		clientLogLevel: 'error',
		disableHostCheck: true,
		proxy: {
			'/api/*': {
				target: process.env.PROXY_TARGET || 'http://localhost/',
				changeOrigin: true
			}
		}
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		}
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'assets/images',
						}
					}
				]
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'assets/files',
						}
					}
				]
			},
			{
				test: /\.vue$/,
				use: 'vue-loader'
			},
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					'babel-loader',
					'eslint-loader'
				]
			}
		]
	},
	plugins: [
		new Dotenv,
		new VueLoaderPlugin,
		new CleanWebpackPlugin({
			verbose: true
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './index.html',
			inject: true,
			chunksSortMode: 'none'
		})
	],
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'@': path.resolve(__dirname, './src/'),
			'scss': path.resolve(__dirname, './src/styles/')
		}
	}
}

// Add PWA
if (!isDev) {
	settings.plugins.push(new WorkboxPlugin.GenerateSW({
		swDest: 'sw.js',
		importWorkboxFrom: isDev ? 'cdn' : 'local',
		importsDirectory: 'assets',
		clientsClaim: true,
		skipWaiting: true,
		navigateFallback: '/index.html',
		runtimeCaching: [{
			urlPattern: new RegExp('api'),
			handler: 'NetworkFirst'
		}]
	}))
}

module.exports = settings
