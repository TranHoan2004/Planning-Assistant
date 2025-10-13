package repositories

import (
	"context"

	"gitlab.com/plango-travel/backend/services/user_profile/internal/domain/entities"
)

type UserSavedRepository interface {
	FindByUserID(ctx context.Context, userID string) (*entities.UserSaved, error)

	GetSavedHotels(ctx context.Context, userID string) ([]entities.Hotel, error)

	GetSavedPlacesToGo(ctx context.Context, userID string) ([]entities.PlaceToGo, error)

	AddPlace(ctx context.Context, userID string, place entities.PlaceToGo) (string, error)

	RemovePlace(ctx context.Context, userID string, placeID string) (string, error)

	AddHotel(ctx context.Context, userID string, hotel entities.Hotel) (string, error)

	RemoveHotel(ctx context.Context, userID string, hotelID string) (string, error)

	IsSavedHotelExist(ctx context.Context, userID string, hotelID string) (bool, error)

	IsSavedPlaceToGoExist(ctx context.Context, userID string, placeID string) (bool, error)
}
