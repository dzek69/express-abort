"use strict";

const { default: createMiddleware, ConnectionAbortedError } = require("./index");

describe("express-abort middleware", () => {
    it("creates middleware", () => {
        const middleware = createMiddleware();
        middleware.must.be.a.function();
    });

    it("adds checkConnection method to req", () => {
        const req = {
            connection: {
                once: () => {},
            },
        };

        const next = () => {};

        const middleware = createMiddleware();
        middleware(req, {}, next);

        req.checkConnection.must.be.a.function();
    });

    it("listens to connection end but only once for given connection", () => {
        const calls = [];

        const req = {
            connection: {
                once: (...args) => {
                    calls.push(args);
                },
            },
        };

        const next = () => {};

        const middleware = createMiddleware();
        middleware(req, {}, next);
        middleware(req, {}, next);

        calls.must.have.length(1);
        calls[0].must.have.length(2);
        calls[0][0].must.equal("end");
        calls[0][1].must.be.a.function();
    });

    it("checkConnection doesn't throw until connection is ended", () => {
        const calls = [];

        const req = {
            connection: {
                once: (...args) => {
                    calls.push(args);
                },
            },
        };

        const next = () => {};

        const middleware = createMiddleware();
        middleware(req, {}, next);

        req.checkConnection.must.not.throw();

        calls[0][1]();

        req.checkConnection.must.throw(ConnectionAbortedError);
    });

    it("calls next", () => {
        let nextCalled;

        nextCalled = false;

        const req = {
            connection: {
                once: () => {},
            },
        };

        const next = () => {
            nextCalled = true;
        };

        const middleware = createMiddleware();
        middleware(req, {}, next);
        nextCalled.must.be.true();
    });
});
