region        = "us-east-1"

hosts          = [
    "http://localhost:3000",
    "https://www.verify.college"
    ]

lambda_function_names = [
    "create-session",
    "get-all-student-records",
    "generate-presigned-url"
    ]


api_resources = [
  {
    name      = "session"
    parent    = "root"
    path_part = "session"
  },
  {
    name      = "presigned-url"
    parent    = "root"
    path_part = "presigned-url"
  },
  {
    name      = "presigned-url-selfie"
    parent    = "presigned-url"
    path_part = "selfie"
  },
  {
    name      = "presigned-url-student-id"
    parent    = "presigned-url"
    path_part = "student-id"
  },
]
