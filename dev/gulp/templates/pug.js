const
	{ src, dest } = require('gulp'),
	notify = require('gulp-notify'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	pug = require('gulp-pug'),
	config = {
		pretty: true,
		pathFrom : ['../templates/**/*.pug','!../templates/data/**/*.pug','!../templates/parts/**/*.pug'],
		pathTo: '../../build'
	};
module.exports = function pugTpl(){
	return src(config['pathFrom'])
		.pipe(
			pug({
				pretty: config['pretty'],
			}).on('error',notify.onError({
				message: "<%= error.message%>",
				title : "Ошибка компиляции в HTML"
			}))
		)
		.pipe(
			dest(config['pathTo'])
		)
		.pipe(reload({stream:true}))
}