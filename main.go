package main

import (
	"encoding/json"
	"github.com/dBuidl/ConfigDN/ui"
	"github.com/pocketbase/dbx"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/jsvm"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	_ "github.com/dBuidl/ConfigDN/migrations"
)

func main() {
	app := pocketbase.New()

	// ---------------------------------------------------------------
	// Optional plugin flags:
	// ---------------------------------------------------------------

	var migrationsDir string
	app.RootCmd.PersistentFlags().StringVar(
		&migrationsDir,
		"migrationsDir",
		"",
		"the directory with the user defined migrations",
	)

	var automigrate bool
	app.RootCmd.PersistentFlags().BoolVar(
		&automigrate,
		"Automigrate",
		true,
		"enable/disable auto migrations",
	)

	var publicDir string
	app.RootCmd.PersistentFlags().StringVar(
		&publicDir,
		"publicDir",
		defaultPublicDir(),
		"the directory to serve static files",
	)

	var indexFallback bool
	app.RootCmd.PersistentFlags().BoolVar(
		&indexFallback,
		"indexFallback",
		true,
		"fallback the request to index.html on missing static path (eg. when pretty urls are used with SPA)",
	)

	_ = app.RootCmd.ParseFlags(os.Args[1:])

	// ---------------------------------------------------------------
	// Plugins and hooks:
	// ---------------------------------------------------------------

	// load js pb_migrations
	jsvm.MustRegister(app, jsvm.Config{
		MigrationsDir: migrationsDir,
	})

	// migrate command (with go templates)
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		TemplateLang: migratecmd.TemplateLangGo,
		Automigrate:  automigrate,
		Dir:          migrationsDir,
	})

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		// serves static files from the provided public dir (if exists)
		se.Router.GET("/{path...}", apis.Static(ui.PreactAppRoot, indexFallback))

		// Handler for public config fetching
		se.Router.GET("/api/custom/v1/get_config", func(e *core.RequestEvent) error {
			// get key from auth header
			key := e.Request.Header.Get("Authorization")
			if key == "" {
				return e.JSON(http.StatusUnauthorized, JsonErrorResponse{
					Success: false,
					Error:   "missing authorization header",
					Data:    nil,
				})
			}

			// check whether the api key exists
			var apiKeyRecord ApiKeyRecord

			err := app.DB().Select("*").From("api_key").Where(dbx.HashExp{"key": key}).One(&apiKeyRecord)

			// if we error out, return an error
			if err != nil {
				return e.JSON(http.StatusUnauthorized, JsonErrorResponse{
					Success: false,
					Error:   "invalid api key",
					Data:    nil,
				})
			}

			// if key is not the same, return an error (key does not exist)
			if apiKeyRecord.Key != key {
				return e.JSON(http.StatusUnauthorized, JsonErrorResponse{
					Success: false,
					Error:   "invalid api key",
					Data:    nil,
				})
			}

			// var to hold the config key->value info
			var data []ConfigKeyValueInfo

			// select flag.identifier, value.value, value.updated
			err = app.DB().Select("value.updated", "value.value", "flag.identifier").From("api_key").Where(dbx.HashExp{"api_key.key": key}).
				InnerJoin("flag", dbx.NewExp("api_key.config=flag.config")).
				InnerJoin("environment", dbx.NewExp("environment.id=api_key.environment")).
				InnerJoin("value", dbx.NewExp("value.flag=flag.id and value.environment=environment.id")).
				All(&data)

			// if we error out, return an error
			if err != nil {
				return e.JSON(http.StatusInternalServerError, JsonErrorResponse{
					Success: false,
					Error:   "error marshaling data",
					Data:    nil,
				})
			}

			// convert it to the get_config format
			response, err := ConfigValuesToPublicJson(data)

			if err != nil {
				return e.JSON(http.StatusInternalServerError, JsonErrorResponse{
					Success: false,
					Error:   "error converting data",
					Data:    nil,
				})
			}

			// marshal it so we can send it back
			responseJson, err := json.Marshal(response)

			if err != nil {
				return e.JSON(http.StatusInternalServerError, JsonErrorResponse{
					Success: false,
					Error:   "error marshaling data",
					Data:    nil,
				})
			}

			// send it back inside success response
			return e.JSON(http.StatusOK, JsonSuccessResponse{
				Success: true,
				Data:    responseJson,
			})
		})

		// This route handles CORS preflight requests so that ConfigDN can be used in the browser
		se.Router.OPTIONS("/public_api/v1/get_config", func(e *core.RequestEvent) error {
			e.Response.Header().Set("Access-Control-Allow-Origin", "*")
			e.Response.Header().Set("Access-Control-Allow-Methods", "GET")
			e.Response.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			return e.NoContent(http.StatusOK)
		})

		return se.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

// the default pb_public dir location is relative to the executable
func defaultPublicDir() string {
	if strings.HasPrefix(os.Args[0], os.TempDir()) {
		// most likely ran with go run
		return "./pb_public"
	}
	return filepath.Join(os.Args[0], "../pb_public")
}
