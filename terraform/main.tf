provider "aws" {
  region = var.region
}
resource "random_id" "bucket_id" {
  byte_length = 8
}

data "aws_iam_role" "lab_role" {
  name = "LabRole"
}

resource "aws_s3_bucket" "session_files" {
  bucket        = "kys-session-files-${random_id.bucket_id.hex}"
  force_destroy = true
  tags = {
    Name    = "Session Files Bucket"
    project = "KYS"
  }
}

resource "aws_s3_bucket_cors_configuration" "allow_put_from_hosts" {
  bucket = aws_s3_bucket.session_files.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT"]
    allowed_origins = var.hosts
    expose_headers  = []
  }
}


resource "aws_s3_bucket_policy" "session_files_policy" {
  bucket = aws_s3_bucket.session_files.id
  policy = data.aws_iam_policy_document.allow_put_from_lab_role.json
}

data "aws_iam_policy_document" "allow_put_from_lab_role" {
  statement {
    principals {
      type        = "AWS"
      identifiers = [data.aws_iam_role.lab_role.arn]
    }
    effect    = "Allow"
    actions   = ["s3:PutObject"]
    resources = ["${aws_s3_bucket.session_files.arn}/*"]
  }
}

resource "aws_dynamodb_table" "sessions_table" {
  name     = "kys-sessions"
  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }

  read_capacity  = 1
  write_capacity = 1

  tags = {
    Name    = "Sessions Table"
    project = "KYS"
  }
}

resource "aws_cognito_user_pool" "pool" {
  name = "kys-user-pool"
}

resource "aws_cognito_user_pool_client" "app_client" {
  user_pool_id = aws_cognito_user_pool.pool.id
  name         = "kys-app-client"

  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
}

output "lab_role_arn" {
  value = data.aws_iam_role.lab_role.arn
}

output "session_files_bucket_name" {
  value = aws_s3_bucket.session_files.bucket
}

output "sessions_table_name" {
  value = aws_dynamodb_table.sessions_table.name
}

output "user_pool_id" {
  value = aws_cognito_user_pool.pool.id
}

output "user_pool_arn" {
  value = aws_cognito_user_pool.pool.arn
}

output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.app_client.id
}
