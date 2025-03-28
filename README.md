# Acquia DAM Asset Migration

This script automates the migration of assets from an AWS S3 bucket to Acquia DAM using Acquia DAM's API.

## Features

- Fetches image files from an S3 bucket.
- Downloads images locally.
- Uploads images to Acquia DAM using an authentication token.
- Supports bulk asset migration.

## How It Works

1. **Fetch Files from S3**: The script lists all image files under the `paints/` folder in the S3 bucket.
2. **Download Files**: The files are temporarily downloaded to `/tmp/`.
3. **Upload to Acquia DAM**: The files are uploaded using Acquia DAM API.
4. **Bulk Migration**: The script processes all files in the folder automatically.

## Troubleshooting

- Ensure AWS credentials are correct.
- Verify the Acquia DAM access token is valid.
- Check file permissions and storage limits.

## License

MIT License

## Author

Panshul Khurana, Swarad Mokal
