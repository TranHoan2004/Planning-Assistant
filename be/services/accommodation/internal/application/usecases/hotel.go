package usecases

import (
	"time"

	"gitlab.com/plango-travel/backend/services/accommodation/internal/domain/valueobjects"
	"gitlab.com/plango-travel/backend/services/accommodation/internal/infrastructure/dtos"
)

type IHotelSearch interface {
	SearchHotelsByCityCode(cityCode string) ([]HotelResponse, error)
	SearchHotelsByGeoCode(latitude, longitude float64) ([]HotelResponse, error)
	SearchHotelsByIds(ids []string) ([]HotelResponse, error)
}

type IHotelDetail interface {
	GetHotelOffersDetail(hotelIds []string, params *HotelOffersRequestParams) ([]dtos.AmadeusHotelOffers, error)
}

type IHotelService interface {
	IHotelSearch
	IHotelDetail
}

type HotelResponse struct {
	Id      string               `joson:"id"`
	Name    string               `json:"name"`
	Address valueobjects.Address `json:"address"`
	GeoCode valueobjects.GeoCode `json:"geocode"`
	Rating  *int                 `json:"rating,omitempty"`
}

type HotelOffersRequestParams struct {
	Adults       *int
	CheckInDate  *time.Time
	CheckOutDate *time.Time
	RoomQuantity *int
	PriceRange   *string
	Currency     *string
}
