# express-abort

Express middleware that will help you save your server resources by not handling requests that was aborted.
More info on blog post (@TODO).

## Usage

```javascript
import express from "express";
import { ConnectionAbortedError, createAbortMiddleware } from "express-abort";

const app = express();

app.use(createAbortMiddleware());

app.get("*", async (req, res) => {
    try {
        const info = await dbFetch();

        req.checkConnection();
        const user = await userFetch();

        req.checkConnection();
        const data = await dataFetch();

        req.checkConnection();
        const renderResult = await render({
            info, user, data,
        });

        req.checkConnection();
        res.send(renderResult)
    }
    catch (e) {
        if (e instanceof ConnectionAbortedError) {
            // no need to do anything, because client won't get any result anyway
        }
        else {
            res.sendStatus(500);
        }
    }
});
```

## License

MIT
