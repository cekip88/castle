const
	{ src, dest } = require('gulp'),
	concat = require('gulp-concat'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync'),
	gcmq = require('gulp-group-css-media-queries'),
	reload = browserSync.reload,
	stylus = require('gulp-stylus');
	config = {
		compress: false,
		pathFrom: '../stylus/main.styl',
		pathTo: '../../build/',
		outputFile: 'front.css'
	};


module.exports =  function stylusSheets(){
	return src(config['pathFrom'])
		.pipe(stylus({
			compress: config['compress']
		}))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 1 version'],
			grid: true
		}))
		.pipe(
			concat(config['outputFile'])
		)
		.pipe(gcmq())
		.pipe(dest(config['pathTo']))
		.pipe(reload({stream:true}))
}