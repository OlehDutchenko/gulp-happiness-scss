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
		'./test/**/*.scss'
	];

	return gulp.src(sources)
		.pipe(multipipe(
			gulpHappinessScss(),
			gulpHappinessScss.format({
				showHappyFiles: true
			}),
			gulpHappinessScss.failAfterError()
		));
});
