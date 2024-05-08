provider "aws" {
  region = var.region
}

data "aws_iam_role" "lab_role" {
  name = "LabRole"
}

resource "aws_s3_bucket" "session_files" {
  bucket = "kys-session-files"
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
