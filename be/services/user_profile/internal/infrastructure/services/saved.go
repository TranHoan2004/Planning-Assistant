package services

import (
	"context"
	"fmt"

	"gitlab.com/plango-travel/backend/services/user_profile/internal/application/usecases"
	"gitlab.com/plango-travel/backend/services/user_profile/internal/domain/entities"
	"gitlab.com/plango-travel/backend/services/user_profile/internal/domain/repositories"
	"go.uber.org/zap"
)

type SavedService struct {
	repo repositories.UserSavedRepository
	log  *zap.Logger
}

var _ usecases.ISavedService = (*SavedService)(nil)

func NewSavedService(repo repositories.UserSavedRepository, log *zap.Logger) *SavedService {
	return &SavedService{
		repo: repo,
		log:  log,
	}
}

func (s *SavedService) GetSavedHotels(ctx context.Context, userID string) ([]*usecases.SavedHotelResponse, error) {
	savedHotels, err := s.repo.GetSavedHotels(ctx, userID)
	if err != nil {
		return nil, err
	}
	var response []*usecases.SavedHotelResponse
	for _, hotel := range savedHotels {
		response = append(response, &usecases.SavedHotelResponse{
			HotelId: hotel.HotelId,
			GeoCode: hotel.GeoCode,
		})
	}
	return response, nil
}

func (s *SavedService) AddSavedHotel(ctx context.Context, userID string, hotel usecases.SavedHotelRequest) (string, error) {
	exist, err := s.repo.IsSavedHotelExist(ctx, userID, hotel.HotelId)
	if err != nil {
		return "", err
	}
	if exist {
		return "", fmt.Errorf("hotel with ID %s already exists", hotel.HotelId)
	}

	hotelId, err := s.repo.AddHotel(ctx, userID, entities.Hotel{
		HotelId: hotel.HotelId,
		GeoCode: hotel.GeoCode,
	})
	if err != nil {
		return "", err
	}
	return hotelId, nil
}

func (s *SavedService) RemoveSavedHotel(ctx context.Context, userID string, hotelID string) (string, error) {
	exist, err := s.repo.IsSavedHotelExist(ctx, userID, hotelID)
	if err != nil {
		return "", err
	}
	if !exist {
		return "", fmt.Errorf("hotel with ID %s does not exist", hotelID)
	}

	hotelId, err := s.repo.RemoveHotel(ctx, userID, hotelID)
	if err != nil {
		return "", err
	}
	return hotelId, nil
}

func (s *SavedService) GetSavedPlacesToGo(ctx context.Context, userID string) ([]*usecases.SavedPlaceToGoResponse, error) {
	savedPlaces, err := s.repo.GetSavedPlacesToGo(ctx, userID)
	if err != nil {
		return nil, err
	}
	var response []*usecases.SavedPlaceToGoResponse
	for _, place := range savedPlaces {
		response = append(response, &usecases.SavedPlaceToGoResponse{
			PlaceId: place.PlaceId,
			GeoCode: place.GeoCode,
		})
	}
	return response, nil
}

func (s *SavedService) AddSavedPlaceToGo(ctx context.Context, userID string, place usecases.SavedPlaceToGoRequest) (string, error) {
	exist, err := s.repo.IsSavedPlaceToGoExist(ctx, userID, place.PlaceId)
	if err != nil {
		return "", err
	}
	if exist {
		return "", fmt.Errorf("place with ID %s already exists", place.PlaceId)
	}

	placeId, err := s.repo.AddPlace(ctx, userID, entities.PlaceToGo{
		PlaceId: place.PlaceId,
		GeoCode: place.GeoCode,
	})
	if err != nil {
		return "", err
	}
	return placeId, nil
}

func (s *SavedService) RemoveSavedPlaceToGo(ctx context.Context, userID string, placeID string) (string, error) {
	exist, err := s.repo.IsSavedPlaceToGoExist(ctx, userID, placeID)
	if err != nil {
		return "", err
	}
	if !exist {
		return "", fmt.Errorf("place with ID %s does not exist", placeID)
	}

	placeId, err := s.repo.RemovePlace(ctx, userID, placeID)
	if err != nil {
		return "", err
	}
	return placeId, nil
}

func (s *SavedService) GetAllSavedItems(ctx context.Context, userID string) (*usecases.AllSavedItemsResponse, error) {
	savedHotels, err := s.GetSavedHotels(ctx, userID)
	if err != nil {
		return nil, err
	}
	savedPlaces, err := s.GetSavedPlacesToGo(ctx, userID)
	if err != nil {
		return nil, err
	}
	return &usecases.AllSavedItemsResponse{
		SavedHotels:     savedHotels,
		SavedPlacesToGo: savedPlaces,
	}, nil
}
