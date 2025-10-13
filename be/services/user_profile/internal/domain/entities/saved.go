package entities

import "gitlab.com/plango-travel/backend/services/user_profile/internal/domain/valueobjects"

type UserSaved struct {
	UserId      string      `bson:"user_id" json:"user_id"`
	SavedHotels []Hotel     `bson:"saved_hotels" json:"saved_hotels"`
	PlacesToGo  []PlaceToGo `bson:"places_to_go" json:"places_to_go"`
}

type PlaceToGo struct {
	PlaceId string               `bson:"place_id" json:"place_id"`
	GeoCode valueobjects.GeoCode `bson:"geocode" json:"geocode"`
}

type Hotel struct {
	HotelId string               `bson:"hotel_id" json:"hotel_id"`
	GeoCode valueobjects.GeoCode `bson:"geocode" json:"geocode"`
}
