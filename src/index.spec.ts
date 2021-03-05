import { createAbortMiddleware, ConnectionAbortedError } from "./index";

describe("express-abort middleware", () => {
    it("creates middleware", () => {
        const middleware = createAbortMiddleware();
        middleware.must.be.a.function();
    });

    it("adds checkConnection method to req", () => {
        const req = {
            connection: {
                once: () => {},
            },
        };

        const next = () => {};

        const middleware = createAbortMiddleware();
        middleware(req, {}, next);

        req.checkConnection.must.be.a.function();
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

        const middleware = createAbortMiddleware();
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

        const middleware = createAbortMiddleware();
        middleware(req, {}, next);
        nextCalled.must.be.true();
    });

    describe("works properly with multiple connections", () => {
        it("detect end on first connection, not on the 2nd", () => {
            const calls1 = [];
            const req1 = {
                connection: {
                    once: (...args) => {
                        calls1.push(args);
                    },
                },
            };

            const calls2 = [];
            const req2 = {
                connection: {
                    once: (...args) => {
                        calls2.push(args);
                    },
                },
            };

            const next = () => {};

            const middleware = createAbortMiddleware();
            middleware(req1, {}, next);
            middleware(req2, {}, next);

            calls1[0][1](); // end first connection

            req1.checkConnection.must.throw(ConnectionAbortedError);
            req2.checkConnection.must.not.throw();
        });

        it("detect end on second connection, not on the 1st", () => {
            const calls1 = [];
            const req1 = {
                connection: {
                    once: (...args) => {
                        calls1.push(args);
                    },
                },
            };

            const calls2 = [];
            const req2 = {
                connection: {
                    once: (...args) => {
                        calls2.push(args);
                    },
                },
            };

            const next = () => {};

            const middleware = createAbortMiddleware();
            middleware(req1, {}, next);
            middleware(req2, {}, next);

            calls2[0][1](); // end second connection

            req1.checkConnection.must.not.throw();
            req2.checkConnection.must.throw(ConnectionAbortedError);
        });
    });
});
