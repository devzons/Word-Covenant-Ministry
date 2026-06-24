# Timeline MVP Staging Readiness Checklist

## Pre-Staging Requirements

- [ ] working tree clean
- [ ] latest commits reviewed
- [ ] frontend typecheck passes
- [ ] frontend lint passes
- [ ] frontend build passes
- [ ] `git diff --check` passes
- [ ] route smoke passes locally
- [ ] release notes reviewed
- [ ] no backend/API/DB/import changes included
- [ ] no generated data included

## Staging Deployment Checklist

- [ ] confirm staging branch/tag strategy
- [ ] confirm frontend environment variables
- [ ] confirm staging domain
- [ ] deploy same commit to staging
- [ ] verify `/ko/timeline`
- [ ] verify `/en/timeline`
- [ ] verify Open in Reader links
- [ ] verify mobile layout
- [ ] verify console has no hydration warnings
- [ ] verify no unexpected API errors
- [ ] verify no backend deployment required

## Rollback / Recovery Notes

- frontend-only rollback uses previous frontend deployment
- no DB rollback required because no DB changes
- no import rollback required because no imports
- no generated data cleanup required

## Tag Recommendation

- no tag yet until staging passes
- consider beta tag only after staging validation
- example future tag only: `v0.9.0-beta.1`
