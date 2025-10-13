package repositories

import (
	"context"

	"gitlab.com/plango-travel/backend/services/user_profile/internal/domain/entities"
	domainRepo "gitlab.com/plango-travel/backend/services/user_profile/internal/domain/repositories"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type mongoUserSavedRepository struct {
	collection *mongo.Collection
}

var _ domainRepo.UserSavedRepository = (*mongoUserSavedRepository)(nil)

func NewMongoUserSavedRepository(db *mongo.Database) domainRepo.UserSavedRepository {
	return &mongoUserSavedRepository{
		collection: db.Collection("user_saved"),
	}
}

func (r *mongoUserSavedRepository) FindByUserID(ctx context.Context, userID string) (*entities.UserSaved, error) {
	var result entities.UserSaved
	err := r.collection.FindOne(ctx, bson.M{"user_id": userID}).Decode(&result)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (r *mongoUserSavedRepository) AddPlace(ctx context.Context, userID string, place entities.PlaceToGo) (string, error) {
	filter := bson.M{"user_id": userID}
	update := bson.M{"$push": bson.M{"places_to_go": place}}
	opts := options.Update().SetUpsert(true)
	_, err := r.collection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return "", err
	}
	return place.PlaceId, nil
}

func (r *mongoUserSavedRepository) RemovePlace(ctx context.Context, userID string, placeID string) (string, error) {
	filter := bson.M{"user_id": userID}
	update := bson.M{"$pull": bson.M{"places_to_go": bson.M{"place_id": placeID}}}
	result, err := r.collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return "", err
	}
	if result.ModifiedCount == 0 {
		return "", mongo.ErrNoDocuments
	}
	return placeID, nil
}

func (r *mongoUserSavedRepository) AddHotel(ctx context.Context, userID string, hotel entities.Hotel) (string, error) {
	filter := bson.M{"user_id": userID}
	update := bson.M{"$push": bson.M{"saved_hotels": hotel}}
	opts := options.Update().SetUpsert(true)
	_, err := r.collection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return "", err
	}
	return hotel.HotelId, nil
}

func (r *mongoUserSavedRepository) RemoveHotel(ctx context.Context, userID string, hotelID string) (string, error) {
	filter := bson.M{"user_id": userID}
	update := bson.M{"$pull": bson.M{"saved_hotels": bson.M{"hotel_id": hotelID}}}
	result, err := r.collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return "", err
	}
	if result.ModifiedCount == 0 {
		return "", mongo.ErrNoDocuments
	}
	return hotelID, nil
}

func (r *mongoUserSavedRepository) GetSavedHotels(ctx context.Context, userID string) ([]entities.Hotel, error) {
	var result entities.UserSaved
	err := r.collection.FindOne(ctx, bson.M{"user_id": userID}).Decode(&result)
	if err != nil {
		return nil, err
	}
	return result.SavedHotels, nil
}

func (r *mongoUserSavedRepository) GetSavedPlacesToGo(ctx context.Context, userID string) ([]entities.PlaceToGo, error) {
	var result entities.UserSaved
	err := r.collection.FindOne(ctx, bson.M{"user_id": userID}).Decode(&result)
	if err != nil {
		return nil, err
	}
	return result.PlacesToGo, nil
}

func (r *mongoUserSavedRepository) IsSavedHotelExist(ctx context.Context, userID string, hotelID string) (bool, error) {
	filter := bson.M{"user_id": userID, "saved_hotels.hotel_id": hotelID}
	count, err := r.collection.CountDocuments(ctx, filter)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *mongoUserSavedRepository) IsSavedPlaceToGoExist(ctx context.Context, userID string, placeID string) (bool, error) {
	filter := bson.M{"user_id": userID, "places_to_go.place_id": placeID}
	count, err := r.collection.CountDocuments(ctx, filter)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}
