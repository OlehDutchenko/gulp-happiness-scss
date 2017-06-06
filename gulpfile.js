'use strict';

/**
 * @fileOverview Testing with `gulp-mocha`
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const gulp = require('gulp');
const multipipe = require('multipipe');
const gulpHappinessScss = require('./index');

// ----------------------------------------
// Exports
// ----------------------------------------

gulp.task('lint', function () {
	let sources = [
		'./test/**/*.{scss,md}'
	];

	return gulp.src(sources)
		.pipe(multipipe(
			gulpHappinessScss({
				linterOptions: {
					noDisabling: true
				}
			}),
			gulpHappinessScss.format({
				showHappyFiles: true,
				linterOptions: {
					formatter: 'table'
				}
			})
			// gulpHappinessScss.failOnError()
		));
});
