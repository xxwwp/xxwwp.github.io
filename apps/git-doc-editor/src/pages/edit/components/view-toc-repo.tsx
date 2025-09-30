import type { Repo } from "@/feature/model/octokit";

export default function ViewTocRepo(props: { repos: Repo[] }) {
  const { repos } = props;

  return (
    <div>
      {repos.map((repo) => (
        <div key={repo.id}>{repo.name}</div>
      ))}
    </div>
  );
}
