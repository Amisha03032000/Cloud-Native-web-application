packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.2"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

//these are all the variables and 

variable "AWS_REGION" {
  type    = string
  default = "us-east-1"
}
variable "SOURCE_AMI_OWNER" {
  type    = string
  default = "965741050220"
}
variable "SOURCE_AMI_NAME" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9"
}
variable "INSTANCE_TYPE" {
  type    = string
  default = "t2.micro"
}
variable "SSH_USERNAME" {
  type    = string
  default = "admin"
}

variable "subnet_id" {
  type    = string
  default = "subnet-01014c1d6196f4faa"
}


source "amazon-ebs" "debian-ami" {

  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  source_ami      = "${var.SOURCE_AMI_NAME}"
  instance_type   = "${var.INSTANCE_TYPE}"
  region          = "${var.AWS_REGION}"
  ami_description = "AMI FOR CLOUD_AMISHA"
  ssh_username    = "${var.SSH_USERNAME}"
  subnet_id       = "${var.subnet_id}"
  ami_users       = ["965741050220", "046630292763"]

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }

}

build {
  sources = ["source.amazon-ebs.debian-ami"]

  provisioner "file" {

    source = "/home/runner/work/webapp/webapp/webapp.zip"

    destination = "/home/admin/webapp.zip"
  }
  provisioner "shell" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y nodejs npm",
      "sudo DEBIAN_FRONTEND=noninteractive apt update -q",
      "sudo DEBIAN_FRONTEND=noninteractive apt -q --assume-yes install mariadb-client mariadb-server",
      //"sudo systemctl start mariadb",
      //"sudo systemctl enable mariadb",
      //"sudo mysql",
      "sudo DEBIAN_FRONTEND=noninteractive apt install -y unzip",
      "pwd",
      "ls -a",
      "mkdir webapp",
      "mv webapp.zip ./webapp",
      "cd webapp",
      "unzip webapp.zip",
      "npm install",
      "sudo groupadd csye6225",
      "sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225",
      "sudo useradd -m amisha",
      "sudo useradd -m sonal",
      "sudo cp /home/admin/webapp/app.service /lib/systemd/system/app.service",


      "sudo apt-get update",
      "sudo apt-get install awscli -y",

      # Download the Amazon CloudWatch agent
      "curl -O https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb",

      # Install the Amazon CloudWatch agent
      "sudo dpkg -i -E ./amazon-cloudwatch-agent.deb",

      # Copy the cloudwatchconfig.json file to the appropriate directory

      "sudo cp /home/admin/webapp/packer/cloudwatchconfig.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json",


      "sudo systemctl start amazon-cloudwatch-agent",
      "sudo systemctl enable amazon-cloudwatch-agent",
    ]

  }
  post-processor "manifest" {
    output     = "manifest.json"
    strip_path = true
  }
}
