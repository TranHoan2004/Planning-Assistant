package pkg

type ApiResponse[T any] struct {
	StatusCode int `json:"status_code"`
	Data       T   `json:"data"`
}
