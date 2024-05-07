# TODO

- [ ] Migrate code `aws-infrastructure` branch to `main` using `chalice`
- [ ] Provision S3 bucket for image uploads using `Terraform` or `CloudFormation`
- [ ] Provision DynamoDB table for session management using `Terraform` or `CloudFormation`
- [ ] Setup CI/CD pipeline for `api` (https://aws.github.io/chalice/topics/cd.html)
- [ ] Find a way to model the workflow for the verification process. Maybe we should consider event sourcing?

## Maybe?

- [ ] Remove old sessions and images (Maybe every 24 hours?)

## Strech Goals

- [x] "Continue on mobile" support
- [ ] Human-in-the-Loop verification on text match failure
- [ ] Logo verification (Check if the logo on the student card matches the university logo)
- [ ] Audit panel for the customer, to see the uploaded student cards etc.
