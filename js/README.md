# Acquia DAM Asset Migration

This JS script automates the migration of assets from an AWS S3 bucket to Acquia DAM using Acquia DAM's API.

## Features

- Fetches image files from an S3 bucket.
- Downloads images locally.
- Uploads images to Acquia DAM using an authentication token.
- Supports bulk asset migration.

## Prerequisites

- NodeJS 7.4+
- AWS IAM User with S3 access
- Acquia DAM API Access Token

## Installation

### Step 1: Clone the Repository

```sh
git clone https://github.com/your-repo/acquia-dam-migration.git
cd acquia-dam-migration
cd js
```

### Step 2: Install Dependencies

```sh
npm install
```

### Step 3: Configure Environment Variables

1. Copy .env.example to .env:
```sh
cp .env.example .env
```

2. Update the .env file with your credentials:

```sh
# AWS Configuration
AWS_REGION=your-aws-region
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# S3 Bucket
BUCKET_NAME=your-s3-bucket-name

# Acquia DAM Configuration
ACQUIA_DAM_ACCESS_TOKEN=your-acquia-dam-token
UPLOAD_PROFILE_UUID=your-profile-uuid
DAM_BASE_URL=https://<your-dam-name>.acquiadam.com/api/rest/asset
```

3. For AWS Lambda deployment (Optional):
- Package these variables in Lambda environment configuration
- Ensure Lambda has S3 read permissions and internet access

## Running the Script

### Local Execution
```sh
node handler.js
```

### AWS Lambda Deployment (Optional)
1. Package the application:
```sh
zip -r function.zip .
```

2. Create/update Lambda function:
```sh
aws lambda create-function \
  --function-name dam-migration \
  --runtime nodejs14.x \
  --handler handler.handler \
  --zip-file fileb://function.zip \
  --environment Variables={AWS_REGION=us-east-1,BUCKET_NAME=your-bucket,...}
```

### Required IAM Permissions
- S3: ListBucket, GetObject
- Lambda: Basic execution role + VPC access if needed

## How It Works

1. **Fetch Files from S3**: The script lists all image files under the `paints/` folder in the S3 bucket.
2. **Download Files**: The files are temporarily downloaded to `/tmp/`.
3. **Upload to Acquia DAM**: The files are uploaded using Acquia DAM API.
4. **Bulk Migration**: The script processes all files in the folder automatically.

## Troubleshooting

- Ensure AWS credentials are correct.
- Verify the Acquia DAM access token is valid.
- Check file permissions and storage limits.
