resource "aws_ecs_cluster" "main" {
  name = "helix-${var.environment}"
}

resource "aws_ecs_service" "api" {
  name = "helix-api"
  cluster = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count = 2
  launch_type = "FARGATE"
  network_configuration {
    subnets = var.subnet_ids
    assign_public_ip = true
  }
}

resource "aws_ecs_task_definition" "api" {
  family = "helix-api"
  requires_compatibilities = ["FARGATE"]
  network_mode = "awsvpc"
  cpu = 512
  memory = 1024
  container_definitions = jsonencode([
    {
      name = "api"
      image = "helix-api:latest"
      portMappings = [{ containerPort = 4000 }]
      environment = [
        { name = "DATABASE_URL", value = var.database_url },
        { name = "REDIS_URL", value = var.redis_url },
      ]
    }
  ])
}
