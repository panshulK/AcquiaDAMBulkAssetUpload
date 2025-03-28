# Acquia DAM Asset Migration

This PHP script automates the migration of assets from an AWS S3 bucket to Acquia DAM using Acquia DAM's API.

## Features

- Fetches image files from an S3 bucket.
- Downloads images locally.
- Uploads images to Acquia DAM using an authentication token.
- Supports bulk asset migration.

## Prerequisites

- PHP 7.4+
- Composer installed
- AWS IAM User with S3 access
- Acquia DAM API Access Token

## Installation

### Step 1: Clone the Repository

```sh
git clone https://github.com/your-repo/acquia-dam-migration.git
cd acquia-dam-migration
cd php
```

### Step 2: Install Dependencies

```sh
composer install
```

### Step 3: Configure Environment Variables

Update the script with your AWS and Acquia DAM credentials:

```php
$awsConfig = [
    'region' => 'us-east-1',
    'key'    => 'your-aws-access-key',
    'secret' => 'your-aws-secret-key'
];
$bucket = 'your-s3-bucket-name';
$accessToken = 'your-acquia-dam-access-token';
$uploadProfileUuid = 'your-upload-profile-uuid';
```

## Running the Script

Execute the script using PHP:

```sh
php AcquiaDamMigration.php
```

## How It Works

1. **Fetch Files from S3**: The script lists all image files under the `paints/` folder in the S3 bucket.
2. **Download Files**: The files are temporarily downloaded to `/tmp/`.
3. **Upload to Acquia DAM**: The files are uploaded using Acquia DAM API.
4. **Bulk Migration**: The script processes all files in the folder automatically.

## Troubleshooting

- Ensure AWS credentials are correct.
- Verify the Acquia DAM access token is valid.
- Check file permissions and storage limits.