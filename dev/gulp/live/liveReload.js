const
	browserSync = require('browser-sync'),
	reload = browserSync.reload;
module.exports = function liveReload() {
	browserSync.init({
		port: 80,
		open: true,
		notify: true,
		server: {
			baseDir: '../../build/',
			index: "index.html",
			serveStaticOptions: {
				extensions: ["html"]
			}
		}
	});
}