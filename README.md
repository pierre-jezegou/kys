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

Update the field `iam_role_arn` in `api/.chalice/config.json` with the `LabRole` IAM role ARN from the Learner Lab.


```bash
cd api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
pip install -r requirements.txt
```

