package pkg

type RadiusUnit string

const (
	Km   RadiusUnit = "KM"
	Mile RadiusUnit = "MILE"
)

type HotelSource string

const (
	BedRank     HotelSource = "BEDRANK"
	DirectChain HotelSource = "DIRECTCHAIN"
	All         HotelSource = "ALL"
)

type OptionalParams struct {
	Radius      int         `json:"radius,omitempty" form:"radius"`
	RadiusUnit  RadiusUnit  `json:"radiusUnit,omitempty" form:"radiusUnit"`
	ChainsCode  []string    `json:"chainsCode,omitempty" form:"chainsCode"`
	Rating      []string    `json:"rating,omitempty" form:"rating"`
	HotelSource HotelSource `json:"hotelSource,omitempty" form:"hotelSource"`
}

type SearchHotelsByCityCodeParams struct {
	CityCode string `json:"cityCode" form:"cityCode" binding:"required"`
	OptionalParams
}

type SearchHotelsByGeoCodeParams struct {
	Latitude  float64 `json:"latitude" form:"latitude" binding:"required"`
	Longitude float64 `json:"longitude" form:"longitude" binding:"required"`
	OptionalParams
}
