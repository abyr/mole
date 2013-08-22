/**
 * Override methods or functions with additional function call before or after.
 */

var Mole = function() {
    this.repo = {};
};

Mole.prototype.prepend = function(objectName, funcName, func) {
    if (typeof(func) === "undefined") {
        func = funcName;
        funcName = objectName;
        objectName = "window";
    }
    return this._override(objectName, funcName, func, "prepend");
};

Mole.prototype.append = function(objectName, funcName, func) {
    if (typeof(func) === "undefined") {
        func = funcName;
        funcName = objectName;
        objectName = "window";
    }
    return this._override(objectName, funcName, func, "append");
};

Mole.prototype._override = function(objectName, funcName, func, method) {
    var _this, targetObject, newFunc;

    method = method || "all";

    if (typeof(this.repo[objectName] === "undefined")) {
        this.repo[objectName] = {};
    }

    if (typeof(this.repo[objectName][funcName]) === "undefined") {

        _this = this;

        if (objectName === "window" || objectName === window) {
            this.repo[objectName][funcName] = window[funcName];
            targetObject = window;
        } else {
            targetObject = window[objectName];
        }

        this.repo[objectName][funcName] = targetObject[funcName];

        newFunc = function(){
            var res, args;

            res = false;

            args = Array.prototype.slice.call(arguments);

            if (method === "append" || method === "all") {
                func(args);
            }
            if (typeof(_this.repo[objectName][funcName]) !== "undefined") {
                res = _this.repo[objectName][funcName].apply(_this.repo[objectName], args);
            }

            if (method === "prepend" || method === "all") {
                func(args);
            }

            return res;
        };

        targetObject[funcName] = newFunc;

        targetObject[funcName].prototype = newFunc;
    }
};

var mole = new Mole();
