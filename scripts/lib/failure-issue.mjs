// Open or update the weekly-growth failure issue; close it after a good run.

const LABEL = "bot:weekly-growth-failure";

export async function reportFailure({ github, owner, repo, lines }) {
  try {
    await github.rest.issues.createLabel({
      owner,
      repo,
      name: LABEL,
      color: "b42318",
      description: "週次更新の失敗",
    });
  } catch (error) {
    if (error.status !== 422) throw error;
  }
  const existing = await github.rest.issues.listForRepo({
    owner,
    repo,
    state: "open",
    labels: LABEL,
    per_page: 1,
  });
  const body = lines.join("\n");
  if (existing.data.length) {
    await github.rest.issues.createComment({
      owner,
      repo,
      issue_number: existing.data[0].number,
      body,
    });
  } else {
    await github.rest.issues.create({
      owner,
      repo,
      title: "週次更新が失敗しました",
      body,
      labels: [LABEL],
    });
  }
}

export async function closeFailureIssues({ github, owner, repo }) {
  const issues = await github.rest.issues.listForRepo({
    owner,
    repo,
    state: "open",
    labels: LABEL,
    per_page: 10,
  });
  for (const issue of issues.data) {
    await github.rest.issues.createComment({
      owner,
      repo,
      issue_number: issue.number,
      body: "次の実行が成功したので閉じます。",
    });
    await github.rest.issues.update({
      owner,
      repo,
      issue_number: issue.number,
      state: "closed",
      state_reason: "completed",
    });
  }
}
