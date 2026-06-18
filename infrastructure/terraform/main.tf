terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "network" {
  source = "./modules/network"
  vpc_cidr = var.vpc_cidr
}

module "database" {
  source = "./modules/database"
  vpc_id = module.network.vpc_id
  subnet_ids = module.network.private_subnet_ids
}

module "compute" {
  source = "./modules/compute"
  vpc_id = module.network.vpc_id
  subnet_ids = module.network.public_subnet_ids
  database_url = module.database.database_url
  redis_url = module.database.redis_url
}
