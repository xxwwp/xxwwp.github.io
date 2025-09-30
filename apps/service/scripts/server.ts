import e from "express";
import { readdir } from "fs/promises";
import { DOCS_PATH } from "../src/constants";

const app = e();
const port = 3000;

app.use("/docs", e.static(DOCS_PATH));

app.use(`/api/list`, async (req, res) => {
  const files = (await readdir(DOCS_PATH)).filter((v) => v.endsWith(".md"));

  res.json(
    files.map((file) => ({
      name: file,
      path: file,
    }))
  );
  res.end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
