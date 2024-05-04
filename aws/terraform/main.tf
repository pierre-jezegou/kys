provider "aws" {
  region        = var.region
}


data "aws_iam_role" "lab_role" {
  name = "LabRole"
}

# Set up S3 bucket

resource "aws_s3_bucket" "student-images" {
    bucket = "kys-student-images"
    acl    = "private"

    cors_rule {
      allowed_headers = ["*"]
      allowed_methods = ["PUT"]
      allowed_origins = var.hosts
      expose_headers  = []
    }
    tags = {
        Name        = "KYS - Student images bucket"
        project     = "KYS"
    }
}

resource "aws_s3_bucket_cors_configuration" "example" {
  bucket = aws_s3_bucket.student-images.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT"]
    allowed_origins = [
      "http://localhost:3000",
      "https://www.verify.college"
      ]
    expose_headers  = []
  }
}

resource "aws_s3_bucket_policy" "bucket-policy" {
    bucket = aws_s3_bucket.student-images.id

    policy = <<EOF
                {
                  "Version": "2012-10-17",
                  "Statement": [
                    {
                      "Sid": "AllowLambdaToUpload",
                      "Effect": "Allow",
                      "Principal": {
                        "AWS": "${aws_iam_role.lab_role.arn}"
                      },
                      "Action": "s3:PutObject",
                      "Resource": "arn:aws:s3:::${aws_s3_bucket.student-images.id}/*"
                    }
                  ]
                }
                EOF
  }


















resource "aws_dynamodb_table" "student-data" {
  name           = "student-data"
  hash_key       = "session_id"
  attribute {
    name = "student_id"
    type = "S"
  }
  tags = {
    Name        = "Student Data Table"
    project     = "KYS"
  }
}













resource "aws_lambda_function" "my_lambda_function" {
  for_each     = var.lambda_function_names
  function_name = each.value
  role          = aws_iam_role.lab_role.arn
  handler       = "index.handler"
  runtime       = "python3.12"
  filename      = "../lambda_functions_zip/${each.value}.py.zip"
  source_code_hash = filebase64sha256("../lambda_functions_zip/${each.value}.py.zip")
  tags = {
    Name        = "My Lambda Function"
    project     = "KYS"
  }
}











resource "aws_api_gateway_rest_api" "kys-api" {
  name        = "kys-api"
  description = "KYS API"
  tags = {
    Name        = "KYS API"
    project     = "KYS"
  }
}

resource "aws_api_gateway_resource" "api_resources" {
  count = length(var.api_resources)

  rest_api_id = aws_api_gateway_rest_api.kys-api.id
  parent_id   = var.api_resources[count.index].parent == "root" ? aws_api_gateway_rest_api.kys-api.root_resource_id : aws_api_gateway_resource.api_resources[count.index - 1].id
  path_part   = var.api_resources[count.index].path_part
}




















