/* eslint-disable no-param-reassign */

import createError from "better-custom-error";

const ConnectionAbortedError = createError("ConnectionAbortedError");

const NAME = "__$isEnded$"; // @todo consider making non-enumerable?

const middleware = (req, res, next) => {
    if (NAME in req.connection) {
        return next();
    }

    Object.defineProperty(req.connection, NAME, {
        writable: true,
        enumerable: false,
    });
    req.connection.once("end", () => {
        req.connection[NAME] = true;
    });

    req.checkConnection = () => {
        if (req.connection[NAME]) {
            throw new ConnectionAbortedError("Connection already ended.");
        }
    };

    return next();
};

const createMiddleware = () => middleware;

export default createMiddleware;

export {
    ConnectionAbortedError,
};
