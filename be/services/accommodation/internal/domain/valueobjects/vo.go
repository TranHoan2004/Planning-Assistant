package valueobjects

type GeoCode struct {
	Latitude  float64 `json:"latitude,omitempty"`
	Longitude float64 `json:"longitude,omitempty"`
}

type Address struct {
	PostalCode string   `json:"postal_code,omitempty"`
	CityName   string   `json:"city_name,omitempty"`
	Lines      []string `json:"lines,omitempty"`
}
