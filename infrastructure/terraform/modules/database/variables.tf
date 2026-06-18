variable "vpc_id" {
  description = "VPC ID for database security groups"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for the database subnet group"
  type        = list(string)
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}
