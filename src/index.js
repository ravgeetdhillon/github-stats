import { Octokit } from "@octokit/rest";
import fs from "fs";

const REPO_NAME = "octocat/Hello-World";

const octokit = new Octokit();

const d = new Date();
d.setDate(d.getDate() - 7);
const checkAfter = d.toISOString().split("T")[0];

const fetchIssues = async () => {
  const q = `repo:${REPO_NAME} is:issue updated:>${checkAfter}`;

  const issuesAndPullRequests = await octokit.rest.search.issuesAndPullRequests(
    { q }
  );

  let issuesContent = "";

  issuesAndPullRequests.data.items.forEach((item) => {
    issuesContent += `${item.title} - ${item.html_url}\n\n`;
  });

  return issuesContent;
};

const fetchPRs = async () => {
  // change the updated condition and repo as well to octocat
  const q = `repo:${REPO_NAME} is:pull-request updated:>${checkAfter}`;

  const issuesAndPullRequests = await octokit.rest.search.issuesAndPullRequests(
    { q }
  );

  let prsContent = "";

  issuesAndPullRequests.data.items.forEach((item) => {
    prsContent += `${item.title} - ${item.html_url}\n\n`;
  });

  return prsContent;
};

const main = async () => {
  const reportTemplate = `# Daily Report

## Issues

{{issues}}

## PRs

{{prs}}
`;

  const issuesContent = await fetchIssues();
  const prsContent = await fetchPRs();

  const reportContent = reportTemplate
    .replace(/{{issues}}/g, issuesContent)
    .replace(/{{prs}}/g, prsContent);

  const reportsDir = "./reports";

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }

  const today = new Date().toISOString().split("T")[0];
  fs.writeFileSync(`${reportsDir}/${today}.md`, reportContent);
};

main();
