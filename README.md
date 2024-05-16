# kys

Know-Your-Student (KYS) is a service for verifying student identities for discounts and other student benefits.

## Quickstart


### web

```bash
cd web
npm install
cat .env.example > .env.local
npm run dev
```

### api
Copy `.aws/credentials` from the Learner Lab terminal to your local machine.
#### Deploy S3 bucket and DynamoDB table using Terraform
This aims to deploy a S3 bucket and a DynamoDB table for the API to store images and student information.

```bash
cd terraform
terraform init
terraform apply
```
This terraform script return the name of the S3 bucket and the DynamoDB table. You will need to update the `api/.chalice/config.json` file with these values:
- Update the field `APP_BUCKET_NAME` in `api/.chalice/config.json` with the name of the S3 bucket.
- Update the field `APP_TABLE_NAME` in `api/.chalice/config.json` with the name of the DynamoDB table.
- Update the field `iam_role_arn` in `api/.chalice/config.json` with the `LabRole` IAM role ARN from the Learner Lab.

#### Run the API locally
```bash
cd api

python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements-dev.txt
pip install -r requirements.txt

chalice local
```

#### Run the development API on AWS

```bash
cd api

python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements-dev.txt
pip install -r requirements.txt

chalice deploy
```

And set `NEXT_PUBLIC_API_URL` accordingly in `.env` or `.env.local`.
