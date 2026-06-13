export const templates: Record<string, string> = {
  pr: `added summary of changes here
changed relevant files
fixed edge cases
related to 123`,

  detailed: `added description of the change
changed existing behavior because of reason
fixed edge cases
implemented new feature
added tests for the new feature
updated docs

type of change: bug fix
breaking change: no

added test A
added test B
closes 456`,

  bug: `fixed crash on login page
reproduced the issue locally
updated error handling in authService
added tests for edge case
added regression test
closes 789`,
};
