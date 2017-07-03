# gulp-happiness-scss

![npm](https://img.shields.io/badge/node-6.3.1-yellow.svg)
[![es2015](https://img.shields.io/badge/ECMAScript-2015_(ES6)-blue.svg)](https://nodejs.org/en/docs/es6/) 
[![license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/dutchenkoOleg/gulp-happiness/blob/master/LICENSE) 
[![Dependencies](https://www.versioneye.com/user/projects/5936521f98442b005cdc7bd2/badge.svg?style=flat)](https://www.versioneye.com/user/projects/5936521f98442b005cdc7bd2?child=summary) 
[![Build Status](https://travis-ci.org/dutchenkoOleg/gulp-happiness-scss.svg?branch=master)](https://travis-ci.org/dutchenkoOleg/gulp-happiness-scss)

> _Gulp plugin for [happiness-scss](https://github.com/dutchenkoOleg/happiness-scss)_

[![js-happiness-style](https://cdn.rawgit.com/JedWatson/happiness/master/badge.svg)](https://github.com/JedWatson/happiness)
[![Happiness SCSS Style](https://cdn.rawgit.com/dutchenkoOleg/happiness-scss/master/badge.svg)](https://github.com/dutchenkoOleg/happiness-scss)
---

## Installing

```shell
npm install --save gulp-happiness-scss
# or using yarn cli
yarn add gulp-happiness-scss
```


## Usage

Check out files with [happiness-scss](https://github.com/dutchenkoOleg/happiness-scss) linter

```js
const gulp = require('gulp');
const gulpHappinessScss = require('gulp-happiness-scss');

gulp.task('lint', function () {
	return gulp.src('./styles/**/*.scss')
		// Attaches the lint data to the "sassLint" property
		// of the file object so it can be used by other modules. 
		// By default it will skip files with empty content
		.pipe(gulpHappinessScss())
		
		// outputs the lint results to the console.
		.pipe(gulpHappinessScss.format())
		
		// Look after checking all the streamed files,
		// and if at least one of them has errors it will fail.
		// Note! This method does not transfer files further to the stream!
		.pipe(gulpHappinessScss.failAfterError());
});
```

Lint files and transfer, if had no problems

```js
const gulp = require('gulp');
const gulpHappinessScss = require('gulp-happiness-scss');

gulp.task('lint', function () {
	return gulp.src('./styles/**/*.scss')
		.pipe(gulpHappinessScss())
		
		// Show in console happy files ;)
		.pipe(gulpHappinessScss.format({
			showHappyFiles: true
		}))
		
		// Failing if file has eslint errors,
		// it will break task immediately.
		// Current file and all next not will be transferred
		.pipe(gulpHappinessScss.failOnError())
		
		// transfer files
		.pipe(gulp.dest('./path/to/some/dir/'));
});
```

---
   
## API


### gulpHappinessScss()

_No explicit configuration._   
Linting with default options.  
Attaches the lint data to the "sassLint" property of the file object so it can be used by other modules. 

### gulpHappinessScss(options)

#### options.linterOptions

type `Object` /
default `undefined`  
Here you can set all options for `happiness-scss`linter.  
See [happiness-scss → Nodejs API → config](https://github.com/dutchenkoOleg/happiness-scss#nodejs-api) for more information about notation and [happiness-scss → CLI Options](https://github.com/dutchenkoOleg/happiness-scss#cli-options) about their description.

#### options.noUnderscore

type `boolean` /
default `false`  
If set true - file which name starts with _ (underscore) will be skipped and not using in stream next.  

_You will receive message in console if it happens._  
_Example of log:_

![no-empty log example](https://raw.githubusercontent.com/dutchenkoOleg/gulp-not-supported-file/master/assets/no-underscore.png)


#### options.noEmpty

type `boolean` /
default `true`  
File with empty content will be skipped and not using in stream next.  
_**Note!** Spaces, tabs and newlines will be treated as empty content._  

_You will receive message in console if it happens._  
_Example of log:_

![no-empty log example](https://raw.githubusercontent.com/dutchenkoOleg/gulp-not-supported-file/master/assets/no-empty.png)


#### options.silent

type `boolean` /
default `undefined`  
No logs about `noEmpty` and `noUnderscore` files

### gulpHappiness.format()

_No explicit configuration._   
Outputs the lint results to the console.  
Default formatter is `stylish`



### gulpHappiness.format(config)

#### options.showHappyFiles

type `boolean` /
default `undefined`  
Show files without problems in console

_Example of log from similar project [gulp-happiness](https://github.com/dutchenkoOleg/gulp-happiness):_

![Show happy files example](https://raw.githubusercontent.com/dutchenkoOleg/gulp-happiness/master/assets/show-hapy-files.png)

#### options.noUnderscore

Same as [gulpHappinessScss(options) → options.noUnderscore](#optionsnounderscore)

#### options.noEmpty

Same as [gulpHappinessScss(options) → options.noEmpty](#optionsnoempty)

#### options.silent

Same as [gulpHappinessScss(options) → options.silent](#optionssilent)

#### options.linterOptions

Here you can set options [`happiness-scss > Nodejs API > config`](https://www.npmjs.com/package/happiness-scss#config)  







### gulpHappiness.failOnError()

_No explicit configuration._ 

### gulpHappiness.failOnError(options)

#### options.disabled

type `boolean` /
default `undefined`  
Not fail on errors 

#### options.onEnd(errorMsg, sassLintData)

type `fucnction` /
default `undefined`  

_Parameters:_

Name | Data type | Description
 --- | --- | ---
 `errorMsg` | `null/string` | Is `null` if no errors were found and is `string` if errors were found. String contains a short message about errors
 `sassLintData` | `Object` | sass-lint data from file
 
Its call will be before ending of pipe. So you don't need apply no callbacks or return some values.  
You can use it for own custom actions, e.g rewrite some globals.  
___Note!___ Even if `options.disabled` - is `true` - this function will be called

#### options.noUnderscore

Same as [gulpHappinessScss(options) → options.noUnderscore](#optionsnounderscore)

#### options.noEmpty

Same as [gulpHappinessScss(options) → options.noEmpty](#optionsnoempty)

#### options.silent

Same as [gulpHappinessScss(options) → options.silent](#optionssilent)

#### options.linterOptions

Here you can set options [`happiness-scss > Nodejs API > config`](https://www.npmjs.com/package/happiness-scss#config)  




### gulpHappiness.failAfterError()

_No explicit configuration._ 


### gulpHappiness.failAfterError(options)

#### options.disabled

Same as [gulpHappiness.failOnError(options) → options.disabled](#optionsdisabled)

#### options.linterOptions

Here you can set options [`happiness-scss > Nodejs API > config`](https://www.npmjs.com/package/happiness-scss#config)  

---

## Rules

Please read [happiness-scss / docs / Rules](https://github.com/dutchenkoOleg/happiness-scss/blob/master/docs/Rules.md)

---

## Disabling Linters via Source

Please read [Disabling Linters via Source](https://github.com/dutchenkoOleg/happiness-scss#disabling-linters-via-source)

---

## Tests

1. `npm test` for testing js and scss code style
1. `npm run happiness-fix` for automatically fix most of problems with **js code style** 

## Changelog

Please read [CHANGELOG.md](https://github.com/dutchenkoOleg/gulp-happiness-scss/blob/master/CHANGELOG.md)

## Contributing

Please read [CONTRIBUTING.md](https://github.com/dutchenkoOleg/gulp-happiness-scss/blob/master/CONTRIBUTING.md)

## Code of Conduct

Please read [CODE_OF_CONDUCT.md](https://github.com/dutchenkoOleg/gulp-happiness-scss/blob/master/CODE_OF_CONDUCT.md)
