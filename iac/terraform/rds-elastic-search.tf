module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "2.77.0"

  name                 = "ecomm"
  cidr                 = "10.0.0.0/16"
  azs                  = ["ap-southeast-2a", "ap-southeast-2b","ap-southeast-2c"]
  public_subnets       = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
  enable_dns_hostnames = true
  enable_dns_support   = true
}
resource "aws_db_subnet_group" "ecommdb" {
  name       = "ecomm"
  subnet_ids = module.vpc.public_subnets

  tags = {
    Name = "Ecomm"
  }
}
resource "aws_security_group" "rds" {
  name   = "ecomm_rds"
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ecomm_rds"
  }
}

resource "aws_db_instance" "ecommdb" {
    identifier = "ecommdb"
    allocated_storage = 10
    db_name = "ecommdb"
    engine = "postgres"
    engine_version = "15.4"
    instance_class = "db.t3.micro"
    username="masteruser"
    password="ecommdbpw"//change pw
    db_subnet_group_name = aws_db_subnet_group.ecommdb.name
    vpc_security_group_ids = [aws_security_group.rds.id]
    parameter_group_name = "default.postgres15"
    publicly_accessible = true
    skip_final_snapshot = true
}

//create elastic-search service
resource "aws_elasticsearch_domain" "product_search"{
  domain_name = "product-search"
  elasticsearch_version = "7.10"
   cluster_config {
    instance_type = "t2.small.elasticsearch"
    dedicated_master_enabled = false
  }

  ebs_options {
    ebs_enabled = true
    volume_size = 10  # Specify the desired volume size
    volume_type = "gp2"  # Specify the EBS volume type (e.g., gp2)
  }
}
resource "aws_elasticsearch_domain_policy" "main" {
  domain_name =aws_elasticsearch_domain.product_search.domain_name

  access_policies = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Action = "es:ESHttp*",
        Resource = aws_elasticsearch_domain.product_search.arn,
        Condition = {
          StringEquals = {
            "aws:PrincipalAccount" = "344613385034"
          }
          
        }
      }
    ]
  })
}

resource "aws_iam_role" "lambda_execution_role" {
  name = "lambda_execution_role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "es.amazonaws.com"
        }
      }
    ]
  })
}

