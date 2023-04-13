package ui

import (
	"embed"

	"github.com/labstack/echo/v5"
)

//go:embed all:dist
var distDir embed.FS

// PreactAppRoot contains the embedded dist directory files (without the "dist" prefix)
var PreactAppRoot = echo.MustSubFS(distDir, "dist")
