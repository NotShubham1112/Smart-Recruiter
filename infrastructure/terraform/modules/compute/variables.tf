variable "vpc_id" {
  description = "VPC ID for compute resources"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for ECS tasks"
  type        = list(string)
}

variable "database_url" {
  description = "PostgreSQL connection URL"
  type        = string
}

variable "redis_url" {
  description = "Redis connection URL"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}
