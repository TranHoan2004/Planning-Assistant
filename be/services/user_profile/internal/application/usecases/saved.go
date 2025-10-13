package usecases

import (
	"context"

	"gitlab.com/plango-travel/backend/services/user_profile/internal/domain/valueobjects"
)

type ISavedService interface {
	GetSavedHotels(ctx context.Context, userID string) ([]*SavedHotelResponse, error)
	AddSavedHotel(ctx context.Context, userID string, hotel SavedHotelRequest) (string, error)
	RemoveSavedHotel(ctx context.Context, userID string, hotelID string) (string, error)

	GetSavedPlacesToGo(ctx context.Context, userID string) ([]*SavedPlaceToGoResponse, error)
	AddSavedPlaceToGo(ctx context.Context, userID string, place SavedPlaceToGoRequest) (string, error)
	RemoveSavedPlaceToGo(ctx context.Context, userID string, placeID string) (string, error)

	GetAllSavedItems(ctx context.Context, userID string) (*AllSavedItemsResponse, error)
}

type SavedHotelRequest struct {
	HotelId string               `json:"hotel_id"`
	GeoCode valueobjects.GeoCode `json:"geocode"`
}

type SavedPlaceToGoRequest struct {
	PlaceId string               `json:"place_id"`
	GeoCode valueobjects.GeoCode `json:"geocode"`
}

type SavedHotelResponse struct {
	HotelId string               `json:"hotel_id"`
	GeoCode valueobjects.GeoCode `json:"geocode"`
}

type SavedPlaceToGoResponse struct {
	PlaceId string               `json:"place_id"`
	GeoCode valueobjects.GeoCode `json:"geocode"`
}

type AllSavedItemsResponse struct {
	SavedHotels     []*SavedHotelResponse     `json:"saved_hotels"`
	SavedPlacesToGo []*SavedPlaceToGoResponse `json:"places_to_go"`
}
