// handler.js

const AWS = require('aws-sdk');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Validate required environment variables
const requiredEnvVars = ['BUCKET_NAME', 'ACQUIA_DAM_ACCESS_TOKEN', 'UPLOAD_PROFILE_UUID', 'DAM_BASE_URL', 'AWS_REGION'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// AWS Configuration
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const BUCKET = process.env.BUCKET_NAME;
const ACCESS_TOKEN = process.env.ACQUIA_DAM_ACCESS_TOKEN;
const UPLOAD_PROFILE_UUID = process.env.UPLOAD_PROFILE_UUID;
const DAM_BASE_URL = process.env.DAM_BASE_URL;

// Initialize S3 client
const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    console.log('Starting migration process...');

    // Step 1: List objects in S3 with prefix 'Paints/'
    const s3Response = await s3.listObjectsV2({
      Bucket: BUCKET,
      Prefix: 'Paints/'
    }).promise();

    const files = s3Response.Contents || [];
    if (files.length === 0) {
      console.log('No files found under the "Paints/" prefix.');
      return { statusCode: 200, body: 'No files to migrate.' };
    }

    console.log(`Found ${files.length} files to process`);

    // Process each file
    for (const file of files) {
      const s3Key = file.Key;
      const fileName = path.basename(s3Key);
      const tempFilePath = `/tmp/${fileName}`;

      // Step 2: Download the file from S3 to the temporary directory
      console.log(`Downloading file: ${s3Key}`);
      const objectData = await s3.getObject({
        Bucket: BUCKET,
        Key: s3Key
      }).promise();

      try {
        fs.writeFileSync(tempFilePath, objectData.Body);
        console.log(`Successfully downloaded to: ${tempFilePath}`);
      } catch (writeError) {
        console.error(`Failed to write file ${tempFilePath}:`, writeError);
        continue; // Skip to next file if we can't write this one
      }

      // Prepare the multipart form data payload
      const form = new FormData();
      form.append('file', fs.createReadStream(tempFilePath));
      form.append('filename', fileName);
      form.append('uploadProfileUUID', UPLOAD_PROFILE_UUID);

      // Set the headers; note that form.getHeaders() returns the correct multipart headers including boundaries.
      const headers = {
        ...form.getHeaders(),
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      };

      // Step 3: Upload file to Acquia DAM
      try {
        console.log(`Uploading file: ${s3Key} to Acquia DAM`);
        const response = await axios.post(DAM_BASE_URL, form, { headers });
        console.log(`Successfully uploaded: ${s3Key} - Response: `, response.data);
      } catch (uploadError) {
        console.error(`Failed to upload ${s3Key}:`, uploadError.response?.data || uploadError.message);
        continue; // Skip to next file if upload fails
      } finally {
        // Remove the temporary file after upload
        try {
          fs.unlinkSync(tempFilePath);
        } catch (unlinkError) {
          console.error(`Failed to remove temp file ${tempFilePath}:`, unlinkError);
        }
      }
    }

    return { statusCode: 200, body: 'Migration completed successfully.' };
  } catch (error) {
    console.error('Migration error:', error);
    return { statusCode: 500, body: 'Migration failed.' };
  }
};
