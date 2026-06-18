resource "aws_db_instance" "postgres" {
  identifier = "helix-${var.environment}"
  engine = "postgres"
  engine_version = "17"
  instance_class = "db.t3.medium"
  allocated_storage = 20
  db_name = "helix"
  username = "helix"
  password = random_password.db_password.result
  vpc_security_group_ids = [aws_security_group.database.id]
  db_subnet_group_name = aws_db_subnet_group.main.name
  skip_final_snapshot = true
}

resource "random_password" "db_password" {
  length = 16
  special = false
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id = "helix-redis-${var.environment}"
  engine = "redis"
  node_type = "cache.t3.micro"
  num_cache_nodes = 1
  subnet_group_name = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]
}

output "database_url" { value = aws_db_instance.postgres.endpoint }
output "redis_url" { value = aws_elasticache_cluster.redis.cache_nodes[0].address }
