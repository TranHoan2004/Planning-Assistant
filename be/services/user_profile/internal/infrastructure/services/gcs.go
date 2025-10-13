package services

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"

	"cloud.google.com/go/storage"
	"gitlab.com/plango-travel/backend/services/user_profile/internal/infrastructure/config"
	"go.uber.org/zap"
)

type GCSService struct {
	client     *storage.Client
	bucketName string
	log        *zap.Logger
}

const (
	baseApiURL = "https://storage.googleapis.com"
)

func NewGCSService(cfg *config.Config, log *zap.Logger) (*GCSService, error) {
	ctx := context.Background()

	client, err := storage.NewClient(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create GCS client: %w", err)
	}

	return &GCSService{
		client:     client,
		bucketName: cfg.GCS.BucketName,
		log:        log,
	}, nil
}

func (s *GCSService) UploadAvatar(ctx context.Context, objectName string, file io.Reader) (string, error) {
	bucket := s.client.Bucket(s.bucketName)
	obj := bucket.Object(objectName)

	buf := make([]byte, 512) // MIME sniffing
	n, err := file.Read(buf)
	if err != nil && err != io.EOF {
		return "", fmt.Errorf("failed to read file header: %w", err)
	}

	contentType := http.DetectContentType(buf[:n])
	reader := io.MultiReader(bytes.NewReader(buf[:n]), file)

	writer := obj.NewWriter(ctx)
	writer.ContentType = contentType
	writer.PredefinedACL = "publicRead"

	if _, err := io.Copy(writer, reader); err != nil {
		return "", fmt.Errorf("failed to write to GCS: %w", err)
	}

	if err := writer.Close(); err != nil {
		return "", fmt.Errorf("failed to close writer: %w", err)
	}

	s.log.Info("Uploaded avatar from GCS",
		zap.String("bucket", s.bucketName),
		zap.String("object", objectName))

	url := fmt.Sprintf("%s/%s/%s", baseApiURL, s.bucketName, objectName)
	// url := fmt.Sprint(objectName)
	return url, nil
}

func (s *GCSService) DeleteAvatar(ctx context.Context, objectName string) error {
	bucket := s.client.Bucket(s.bucketName)
	obj := bucket.Object(objectName)

	if err := obj.Delete(ctx); err != nil {
		return fmt.Errorf("failed to delete object %s: %w", objectName, err)
	}

	s.log.Info("Deleted avatar from GCS",
		zap.String("bucket", s.bucketName),
		zap.String("object", objectName))

	return nil
}

func (s *GCSService) GetAvatar(ctx context.Context, objectName string) (string, error) {
	bucket := s.client.Bucket(s.bucketName)
	obj := bucket.Object(objectName)

	if _, err := obj.Attrs(ctx); err != nil {
		if err == storage.ErrObjectNotExist {
			return "", fmt.Errorf("avatar %s not found", objectName)
		}
		return "", fmt.Errorf("failed to get avatar attrs: %w", err)
	}

	url := fmt.Sprintf("%s/%s/%s", baseApiURL, s.bucketName, objectName)
	return url, nil
}

func (s *GCSService) IsAvatarExists(ctx context.Context, objectName string) (bool, error) {
	bucket := s.client.Bucket(s.bucketName)
	obj := bucket.Object(objectName)

	if _, err := obj.Attrs(ctx); err != nil {
		if err == storage.ErrObjectNotExist {
			return false, nil
		}
		return false, fmt.Errorf("failed to check avatar existence: %w", err)
	}

	return true, nil
}

// func (s *GCSService) GetSignedURL(objectName string) (string, error) {
//     opts := &storage.SignedURLOptions{
//         GoogleAccessID: s.serviceAccountEmail,
//         PrivateKey:     s.privateKey, // []byte của private key
//         Method:         "GET",
//         Expires:        time.Now().Add(24 * time.Hour), // 1 ngày
//     }

//     url, err := storage.SignedURL(s.bucketName, objectName, opts)
//     if err != nil {
//         return "", err
//     }
//     return url, nil
// }
