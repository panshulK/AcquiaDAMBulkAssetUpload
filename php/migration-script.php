<?php

require 'vendor/autoload.php';
use Aws\S3\S3Client;
use Aws\Exception\AwsException;

class AcquiaDAMMigration {
    private $s3;
    private $bucket;
    private $accessToken;
    private $uploadProfileUuid;
    private $damBaseUrl = 'https://axelerant.acquiadam.com/api/rest/asset';

    public function __construct($awsConfig, $bucket, $accessToken, $uploadProfileUuid) {
        // Initialize S3 Client
        $this->s3 = new S3Client([
            'version' => 'latest',
            'region'  => $awsConfig['region'],
            'credentials' => [
                'key'    => $awsConfig['key'],
                'secret' => $awsConfig['secret'],
            ],
        ]);
        $this->bucket = $bucket;
        $this->accessToken = $accessToken;
        $this->uploadProfileUuid = $uploadProfileUuid;
    }

    public function getS3Files() {
        try {
            $objects = $this->s3->listObjects([
                'Bucket' => $this->bucket,
                'Prefix' => 'Paints/'  // Fetch only files under "paints/" folder
            ]);
            return $objects['Contents'] ?? [];
        } catch (AwsException $e) {
            echo "S3 Error: " . $e->getMessage();
            return [];
        }
    }

    // Step 2: Upload Files to Acquia DAM
    public function uploadAsset($s3Key) {
        try {
            $tempFilePath = '/tmp/' . basename($s3Key);
            
            // Download file from S3
            $this->s3->getObject([
                'Bucket' => $this->bucket,
                'Key'    => $s3Key,
                'SaveAs' => $tempFilePath
            ]);
            
            $headers = [
                "Content-Type:multipart/form-data",
                "Authorization: Bearer $this->accessToken"
            ];
            
            $postfields = [
                "file" => new CURLFile($tempFilePath),
                "filename" => basename($s3Key),
                "uploadProfileUUID" => $this->uploadProfileUuid
            ];
            
            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => $this->damBaseUrl,
                CURLOPT_HEADER => true,
                CURLOPT_POST => 1,
                CURLOPT_HTTPHEADER => $headers,
                CURLOPT_POSTFIELDS => $postfields,
                CURLOPT_RETURNTRANSFER => true
            ]);
            
            $response = curl_exec($ch);
            curl_close($ch);
            unlink($tempFilePath); // Delete temp file
            
            return $response;
        } catch (AwsException $e) {
            echo "Upload Failed: " . $e->getMessage();
            return false;
        }
    }

    // Step 3: Bulk Upload Files from S3 to Acquia DAM
    public function migrateAssets() {
        $files = $this->getS3Files();
        foreach ($files as $file) {
            $uploadResult = $this->uploadAsset($file['Key']);
            echo "Uploaded: " . $file['Key'] . " - Response: " . print_r($uploadResult, true) . "\n";
        }
    }
}

// Usage Example
$awsConfig = [
    'region' => 'us-east-1',
    'key'    => 'your-aws-access-key',
    'secret' => 'your-aws-secret-key'
];
$bucket = 'your-s3-bucket-name';
$accessToken = 'your-acquia-dam-access-token';
$uploadProfileUuid = 'your-upload-profile-uuid';

$damMigration = new AcquiaDAMMigration($awsConfig, $bucket, $accessToken, $uploadProfileUuid);
$damMigration->migrateAssets();
