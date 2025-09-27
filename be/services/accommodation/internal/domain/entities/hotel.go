package entities

import "gitlab.com/plango-travel/backend/services/accommodation/internal/domain/valueobjects"

type Hotel struct {
	Id      string
	Name    string
	Address valueobjects.Address
	GeoCode valueobjects.GeoCode
}
