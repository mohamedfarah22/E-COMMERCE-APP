terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region  = "ap-southeast-2"
}

resource "aws_s3_bucket" "ecomm_react_bucket" {
  bucket = "luxuria-jewels-s3-bucket"  
  tags = {
    Name = "ecomm-bucket"
    Environment = "Prod"

  } 
}
