### Task 12: Infrastructure — Docker, Kubernetes, Terraform

Create files under `infrastructure/`.

**infrastructure/docker/docker-compose.yml:**
```yaml
services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: helix
      POSTGRES_PASSWORD: helix
      POSTGRES_DB: helix
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  neo4j:
    image: neo4j:5-community
    environment:
      NEO4J_AUTH: neo4j/helix
    ports:
      - "7687:7687"
      - "7474:7474"

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
      - "6334:6334"

  api:
    build:
      context: ../..
      dockerfile: infrastructure/docker/Dockerfile.api
    ports:
      - "4000:4000"
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: postgresql://helix:helix@postgres:5432/helix
      REDIS_HOST: redis

  orchestrator:
    build:
      context: ../..
      dockerfile: infrastructure/docker/Dockerfile.orchestrator
    depends_on:
      - redis
    environment:
      REDIS_HOST: redis

volumes:
  postgres_data:
```

**infrastructure/docker/Dockerfile.api:**
```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY apps/api/ apps/api/
COPY packages/ packages/
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @helix/api build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/index.js"]
```

**infrastructure/docker/Dockerfile.web:**
```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY apps/web/ apps/web/
COPY packages/ packages/
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @helix/web build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
```

**infrastructure/docker/Dockerfile.orchestrator:**
```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY services/orchestration-engine/ services/orchestration-engine/
COPY packages/ packages/
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @helix/orchestration-engine build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/services/orchestration-engine/dist ./dist
COPY --from=builder /app/services/orchestration-engine/package.json ./
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

**infrastructure/docker/.env.example:**
```bash
# Database
DATABASE_URL=postgresql://helix:helix@postgres:5432/helix
REDIS_HOST=redis

# Auth
JWT_SECRET=change-me-in-production

# Logging
LOG_LEVEL=info
```

**infrastructure/kubernetes/api-deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: helix-api
  labels:
    app: helix-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: helix-api
  template:
    metadata:
      labels:
        app: helix-api
    spec:
      containers:
        - name: api
          image: helix-api:latest
          ports:
            - containerPort: 4000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: helix-secrets
                  key: database-url
            - name: REDIS_HOST
              value: helix-redis
---
apiVersion: v1
kind: Service
metadata:
  name: helix-api
spec:
  selector:
    app: helix-api
  ports:
    - port: 4000
      targetPort: 4000
```

**infrastructure/kubernetes/web-deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: helix-web
  labels:
    app: helix-web
spec:
  replicas: 2
  selector:
    matchLabels:
      app: helix-web
  template:
    metadata:
      labels:
        app: helix-web
    spec:
      containers:
        - name: web
          image: helix-web:latest
          ports:
            - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: helix-web
spec:
  selector:
    app: helix-web
  ports:
    - port: 3000
      targetPort: 3000
```

**infrastructure/kubernetes/orchestrator-deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: helix-orchestrator
  labels:
    app: helix-orchestrator
spec:
  replicas: 1
  selector:
    matchLabels:
      app: helix-orchestrator
  template:
    metadata:
      labels:
        app: helix-orchestrator
    spec:
      containers:
        - name: orchestrator
          image: helix-orchestrator:latest
          env:
            - name: REDIS_HOST
              value: helix-redis
```

**infrastructure/kubernetes/postgres-statefulset.yaml:**
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:17-alpine
          ports:
            - containerPort: 5432
          env:
            - name: POSTGRES_USER
              value: helix
            - name: POSTGRES_PASSWORD
              value: helix
            - name: POSTGRES_DB
              value: helix
          volumeMounts:
            - name: postgres-data
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata:
        name: postgres-data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 10Gi
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
```

**infrastructure/kubernetes/redis-deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
        - name: redis
          image: redis:7-alpine
          ports:
            - containerPort: 6379
---
apiVersion: v1
kind: Service
metadata:
  name: helix-redis
spec:
  selector:
    app: redis
  ports:
    - port: 6379
```

**infrastructure/kubernetes/ingress.yaml:**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: helix-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: helix.example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: helix-api
                port:
                  number: 4000
          - path: /
            pathType: Prefix
            backend:
              service:
                name: helix-web
                port:
                  number: 3000
```

**infrastructure/terraform/main.tf:**
```hcl
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
```

**infrastructure/terraform/variables.tf:**
```hcl
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}
```

**infrastructure/terraform/modules/network/main.tf:**
```hcl
resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr
  enable_dns_support = true
  enable_dns_hostnames = true
  tags = { Name = "helix-${var.environment}" }
}

resource "aws_subnet" "public" {
  count = 2
  vpc_id = aws_vpc.main.id
  cidr_block = cidrsubnet(var.vpc_cidr, 8, count.index)
  map_public_ip_on_launch = true
  availability_zone = data.aws_availability_zones.available.names[count.index]
}

resource "aws_subnet" "private" {
  count = 2
  vpc_id = aws_vpc.main.id
  cidr_block = cidrsubnet(var.vpc_cidr, 8, count.index + 10)
  availability_zone = data.aws_availability_zones.available.names[count.index]
}

data "aws_availability_zones" "available" {}

output "vpc_id" { value = aws_vpc.main.id }
output "public_subnet_ids" { value = aws_subnet.public[*].id }
output "private_subnet_ids" { value = aws_subnet.private[*].id }
```

**infrastructure/terraform/modules/database/main.tf:**
```hcl
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
```

**infrastructure/terraform/modules/compute/main.tf:**
```hcl
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
```

Remove `variables.tf` from the Terraform modules (they're at root level).

**Commit:**
```bash
git add infrastructure/
git commit -m "infra: add Docker, Kubernetes, and Terraform configurations"
```
