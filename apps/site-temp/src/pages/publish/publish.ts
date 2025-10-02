import { PUBLISH_URL } from "../../consts";

main();

function main() {
  const gitKeyEl = document.querySelector("#git-key");
  const publishButton = document.querySelector("#publish-button");
  const resultEl = document.querySelector("#result");
  if (!resultEl) {
    throw new Error("丢失结果元素");
  }

  publishButton?.addEventListener("click", async () => {
    const gitKey = (gitKeyEl as HTMLInputElement).value;
    if (!gitKey) {
      resultEl.textContent = `请输入 git key`;
      return;
    }

    const result = await fetch(PUBLISH_URL, {
      method: "post",
      body: gitKey,
    }).catch(e => {
      resultEl.textContent = `接口错误：${String(e)}`;
      return Promise.reject(e);
    });

    const reader = result.body?.getReader();

    if (!reader) {
      resultEl.textContent = "接口错误";
      return;
    }

    resultEl.textContent = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = new TextDecoder().decode(value, { stream: true });
      resultEl.textContent += text;
    }
  });
}
