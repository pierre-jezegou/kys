variable "region" {
  description = "AWS region where resources will be provisioned"
  type        = string
  default     = "us-east-1"
}

variable "hosts" {
  description = "Hosts where the frontend will be hosted"
  type        = list(string)
  default = [
    "http://localhost:3000",
    "https://kys-omega.vercel.app",
    "https://www.verify.college"
  ]
}
