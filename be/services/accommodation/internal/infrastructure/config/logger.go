package config

import (
	"go.uber.org/zap"
)

func ProvideLogger() (*zap.Logger, error) {
	return zap.NewDevelopment()
}
