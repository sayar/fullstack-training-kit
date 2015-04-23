/**
* Copyright (c) 2005 - 2011, James Auldridge
* All rights reserved.
*
* Licensed under the BSD, MIT, and GPL (your choice!) Licenses:
*  http://code.google.com/p/cookies/wiki/License
*
* Last eror free JSLint: 20110207 12:28
*                        Checked Options: Allow one var statement per function
*                                         Disallow undefined variables
*                                         Require Initial Caps for constructors
*                                         Disallow dangling _ in identifiers
*                                         Disallow ++ and --
*                                         Disallow bitwise operators
*                                         Require "use strict";
*                                         Assume a browser
*                        Indentation: 0
*                        Predefined: window
*/
/*jslint onevar: true, undef: true, newcap: true, nomen: true, plusplus: true, bitwise: true, browser: true, strict: true, maxerr: 50, indent: 0 */
(function (global) {
    "use strict";

    var document, jaaulde;

    /*
    * localize global variables which are used more than once
    */
    document = global.document;

    /*
    * jaaulde Namespace preparation - the only var introduced into global space
    */
    jaaulde = global.jaaulde = (global.jaaulde || {});
    jaaulde.utils = jaaulde.utils || {};

    jaaulde.utils.cookies = (function () {
        /* Private vars */
        var defaultOptions,
        /* Private functions */
			resolveOptions, assembleOptionsString, isNaN, trim, parseCookies, Constructor;

        defaultOptions = {
            expiresAt: null,
            path: '/',
            domain: null,
            secure: false
        };

        /**
        * resolveOptions - receive an options object and ensure all options are present and valid, replacing with defaults where necessary
        *                  would prefer jQuery.extend here, but we want this library to work without jQuery
        * @access private
        * @static
        * @parameter Object options - optional options to start with
        * @return Object complete and valid options object
        */
        resolveOptions = function (options) {
            var returnValue, expireDate;

            if (typeof options !== 'object' || options === null) {
                returnValue = defaultOptions;
            }
            else {
                returnValue = {
                    expiresAt: defaultOptions.expiresAt,
                    path: defaultOptions.path,
                    domain: defaultOptions.domain,
                    secure: defaultOptions.secure
                };

                if (typeof options.expiresAt === 'object' && options.expiresAt instanceof Date) {
                    returnValue.expiresAt = options.expiresAt;
                }
                else if (typeof options.hoursToLive === 'number' && options.hoursToLive !== 0) {
                    expireDate = new global.Date();
                    expireDate.setTime(expireDate.getTime() + (options.hoursToLive * 60 * 60 * 1000));
                    returnValue.expiresAt = expireDate;
                }

                if (typeof options.path === 'string' && options.path !== '') {
                    returnValue.path = options.path;
                }

                if (typeof options.domain === 'string' && options.domain !== '') {
                    returnValue.domain = options.domain;
                }

                if (options.secure === true) {
                    returnValue.secure = options.secure;
                }
            }

            return returnValue;
        };
        /**
        * assembleOptionsString - analyze options and assemble appropriate string for setting a cookie with those options
        *
        * @access private
        * @static
        * @parameter options OBJECT - optional options to start with
        * @return STRING - complete and valid cookie setting options
        */
        assembleOptionsString = function (options) {
            options = resolveOptions(options);

            return (
				(typeof options.expiresAt === 'object' && options.expiresAt instanceof Date ? '; expires=' + options.expiresAt.toGMTString() : '') +
				'; path=' + options.path +
				(typeof options.domain === 'string' ? '; domain=' + options.domain : '') +
				(options.secure === true ? '; secure' : '')
			);
        };
        /**
        * trim - remove left and right whitespace
        *             Some logic borrowed from http://jquery.com/
        *
        * @access private
        * @static
        * @parameter data STRING
        * @return STRING
        */
        trim = global.String.prototype.trim
			? function (data) {
			    return global.String.prototype.trim.call(data);
			}
			: (function () {
			    var trimLeft, trimRight;

			    trimLeft = /^\s+/;
			    trimRight = /\s+$/;

			    return function (data) {
			        return data.replace(trimLeft, '').replace(trimRight, '');
			    };
			} ());
        /**
        * isNaN - check if given value is not a number
        *         Borrowed from http://jquery.com/
        *
        * @access private
        * @static
        * @parameter obj MIXED
        * @return BOOL
        */
        isNaN = (function () {
            var rdigit = /\d/, isNaN = global.isNaN;
            return function (obj) {
                return (obj === null || !rdigit.test(obj) || isNaN(obj));
            };
        } ());
        /**
        * parseCookies - retrieve document.cookie string and break it into a hash with values decoded and unserialized
        *
        * @access private
        * @static
        * @return OBJECT - hash of cookies from document.cookie
        */
        parseCookies = (function () {
            var parseJSON, rbrace;

            parseJSON = global.JSON && global.JSON.parse
				? (function () {
				    var rvalidchars, rvalidescape, rvalidtokens, rvalidbraces;

				    rvalidchars = /^[\],:{}\s]*$/;
				    rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
				    rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
				    rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;

				    return function (data) {
				        var returnValue, validJSON;

				        returnValue = null;

				        if (typeof data === 'string' && data !== '') {
				            // Make sure leading/trailing whitespace is removed (IE can't handle it)
				            data = trim(data);

				            if (data !== '') {
				                try {
				                    // Make sure the incoming data is actual JSON. Logic borrowed from http://json.org/json2.js
				                    validJSON = rvalidchars.test(data.replace(rvalidescape, '@').replace(rvalidtokens, ']').replace(rvalidbraces, ''));

				                    returnValue = validJSON ?
										global.JSON.parse(data) :
										null;
				                }
				                catch (e1) {
				                    returnValue = null;
				                }
				            }
				        }

				        return returnValue;
				    };
				} ())
				: function () {
				    return null;
				};

            rbrace = /^(?:\{.*\}|\[.*\])$/;

            return function () {
                var cookies, splitOnSemiColons, i, splitOnEquals, name, rawValue, value;

                cookies = {};
                splitOnSemiColons = document.cookie.split(';');

                for (i = 0; i < splitOnSemiColons.length; i = i + 1) {
                    splitOnEquals = splitOnSemiColons[i].split('=');

                    name = trim(splitOnEquals.shift());
                    rawValue = splitOnEquals.join('=');

                    try {
                        value = decodeURIComponent(rawValue);
                    }
                    catch (e2) {
                        value = rawValue;
                    }

                    //Logic borrowed from http://jquery.com/ dataAttr method
                    try {
                        value = value === 'true'
							? true
							: value === 'false'
								? false
								: !isNaN(value)
									? parseFloat(value)
									: rbrace.test(value)
										? parseJSON(value)
										: value;
                    }
                    catch (e3) { }

                    cookies[name] = value;
                }
                return cookies;
            };
        } ());

        Constructor = function () { };

        /**
        * get - get one, several, or all cookies
        *
        * @access public
        * @paramater Mixed cookieName - String:name of single cookie; Array:list of multiple cookie names; Void (no param):if you want all cookies
        * @return Mixed - Value of cookie as set; Null:if only one cookie is requested and is not found; Object:hash of multiple or all cookies (if multiple or all requested);
        */
        Constructor.prototype.get = function (cookieName) {
            var returnValue, item, cookies;

            cookies = parseCookies();

            if (typeof cookieName === 'string') {
                returnValue = (typeof cookies[cookieName] !== 'undefined') ? cookies[cookieName] : null;
            }
            else if (typeof cookieName === 'object' && cookieName !== null) {
                returnValue = {};
                for (item in cookieName) {
                    if (typeof cookies[cookieName[item]] !== 'undefined') {
                        returnValue[cookieName[item]] = cookies[cookieName[item]];
                    }
                    else {
                        returnValue[cookieName[item]] = null;
                    }
                }
            }
            else {
                returnValue = cookies;
            }

            return returnValue;
        };
        /**
        * filter - get array of cookies whose names match the provided RegExp
        *
        * @access public
        * @paramater Object RegExp - The regular expression to match against cookie names
        * @return Mixed - Object:hash of cookies whose names match the RegExp
        */
        Constructor.prototype.filter = function (cookieNameRegExp) {
            var cookieName, returnValue, cookies;

            returnValue = {};
            cookies = parseCookies();

            if (typeof cookieNameRegExp === 'string') {
                cookieNameRegExp = new RegExp(cookieNameRegExp);
            }

            for (cookieName in cookies) {
                if (cookieName.match(cookieNameRegExp)) {
                    returnValue[cookieName] = cookies[cookieName];
                }
            }

            return returnValue;
        };
        /**
        * set - set or delete a cookie with desired options
        *
        * @access public
        * @paramater String cookieName - name of cookie to set
        * @paramater Mixed value - Any JS value. If not a string, will be JSON encoded (http://code.google.com/p/cookies/wiki/JSON); NULL to delete
        * @paramater Object options - optional list of cookie options to specify
        * @return void
        */
        Constructor.prototype.set = function (cookieName, value, options) {
            if (typeof options !== 'object' || options === null) {
                options = {};
            }

            // TODO: consider value serialization method to parallel parse cookies
            if (typeof value === 'undefined' || value === null) {
                value = '';
                options.hoursToLive = -8760;
            }
            else {
                //Logic borrowed from http://jquery.com/ dataAttr method and reversed
                value = value === true
						? 'true'
						: value === false
							? 'false'
							: !isNaN(value)
								? '' + value
								: value;
                if (typeof value !== 'string') {
                    if (typeof JSON === 'object' && JSON !== null && typeof JSON.stringify === 'function') {
                        value = JSON.stringify(value);
                    }
                    else {
                        throw new Error('cookies.set() received value which could not be serialized.');
                    }
                }
            }

            var optionsString = assembleOptionsString(options);

            document.cookie = cookieName + '=' + encodeURIComponent(value) + optionsString;
        };
        /**
        * del - delete a cookie (domain and path options must match those with which the cookie was set; this is really an alias for set() with parameters simplified for this use)
        *
        * @access public
        * @paramater MIxed cookieName - String name of cookie to delete, or Bool true to delete all
        * @paramater Object options - optional list of cookie options to specify ( path, domain )
        * @return void
        */
        Constructor.prototype.del = function (cookieName, options) {
            var allCookies, name;

            allCookies = {};

            if (typeof options !== 'object' || options === null) {
                options = {};
            }

            if (typeof cookieName === 'boolean' && cookieName === true) {
                allCookies = this.get();
            }
            else if (typeof cookieName === 'string') {
                allCookies[cookieName] = true;
            }

            for (name in allCookies) {
                if (typeof name === 'string' && name !== '') {
                    this.set(name, null, options);
                }
            }
        };
        /**
        * test - test whether the browser is accepting cookies
        *
        * @access public
        * @return Boolean
        */
        Constructor.prototype.test = function () {
            var returnValue, testName, testValue;

            testName = 'cookiesCT';
            testValue = 'data';

            this.set(testName, testValue);

            if (this.get(testName) === testValue) {
                this.del(testName);
                returnValue = true;
            }

            return returnValue;
        };
        /**
        * setOptions - set default options for calls to cookie methods
        *
        * @access public
        * @param Object options - list of cookie options to specify
        * @return void
        */
        Constructor.prototype.setOptions = function (options) {
            if (typeof options !== 'object') {
                options = null;
            }

            defaultOptions = resolveOptions(options);
        };

        return new Constructor();
    } ());

    if (global.jQuery) {
        (function ($) {
            $.cookies = jaaulde.utils.cookies;

            var extensions = {
                /**
                * $( 'selector' ).cookify - set the value of an input field, or the innerHTML of an element, to a cookie by the name or id of the field or element
                *                           (field or element MUST have name or id attribute)
                *
                * @access public
                * @param options OBJECT - list of cookie options to specify
                * @return jQuery
                */
                cookify: function (options) {
                    var nameTokenAttrs, getN, resetNameTokenAttrs, n;

                    resetNameTokenAttrs = function () {
                        nameTokenAttrs = ['name', 'id'];
                    };

                    getN = function () {
                        n = nameTokenAttrs.shift();
                        return !!n;
                    };

                    //Get rid of :radios for this run through--they are special
                    this.not(':radio').each(function () {
                        var $this, nameToken, value;

                        $this = $(this);

                        resetNameTokenAttrs();

                        while (getN()) {
                            nameToken = $this.attr(n);
                            if (typeof nameToken === 'string' && nameToken !== '') {
                                if ($this.is(':input')) {
                                    if (!$this.is(':checkbox') || $this.is(':checked')) {
                                        value = $this.val();
                                    }
                                }
                                else {
                                    value = $this.html();
                                }

                                value = (typeof value === 'string' && value !== '')
									? value
									: null;

                                $.cookies.set(nameToken, value, options);

                                break;
                            }
                        }
                    });
                    //Now we can deal with radios...
                    this.filter(':radio').each(function () {
                        //but I'm not sure what to do with these yet...
                        /*
                        var $this, nameToken, value;
                        $this = $( this );

                        resetNameTokenAttrs();

                        while( getN() )
                        {
                        nameToken = $this.attr( n );
                        if( typeof nameToken === 'string' && nameToken !== '' )
                        {
                        }
                        }
                        */
                    });

                    return this;
                },
                /**
                * $( 'selector' ).cookieFill - set the value of an input field or the innerHTML of an element from a cookie by the name or id of the field or element
                *
                * @access public
                * @return jQuery
                */
                cookieFill: function () {
                    var nameTokenAttrs, getN, resetNameTokenAttrs, n;

                    resetNameTokenAttrs = function () {
                        nameTokenAttrs = ['name', 'id'];
                    };

                    getN = function () {
                        n = nameTokenAttrs.shift();
                        return !!n;
                    };

                    //Get rid of :radios for this run through--they are special
                    this.not(':radio').each(function () {
                        var $this, nameToken, value;

                        $this = $(this);

                        resetNameTokenAttrs();

                        while (getN()) {
                            nameToken = $this.attr(n);
                            if (typeof nameToken === 'string' && nameToken !== '') {
                                value = $.cookies.get(nameToken);
                                if (value !== null) {
                                    if ($this.is(':checkbox')) {
                                        if ($this.val() === value) {
                                            $this.attr('checked', true);
                                        }
                                        else {
                                            $this.removeAttr('checked');
                                        }
                                    }
                                    else if ($this.is(':input')) {
                                        $this.val(value);
                                    }
                                    else {
                                        $this.html(value);
                                    }
                                }

                                break;
                            }
                        }
                    });
                    //Now we can deal with radios...
                    this.filter(':radio').each(function () {
                        //but I'm not sure what to do with these yet...
                    });

                    return this;
                },
                /**
                * $( 'selector' ).cookieBind - call cookie fill on matching elements, and bind their change events to cookify()
                *
                * @access public
                * @param options OBJECT - list of cookie options to specify
                * @return jQuery
                */
                cookieBind: function (options) {
                    return this.each(function () {
                        var $this = $(this);
                        $this.cookieFill().change(function () {
                            $this.cookify(options);
                        });
                    });
                }
            };

            $.each(extensions, function (i) {
                $.fn[i] = this;
            });

        } (global.jQuery));
    }
} (window));