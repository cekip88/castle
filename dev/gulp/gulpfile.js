
const
  { src, dest, watch, parallel, series } = require('gulp');
 
// Gulp File 2.0
const
	sassObservePath = '../sass/**/*.sass',
	stylesObservePath = '../stylus/**/*.styl',
	htmlObservePath = '../templates/**/*.pug',
	scriptsObservePath = '../js/**/*.js',
	stylusSheets = require('./styles/stylus.js'),
	sassSheets = require('./styles/sass.js'),
	pugTpl = require('./templates/pug.js'),
	jsScripts = require('./scripts/js.js'),
	liveReload = require('./live/liveReload.js');


function observe(){
  watch([sassObservePath],sassSheets);
  watch([stylesObservePath],stylusSheets);
  watch([htmlObservePath],pugTpl);
  watch([scriptsObservePath],jsScripts);
}

function fonts(){
	return src([
		'../fonts/**/*.*'
	])
	.pipe(dest('../../build/fonts'))
}
function images(){
	return src([
		'../img/**/*.*'
	])
	.pipe(dest('../../build/img'))
}

exports.sass= parallel([observe,pugTpl,liveReload,sassSheets,jsScripts,fonts,images]);
exports.default= parallel([pugTpl,liveReload,stylusSheets,jsScripts,fonts,images,observe]);

/*
gulp.task('html', function(){
    return gulp.src(html['src_build'])
        .pipe(
            pug({
                pretty: html['pretty'],
            })
                .on('error',
                    notify.onError({
                        message: "<%= error.message%>",
                        title : html['err_title']
                    })
                )
        )
        .pipe(
            gulp.dest(html['dest'])
        ).pipe(reload({stream:true}));
});
gulp.task('html_func', function(){
    return gulp.src(html['src_all'])
        .pipe(
            pug({
                basedir: 'I:/gulp/',
                pretty: html['pretty']
            }).on('error',
                notify.onError({
                    message: "<%= error.message%>",
                    title : html['err_title']
                })
            )
        ).pipe(reload({stream:true}));
});
gulp.task('css', function(){
    return gulp.src(css['src_build'])
        .pipe(
            sass({
                outputStyle: css['style']
            })
                .on( 'error', notify.onError({
                    message: "<%= error %>",
                    title : css['err_title']
                }))
        )
        .pipe(
            concat(css['file_name'])
        )
        .pipe(
            gulp.dest(css['dest'])
        ).pipe(reload({stream:true}));
});
gulp.task('media_query',function () {
    return gulp.src(projectPath+'/css/!*.css')
        .pipe(cmq({
            log: true
        }))
        .pipe(gulp.dest(projectPath+'/css'));
});
gulp.task('js',function() {
    return gulp.src(js['src_all'])
        .pipe(
            gulp.dest(js['dest'])
        ).pipe(reload({stream:true}));
});
gulp.task('move_images', function() {
    return gulp.src(img['src_all'])
        .pipe(
            flatten({ includeParents: 0 })
        )
        .pipe(
            gulp.dest(img['dest'])
        )
});
gulp.task('move_fonts', function() {
    return gulp.src('sass/fonts/!*.*')
        .pipe(
            flatten({ includeParents: 0 })
        )
        .pipe(
            gulp.dest(projectPath+'/fonts')
        )
});
gulp.task('browserSync', function() {
    let serverCfg = {
        port: 80,
        open: true,
        notify: true
    };
    if (!proxy){
        serverCfg['server'] =  {
            baseDir: projectPath,
            index: "index.html",
            serveStaticOptions: {
                extensions: ["html"]
            }
        };
    }
    browserSync.init(serverCfg);
});
gulp.task('min_js',function() {
    return gulp.src(js['src_all'])
        .pipe(minifyjs())
        .pipe(
            gulp.dest(js['dest'])
        );
});
gulp.task('min_css',function () {
    return gulp.src(projectPath+'/!*.css')
        .pipe(cmq({
            log: true
        }))
        .pipe(clean_CSS())
        .pipe(gulp.dest(projectPath+'/'));
});
gulp.task('min_main', function() {
    return gulp.src(img['src_all'])
        .pipe(imagemin())
        .pipe(
            gulp.dest(img['dest'])
        )
});
gulp.task('minify',gulp.parallel('min_main','min_css','min_js'));
gulp.task('watch', function() {
    gulp.watch(html['src_all'],gulp.series('html'));
    gulp.watch(css['src_build'],gulp.parallel('css'));
    gulp.watch(css['src_all'],gulp.parallel('css'));
    gulp.watch(js['src_all'],gulp.parallel('js'));
    gulp.watch(img['src_all'],gulp.parallel('move_images'));
    gulp.watch(projectPath+'/!*.css',gulp.parallel('media_query'));

});
gulp.task('default', gulp.parallel('watch','html','js', 'move_fonts','css' ,'browserSync','move_images','media_query'));*/
