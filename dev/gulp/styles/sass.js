const
	{ src, dest } = require('gulp'),
	concat = require('gulp-concat'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	sass = require('gulp-sass')(require('sass')),
	config = {
		compress: false,
		pathFrom: ['../sass/main.sass'],
		pathTo: '../../build/',
		outputFile: 'front.css'
	};
module.exports =  function sassSheets(){
	return src(config['pathFrom'])
	.pipe(sass({
		compress: config['compress']
	}))
	.pipe(autoprefixer({
		overrideBrowserslist: ['last 5 version'],
		grid: true
	}))
	.pipe(
		concat(config['outputFile'])
	)
	.pipe(dest(config['pathTo']))
	.pipe(reload({stream:true}))
}