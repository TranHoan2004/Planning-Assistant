package repositories

import (
	"context"

	"gitlab.com/plango-travel/backend/services/user_profile/internal/domain/entities"
)

type UserRepository interface {
	InsertOne(ctx context.Context, user *entities.User) (int64, error)

	FindByID(ctx context.Context, id string) (*entities.User, error)

	UpdateByID(ctx context.Context, id string, updateData map[string]interface{}) (int64, error)

	DeleteByID(ctx context.Context, id string) (int64, error)

	FindAll(ctx context.Context) ([]*entities.User, error)
}
