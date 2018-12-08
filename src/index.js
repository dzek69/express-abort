"use strict";
/* eslint-disable no-param-reassign */

const { default: createError } = require("better-custom-error/dist");

const ConnectionAbortedError = createError("ConnectionAbortedError");

const NAME = "__$isEnded$"; // @todo consider making non-enumerable?

const middleware = (req) => {
    if (!(NAME in req.connection)) {
        req.connection[NAME] = false;
        req.connection.once("end", () => {
            req.connection[NAME] = true;
        });
    }

    req.checkConnection = () => {
        if (req.connection[NAME]) {
            throw new ConnectionAbortedError("Connection already ended.");
        }
    };
};

const createMiddleware = () => middleware;

module.exports = {
    default: createMiddleware,
    ConnectionAbortedError: ConnectionAbortedError,
};
