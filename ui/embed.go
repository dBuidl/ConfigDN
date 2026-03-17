package ui

import (
	"embed"
	"io/fs"
)

//go:embed all:dist
var distDir embed.FS

// PreactAppRoot contains the embedded dist directory files (without the "dist" prefix)
var PreactAppRoot = func() fs.FS {
	sub, err := fs.Sub(distDir, "dist")
	if err != nil {
		panic(err)
	}
	return sub
}()
