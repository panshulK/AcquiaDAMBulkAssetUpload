# Acquia DAM Asset Migration

This script automates the migration of assets from an AWS S3 bucket to Acquia DAM using Acquia DAM's API.

## Features

- Fetches image files from an S3 bucket.
- Downloads images locally.
- Uploads images to Acquia DAM using an authentication token.
- Supports bulk asset migration.
- Supports multiple tech stacks, including PHP and JavaScript

## How It Works

1. **Fetch Files from S3**: The script lists all image files under the `paints/` folder in the S3 bucket.
2. **Download Files**: The files are temporarily downloaded to `/tmp/`.
3. **Upload to Acquia DAM**: The files are uploaded using Acquia DAM API.
4. **Bulk Migration**: The script processes all files in the folder automatically.

## Troubleshooting

- Ensure AWS credentials are correct.
- Verify the Acquia DAM access token is valid.
- Check file permissions and storage limits.

## Future Plans/Roadmap

- Add Support for Python programming language
- Add logic for addressing duplicate assets (identified by filename & handled via tags - skip, rename & continue)
- Add logic to fetch folder names dynamically and map them to Upload Profiles via Acquia DAM API in order to avoid static folder checks in the code.

## License

MIT License

## Author

Panshul Khurana

## Thanks to the Contributors

Swarad Mokal (for adding the JS equivalent of the migration)
