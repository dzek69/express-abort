import { createError } from "better-custom-error";
import type { RequestHandler } from "express";

const ConnectionAbortedError = createError("ConnectionAbortedError");

const middleware: RequestHandler = (req, _res, next) => {
    let isEnded = false;

    req.connection.once("end", () => {
        isEnded = true;
    });

    // @ts-expect-error Verify how do do it better
    req.checkConnection = () => { // eslint-disable-line no-param-reassign
        if (isEnded) {
            throw new ConnectionAbortedError("Connection already ended.");
        }
    };

    next();
};

const createMiddleware = () => middleware;

export {
    createMiddleware as createAbortMiddleware,
    ConnectionAbortedError,
};
