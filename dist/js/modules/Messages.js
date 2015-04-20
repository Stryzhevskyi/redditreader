/**
 * Created by Sergei on 19.04.15.
 */
define(["jquery"], function ($) {
    'use strict';
    var DEFAULT_TIMEOUT = 2000;

    return {
        info: function (msg, timeout) {
            return this.message(msg, "info-message", timeout);
        },
        success: function (msg, timeout) {
            return this.message(msg, "success-message", timeout);
        },
        log: function (msg, timeout) {
            return this.message(msg, "log-message", timeout);
        },
        warn: function (msg, timeout) {
            return this.message(msg, "warn-message", timeout);
        },
        error: function (msg, timeout) {
            return this.message(msg, "error-message", timeout);
        },
        message: function (msg, style, timeout) {
            if (!msg) return;
            return $.snackbar({
                content: msg,
                style: style,
                timeout: timeout || DEFAULT_TIMEOUT
            });
        }
    }

});