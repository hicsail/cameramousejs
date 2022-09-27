const TAG = "commandServer.ts ";
import { createServer } from "http";
import { parse } from "url";
const PORT_NUMBER = 3001;

function startServer() {
  console.log(TAG, "starting server");
  createServer((req: any, res: any) => {
    const parsedUrl = parse(req.url, true);
    console.log(TAG, "parsedUrl", parsedUrl, "req", req.body);
    // res.send({ status: "ok" });
  }).listen(PORT_NUMBER, () => {
    console.log("> Ready on http://localhost:" + PORT_NUMBER);
  });
}
export { startServer };
