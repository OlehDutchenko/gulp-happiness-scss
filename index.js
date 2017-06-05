'use strict';

/**
 * Gulp plugin for [happiness-scss](https://github.com/dutchenkoOleg/happiness-scss)
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const path = require('path');
const gutil = require('gulp-util');
const through2 = require('through2');
const happinessScss = require('happiness-scss');
const _cloneDeep = require('lodash.clonedeep');
const _isPlainObject = require('lodash.isplainobject');
const _isFunction = require('lodash.isfunction');
const notSupportedFile = require('gulp-not-supported-file');

// ----------------------------------------
// Helpers
// ----------------------------------------

/**
 * Saved plug-in name for use in terminal logs
 * @const {string}
 * @private
 * @sourceCode
 */
const pluginName = 'gulp-happiness-scss';

/**
 * Text message about how get more information
 * @const {string}
 * @private
 * @sourceCode
 */
const moreInfo = '\n    Info:\n    Use gulpHappinessScss.format() method for more information about errors';

/**
 * Plugin error constructor
 * @param {string|Error} sample
 * @param {Object}       [options]
 * @see {@link https://github.com/gulpjs/gulp-util#new-pluginerrorpluginname-message-options}
 * @private
 * @sourceCode
 */
function pluginError (sample, options) {
	return new gutil.PluginError(pluginName, sample, options);
}

/**
 * Get 'error' or 'errors' text
 * @param {number} count
 * @return {string}
 * @private
 * @sourceCode
 */
function getErrorText (count) {
	return count > 1 ? 'errors' : 'error';
}

/**
 * Get 'path' or 'paths' text
 * @param {number} count
 * @return {string}
 * @private
 * @sourceCode
 */
function getPathText (count) {
	return count > 1 ? 'paths' : 'path';
}

/**
 * Get sassLint result data from file
 * @param {File} file
 * @param {function} pluginError
 * @param {Object} [runOptions={}]
 * @return {Object|Array}
 * @private
 * @sourceCode
 */
function getEslintData (file, pluginError, runOptions = {}) {
	let notSupported = notSupportedFile(file, pluginError, {
		silent: runOptions.silent,
		noUnderscore: runOptions.noUnderscore || false,
		noEmpty: runOptions.noEmpty
	});

	if (Array.isArray(notSupported)) {
		return notSupported;
	}

	let sassLintData = file.sassLint;

	if (_isPlainObject(sassLintData)) {
		return sassLintData;
	}

	return ['isNoEslintData'];
}

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Main lint method.
 * Add linting data as property `sassLint` to file.
 * @param {Object}  [options={}]
 * @param {boolean} [options.silent]
 * @param {boolean} [options.noUnderscore=true]
 * @param {boolean} [options.noEmpty=true]
 * @returns {DestroyableTransform} through2.obj
 * @sourceCode
 */
function gulpHappinessScss (options = {}) {
	let runOptions = _cloneDeep(options);

	if (!_isPlainObject(runOptions.linterOptions)) {
		runOptions.linterOptions = {};
	}

	return through2.obj(function (file, enc, cb) {
		let notSupported = notSupportedFile(file, pluginError, {
			silent: runOptions.silent,
			noUnderscore: runOptions.noUnderscore || false,
			noEmpty: runOptions.noEmpty
		});

		if (Array.isArray(notSupported)) {
			notSupported.shift();
			return cb(...notSupported);
		}

		let lintOptions = runOptions.linerOptions || {};
		let testFile = {
			text: String(file.contents),
			format: path.extname(file.path).replace('.', ''),
			filename: file.path
		};

		happinessScss.lintFileText(testFile, lintOptions, function (err, data) {
			if (err) {
				return cb(pluginError(err));
			}
			file.sassLint = data;
			cb(null, file);
		});
	});
}

/**
 * Get linting data from from file and show it in terminal
 * @param {string|Object} [formatter='stylish'] if it is Object using as options
 * @param {Object}        [options={}]
 * @param {boolean}       [options.silent]
 * @param {boolean}       [options.noUnderscore=true]
 * @param {boolean}       [options.noEmpty=true]
 * @param {boolean}       [options.showHappyFiles]
 * @param {boolean}       [options.linterOptions={}]
 * @returns {DestroyableTransform} through2.obj
 * @sourceCode
 */
gulpHappinessScss.format = function (options = {}) {
	let runOptions = _cloneDeep(options);

	runOptions.linterOptions = runOptions.linterOptions || {};

	return through2.obj(function (file, ...args) {
		let cb = args[1];
		let sassLintData = getEslintData(file, pluginError, runOptions);

		if (Array.isArray(sassLintData)) {
			sassLintData.shift();
			return cb(...sassLintData);
		}

		if (sassLintData.errorCount.count + sassLintData.warningCount.count === 0) {
			if (runOptions.showHappyFiles) {
				console.log(gutil.colors.green(`HAPPY FILE > ${file.path}`));
			}
			return cb(null, file);
		}

		try {
			let formatted = happinessScss.format(sassLintData.results, runOptions.linterOptions);

			console.log(formatted);
			cb(null, file);
		} catch (err) {
			return cb(pluginError(err));
		}
	});
};

/**
 * Failing if file has sassLint errors
 * @param {Object}  [options={}]
 * @param {boolean} [options.silent]
 * @param {boolean} [options.noUnderscore=true]
 * @param {boolean} [options.noEmpty=true]
 * @returns {DestroyableTransform} through2.obj
 * @sourceCode
 */
gulpHappinessScss.failOnError = function (options = {}) {
	let runOptions = _cloneDeep(options);

	return through2.obj(function (file, ...args) {
		let cb = args[1];
		let filePaths = [];
		let sassLintData = getEslintData(file, pluginError, runOptions);

		if (Array.isArray(sassLintData)) {
			sassLintData.shift();
			return cb(...sassLintData);
		}

		if (sassLintData.errorCount.count === 0) {
			if (_isFunction(runOptions.onEnd)) {
				runOptions.onEnd(null, sassLintData);
			}
			return cb(null, file);
		}

		sassLintData.results.forEach(result => {
			filePaths.push(result.filePath);
		});

		let count = sassLintData.errorCount.count;
		let errorText = getErrorText(count);
		let pathText = getPathText(filePaths.length);
		let errorMsg = `Fail on Error! ${count} ${errorText} in ${pathText}:\n    ${filePaths.join('\n    ')}`;

		if (file.sassLintIsFormeated !== true) {
			errorMsg += moreInfo;
		}

		if (_isFunction(runOptions.onEnd)) {
			runOptions.onEnd(errorMsg, sassLintData);
		}

		if (runOptions.disabled) {
			return cb(null, file);
		}

		return cb(pluginError(errorMsg));
	});
};

/**
 * Look after checking all the streamed files,
 * and if at least one of them has errors it will fail.
 * __Note!__ This method does not transfer files further to the stream!
 * @param {Object}  [options={}]
 * @param {boolean} [options.silent]
 * @param {boolean} [options.noUnderscore=true]
 * @param {boolean} [options.noEmpty=true]
 * @returns {DestroyableTransform} through2.obj
 * @sourceCode
 */
gulpHappinessScss.failAfterError = function (options = {}) {
	let runOptions = _cloneDeep(options);
	let sassLintIsFormatted = false;
	let allErrorsCount = 0;
	let filePaths = [];

	return through2.obj(function (file, ...args) {
		let cb = args[1];
		let sassLintData = getEslintData(file, pluginError, runOptions);

		if (Array.isArray(sassLintData)) {
			sassLintData.shift();
			return cb(...sassLintData);
		}

		if (sassLintData.errorCount.count === 0) {
			return cb();
		}

		sassLintIsFormatted = file.sassLintIsFormeated;
		allErrorsCount += sassLintData.errorCount.count;
		sassLintData.results.forEach(result => {
			let count = result.errorCount;
			let errorText = getErrorText(count);

			filePaths.push(`has ${count} ${errorText} in ${result.filePath}`);
		});

		cb();
	}, function (cb) {
		if (allErrorsCount === 0) {
			if (_isFunction(runOptions.onEnd)) {
				runOptions.onEnd(null, allErrorsCount, filePaths);
			}
			return cb();
		}

		let errorText = getErrorText(allErrorsCount);
		let pathText = getPathText(filePaths.length);
		let errorMsg = `Fail after Error! ${allErrorsCount} ${errorText} in ${pathText}:\n    ${filePaths.join('\n    ')}`;

		if (sassLintIsFormatted !== false) {
			errorMsg += moreInfo;
		}

		if (_isFunction(runOptions.onEnd)) {
			runOptions.onEnd(errorMsg, allErrorsCount, filePaths);
		}

		if (runOptions.disabled) {
			return cb();
		}

		cb(pluginError(errorMsg));
	});
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = gulpHappinessScss;
