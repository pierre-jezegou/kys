(cd api/ && \
    python3 -m venv .venv && \
    source .venv/bin/activate && \
    pip install -r requirements.txt && \
    pip install -r requirements-dev.txt && \
    chalice package --pkg-format terraform . --stage=prod)

mv api/deployment.zip api/chalice.tf.json terraform/

(cd terraform/ && \
    jq --arg VERSION '>= 0.12.26, < 1.9.0' '.terraform.required_version = $VERSION' chalice.tf.json > chalice.tf.tmp && \
    mv chalice.tf.tmp chalice.tf.json && \
    terraform init && terraform apply -auto-approve)
