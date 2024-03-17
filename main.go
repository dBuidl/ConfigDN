package main

import (
	"encoding/json"
	"github.com/dBuidl/ConfigDN/ui"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

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

	var queryTimeout int
	app.RootCmd.PersistentFlags().IntVar(
		&queryTimeout,
		"queryTimeout",
		30,
		"the default SELECT queries timeout in seconds",
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

	app.OnAfterBootstrap().Add(func(e *core.BootstrapEvent) error {
		app.Dao().ModelQueryTimeout = time.Duration(queryTimeout) * time.Second
		return nil
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		// serves static files from the provided public dir (if exists)
		e.Router.GET("/*", apis.StaticDirectoryHandler(ui.PreactAppRoot, indexFallback))
		return nil
	})

	// Handler for public config fetching
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		_, err := e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/api/v1/get_config",
			Handler: func(c echo.Context) error {
				// get key from auth header
				key := c.Request().Header.Get("Authorization")
				if key == "" {
					return c.JSON(http.StatusUnauthorized, JsonErrorResponse{
						Success: false,
						Error:   "missing authorization header",
						Data:    nil,
					})
				}

				// check whether the api key exists
				var apiKeyRecord ApiKeyRecord

				err := app.Dao().DB().Select("*").From("api_key").Where(dbx.HashExp{"key": key}).One(&apiKeyRecord)

				// if we error out, return an error
				if err != nil {
					return c.JSON(http.StatusUnauthorized, JsonErrorResponse{
						Success: false,
						Error:   "invalid api key",
						Data:    nil,
					})
				}

				// if key is not the same, return an error (key does not exist)
				if apiKeyRecord.Key != key {
					return c.JSON(http.StatusUnauthorized, JsonErrorResponse{
						Success: false,
						Error:   "invalid api key",
						Data:    nil,
					})
				}

				// var to hold the config key->value info
				var data []ConfigKeyValueInfo

				// select flag.identifier, value.value, value.updated
				err = app.Dao().DB().Select("value.updated", "value.value", "flag.identifier").From("api_key").Where(dbx.HashExp{"api_key.key": key}).
					InnerJoin("flag", dbx.NewExp("api_key.config=flag.config")).
					InnerJoin("environment", dbx.NewExp("environment.id=api_key.environment")).
					InnerJoin("value", dbx.NewExp("value.flag=flag.id and value.environment=environment.id")).
					All(&data)

				// if we error out, return an error
				if err != nil {
					return c.JSON(http.StatusInternalServerError, JsonErrorResponse{
						Success: false,
						Error:   "error marshaling data",
						Data:    nil,
					})
				}

				// convert it to the get_config format
				response, err := ConfigValuesToPublicJson(data)

				if err != nil {
					return c.JSON(http.StatusInternalServerError, JsonErrorResponse{
						Success: false,
						Error:   "error converting data",
						Data:    nil,
					})
				}

				// marshal it so we can send it back
				responseJson, err := json.Marshal(response)

				if err != nil {
					return c.JSON(http.StatusInternalServerError, JsonErrorResponse{
						Success: false,
						Error:   "error marshaling data",
						Data:    nil,
					})
				}

				// send it back inside success response
				return c.JSON(http.StatusOK, JsonSuccessResponse{
					Success: true,
					Data:    responseJson,
				})
			},
			Middlewares: []echo.MiddlewareFunc{},
		})

		if err != nil {
			// if route fails to set, we should stop now (as this is core functionality)
			panic(err)
		}

		// This route handles CORS preflight requests so that ConfigDN can be used in the browser
		_, err = e.Router.AddRoute(echo.Route{
			Method: http.MethodOptions,
			Path:   "/public_api/v1/get_config",
			Handler: func(c echo.Context) error {
				// send cors headers
				c.Response().Header().Set("Access-Control-Allow-Origin", "*")
				c.Response().Header().Set("Access-Control-Allow-Methods", "GET")
				c.Response().Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
				return c.NoContent(http.StatusOK)
			},
			Middlewares: []echo.MiddlewareFunc{
				//apis.RequireAdminOrUserAuth(),
			},
		})

		if err != nil {
			// if these routes fail to set, we should panic
			panic(err)
		}

		return nil
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
