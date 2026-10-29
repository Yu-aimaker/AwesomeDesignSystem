import assert from "node:assert/strict";
import test from "node:test";
import { closeFailureIssues, reportFailure } from "../lib/failure-issue.mjs";

function fakeGithub({ createLabelError, openIssues = [] } = {}) {
  const calls = [];
  const github = {
    rest: {
      issues: {
        async createLabel(args) {
          calls.push(["createLabel", args]);
          if (createLabelError) throw createLabelError;
        },
        async listForRepo(args) {
          calls.push(["listForRepo", args]);
          return { data: openIssues };
        },
        async createComment(args) {
          calls.push(["createComment", args]);
        },
        async create(args) {
          calls.push(["create", args]);
        },
        async update(args) {
          calls.push(["update", args]);
        },
      },
    },
  };
  return { github, calls };
}

test("reportFailure creates an issue when none are open", async () => {
  const { github, calls } = fakeGithub();
  await reportFailure({
    github,
    owner: "acme",
    repo: "ads",
    lines: ["週次更新が失敗しました。main は変更していません。", "", "- collect: failure"],
  });
  assert.equal(calls[0][0], "createLabel");
  assert.deepEqual(calls[0][1], {
    owner: "acme",
    repo: "ads",
    name: "bot:weekly-growth-failure",
    color: "b42318",
    description: "週次更新の失敗",
  });
  assert.equal(calls.at(-1)[0], "create");
  assert.deepEqual(calls.at(-1)[1], {
    owner: "acme",
    repo: "ads",
    title: "週次更新が失敗しました",
    body: "週次更新が失敗しました。main は変更していません。\n\n- collect: failure",
    labels: ["bot:weekly-growth-failure"],
  });
});

test("reportFailure comments when an open labeled issue exists", async () => {
  const { github, calls } = fakeGithub({ openIssues: [{ number: 42 }] });
  await reportFailure({
    github,
    owner: "acme",
    repo: "ads",
    lines: ["line"],
  });
  assert.equal(calls.some(([name]) => name === "create"), false);
  assert.deepEqual(calls.find(([name]) => name === "createComment")[1], {
    owner: "acme",
    repo: "ads",
    issue_number: 42,
    body: "line",
  });
});

test("reportFailure ignores 422 on createLabel", async () => {
  const { github, calls } = fakeGithub({ createLabelError: { status: 422 } });
  await reportFailure({
    github,
    owner: "acme",
    repo: "ads",
    lines: ["ok"],
  });
  assert.equal(calls.at(-1)[0], "create");
});

test("reportFailure rethrows other createLabel errors", async () => {
  const { github } = fakeGithub({ createLabelError: { status: 500, message: "boom" } });
  await assert.rejects(
    () => reportFailure({ github, owner: "acme", repo: "ads", lines: ["x"] }),
    (error) => error.status === 500,
  );
});

test("closeFailureIssues comments and closes each open issue", async () => {
  const { github, calls } = fakeGithub({
    openIssues: [{ number: 7 }, { number: 8 }],
  });
  await closeFailureIssues({ github, owner: "acme", repo: "ads" });
  assert.deepEqual(
    calls.filter(([name]) => name === "createComment").map(([, args]) => args),
    [
      { owner: "acme", repo: "ads", issue_number: 7, body: "次の実行が成功したので閉じます。" },
      { owner: "acme", repo: "ads", issue_number: 8, body: "次の実行が成功したので閉じます。" },
    ],
  );
  assert.deepEqual(
    calls.filter(([name]) => name === "update").map(([, args]) => args),
    [
      { owner: "acme", repo: "ads", issue_number: 7, state: "closed", state_reason: "completed" },
      { owner: "acme", repo: "ads", issue_number: 8, state: "closed", state_reason: "completed" },
    ],
  );
});
