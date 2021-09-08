/** @typedef {{ hash: string; date: string; message: string; authorName: string; authorEmail: string; body: string; }} Commit 历史项 */

const simpleGit = require("simple-git");
const git = simpleGit();

/**
 * 获取文件提交信息
 * @param {string} path
 * @returns {{all:Commit[];latest:Commit}} 返回指定文件提交历史
 */
exports.fileCommitInfo = async function fileCommitInfo(path) {
  return await new Promise((resolve) =>
    git.log(
      {
        file: path,
        format: {
          hash: "%H",
          date: "%as",
          message: "%s",
          authorName: "%an",
          authorEmail: "%ae",
          body: "%b",
        },
      },
      (err, log) => resolve(log)
    )
  );
};
