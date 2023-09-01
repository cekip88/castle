const
	{ src, dest } = require('gulp'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	minify = require('gulp-terser'),
	config = {
		compress: false,
		pathFrom: '../js/**/*.js',
		pathTo: '../../build'
	}
module.exports =  function jsScripts(){
	return src([config['pathFrom']])
		.pipe(minify({
			compress: config['compress']
		}))
		.pipe(dest(config['pathTo']))
		.pipe(reload({stream:true}))
}