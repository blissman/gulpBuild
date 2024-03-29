// gulp
const gulp = require('gulp');
// beautify
const beautify = require('gulp-jsbeautifier');
// clean
const del = require('del');
// eslint
const eslint = require('gulp-eslint-new');
const eslintConfig = {
    "overrideConfig": {
        "env": {
            "browser": true,
            "amd": true,
            "node": true,
            "es2023": true
        },
        "extends": "eslint:recommended",
        // See https://eslint.org/docs/rules/ for rules
        "rules": {
            "indent": [
                "error",
                4,
                {
                    "SwitchCase": 1
                }
            ],
            "linebreak-style": [
                "error",
                "unix"
            ],
            "semi": [
                "error",
                "always"
            ],
            "no-console": 0, // allow console.log etc
            "no-extra-boolean-cast": 0, // allow using !! to cast to boolean
            "no-unused-vars": ["error",
                {
                    "vars": "all", // no unused variables in any scope
                    // allow trailing unused args since functions may be called with
                    // them even if they aren't used in the function
                    "args": "none"
                }
            ],
            "no-trailing-spaces": ["error"],
            "curly": ["error"],
            "no-extend-native": ["error"],
            "prefer-const": ["error"]
        }
    }
};
// babel
const babel = require('gulp-babel');
// uglify (js)
const uglify = require('gulp-uglify');
// uglify (es6)
const uglifyes6 = require('gulp-uglify-es').default;
// minify (css)
const cleanCSS = require('gulp-clean-css');
// minify (html)
const htmlmin = require('gulp-htmlmin');
// minify (images)
const imagemin = require('gulp-imagemin');
// jest (testing)
const jest = require('jest');

/*
    beautify task - beautify html, css, js in src folder
*/
gulp.task('beautify', () =>
    gulp.src(['src/**/*.css', 'src/**/*.html', 'src/**/*.js'])
    .pipe(beautify())
    .pipe(gulp.dest('src'))
);

/*
    clean task - remove existing dist folder and its contents
*/
gulp.task('clean', function() {
    return del([
        'dist/**/*',
        'test/coverage/**/*'
    ]);
});

/*
    ESLint task
*/
gulp.task('lint', function() {
    return gulp.src('src/**/*.js').pipe(eslint(eslintConfig))
        .pipe(eslint.format())
        // Brick on failure to be super strict
        .pipe(eslint.failOnError());
});

/*
    gulp-uglify (js) task
*/
gulp.task('uglify-js', function(callback) {
    return gulp.src('dist/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

/*
    gulp-uglify (es6) task
*/
gulp.task('uglify-es6', function() {
    return gulp.src('src/**/*.js')
        .pipe(uglifyes6())
        .pipe(gulp.dest('dist'));
});

/*
    gulp minify (css) task
*/
gulp.task('minify-css', () => {
    return gulp.src('src/**/*.css')
        .pipe(cleanCSS({
            compatibility: '*',
            level: 2
        }))
        .pipe(gulp.dest('dist'));
});

/*
    gulp minify (html) task
*/
gulp.task('minify-html', () => {
    return gulp.src('src/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist'));
});

/*
    gulp minify (images) task
*/
gulp.task('minify-images', () =>
    gulp.src('src/images/**/*')
    .pipe(imagemin([
        imagemin.gifsicle({
            interlaced: true
        }),
        imagemin.mozjpeg({
            progressive: true
        }),
        imagemin.optipng({
            optimizationLevel: 5
        }),
        imagemin.svgo({
            plugins: [{
                    removeViewBox: true
                },
                {
                    cleanupIDs: false
                }
            ]
        })
    ]))
    .pipe(gulp.dest('dist/images'))
);

/*
    gulp-babel task
*/
gulp.task('babel', () =>
    gulp.src('src/**/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(gulp.dest('dist'))
);

/*
    jest tasks
*/
gulp.task('test', function() {
    return jest.runCLI({}, ['test/']);
});

/*
    gulp tasks
*/
gulp.task( // clean, lint, transpile to es5, uglify, and test
    'default',
    gulp.series(
        gulp.parallel(
            'clean',
            'lint'
        ),
        'babel',
        gulp.parallel(
            'uglify-js',
            'minify-css',
            'minify-html',
            'minify-images'
        ),
        'test'
    )
);

gulp.task( // same as default, but no uglify
    'pretty',
    gulp.series(
        gulp.parallel(
            'clean',
            'lint'
        ),
        'babel',
        'test'
    )
);

gulp.task( // same as default, but leaves code in es6
    'es6',
    gulp.series(
        gulp.parallel(
            'clean',
            'lint'
        ),
        gulp.parallel(
            'uglify-es6',
            'minify-css',
            'minify-html',
            'minify-images'
        ),
        'test'
    )
);

gulp.task( // skip linting and testing
    'build',
    gulp.series(
        gulp.parallel(
            'clean'
        ),
        'babel',
        gulp.parallel(
            'uglify-js',
            'minify-css',
            'minify-html',
            'minify-images'
        )
    )
);

gulp.task( // skip linting and testing, and leaves code in es6
    'buildes6',
    gulp.series(
        gulp.parallel(
            'clean'
        ),
        gulp.parallel(
            'uglify-es6',
            'minify-css',
            'minify-html',
            'minify-images'
        )
    )
);