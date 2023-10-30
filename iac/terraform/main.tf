terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.67"
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
    Environment = "production"

  } 
}
locals {
  s3_origin_id = "myS3Origin"
}
resource "aws_s3_bucket_policy" "cloudfront_access" {
  bucket = aws_s3_bucket.ecomm_react_bucket.id

  policy = jsonencode({
    Version = "2008-10-17",
    Id      = "PolicyForCloudFrontPrivateContent",
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal",
        Effect = "Allow",
        Principal = {
          Service = "cloudfront.amazonaws.com"
        },
        Action = "s3:GetObject",
        Resource = "arn:aws:s3:::luxuria-jewels-s3-bucket/*",
        Condition = {
          StringEquals = {
            "aws:SourceArn" = "arn:aws:cloudfront::344613385034:distribution/ERMV2XJK55VGB"
          }
        }
      }
    ]
  })
}
resource "aws_cloudfront_origin_access_control" "origin" {
  name="ecomm-app"
  origin_access_control_origin_type = "s3"
  signing_behavior = "always"
  signing_protocol = "sigv4"
}

//create cloudfront distribution
resource "aws_cloudfront_distribution" "ecomm_distribution"{
    origin {
        domain_name = aws_s3_bucket.ecomm_react_bucket.bucket_regional_domain_name
        origin_id = local.s3_origin_id
        origin_access_control_id = aws_cloudfront_origin_access_control.origin.id

    }
    enabled = true
    is_ipv6_enabled = true
    default_root_object = "build/index.html"
   
default_cache_behavior {
  allowed_methods = ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  cached_methods = ["GET", "HEAD"]
  target_origin_id = local.s3_origin_id
  forwarded_values {
    query_string = true

    cookies {
        forward = "all"
    }
  }
  viewer_protocol_policy = "redirect-to-https"
   min_ttl= 0
   default_ttl= 3600
   max_ttl = 86400
  
}
restrictions {
  geo_restriction {
    restriction_type = "whitelist"
    locations = ["US", "CA", "AU", "GB"]
  }
}
tags = {
    Environment = "production"
}
viewer_certificate {
  cloudfront_default_certificate = true
}
}

