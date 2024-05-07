# TODO

- [ ] Migrate code `aws-infrastructure` branch to `main` using `chalice`
- [ ] Provision S3 bucket for image uploads using `Terraform` or `CloudFormation`
- [ ] Provision DynamoDB table for session management using `Terraform` or `CloudFormation`
- [ ] Setup CI/CD pipeline for `api` (https://aws.github.io/chalice/topics/cd.html)

## Maybe?

- [ ] Remove expired sessions
- [ ] Use event sourcing to improve auditability
- [ ] Email validation (https://github.com/jetbrains/swot)

## Strech Goals

- [ ] "Continue on mobile" support 
- [ ] Logo verification (Check if the logo on the student card matches the university logo)
- [ ] Human-in-the-Loop verification on text match failure
- [ ] Notification service for verification status
- [ ] Audit panel for the customer, to see the uploaded student cards etc.
