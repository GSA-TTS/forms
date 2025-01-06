export type GithubRepository = {
  owner: string;
  repository: string;
  branch: string;
  commit: string;
};

export const DEFAULT_REPOSITORY: GithubRepository = {
  owner: 'gsa-tts',
  repository: 'forms',
  branch: 'main',
  commit: 'main',
};

export const getBranchTreeUrl = (
  github: GithubRepository,
  useDefaultShortForm = true
) => {
  if (useDefaultShortForm && github.branch === DEFAULT_REPOSITORY.branch) {
    return `https://github.com/${github.owner}/${github.repository}`;
  }
  return `https://github.com/${github.owner}/${github.repository}/tree/${github.branch}`;
};

export const getGithubRepository = async (
  env?: any
): Promise<GithubRepository> => {
  const { execSync } = await import('child_process');
  return {
    owner: env.OWNER || 'gsa-tts',
    repository: env.REPOSITORY || 'forms',
    branch: env.BRANCH || 'main',
    commit: execSync('git rev-parse HEAD').toString().trim(),
  };
};
