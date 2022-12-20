package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func main() {
	app := pocketbase.New()

	// this is the public config api

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		_, err := e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/public_api/v1/get_config",
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

				err := app.DB().Select("*").From("api_key").Where(dbx.HashExp{"key": key}).One(&apiKeyRecord)

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

				// todo: fix this for new database structure

				// select flag.identifier, value.value, value.updated
				err = app.DB().Select("value.updated", "value.value", "flag.identifier").From("flag").Where(dbx.HashExp{"api_key.key": key}).
					InnerJoin("config", dbx.NewExp("config.id=flag.config")).
					InnerJoin("value", dbx.NewExp("value.flag=flag.id and value.environment=environment.id")).
					InnerJoin("environment", dbx.NewExp("environment.config=config.id")).
					InnerJoin("api_key", dbx.NewExp("environment.id=api_key.environment and api_key.config=config.id")).
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
