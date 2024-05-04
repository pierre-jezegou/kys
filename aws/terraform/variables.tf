variable "region" {
  description = "AWS region where resources will be provisioned"
  type        = string
}

variable "hosts" {
  description = "Hosts where the frontend will be hosted"
  type        = list(string)
}

variable "lambda_function_names" {
  description = "Names of the lambda functions"
  type        = list(string)
}

variable "api_resources" {
    type = list(object({
      name       = string
      parent     = string
      path_part  = string
    }))
}

