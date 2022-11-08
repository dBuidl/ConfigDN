package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

type JsonResponse struct {
	Success bool            `json:"success"`
	Message string          `json:"message"`
	Data    json.RawMessage `json:"data"`
}

type BaseModel struct {
	Id      string         `db:"id"`
	Created types.DateTime `db:"created"`
	Updated types.DateTime `db:"updated"`
}

type ApiKeyAndEnvironmentModel struct {
	BaseModel
}

func main() {
	app := pocketbase.New()

	// this is the public config api

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/api/v1/get_config",
			Handler: func(c echo.Context) error {
				// get key from auth header
				key := c.Request().Header.Get("Authorization")
				if key == "" {
					return c.JSON(http.StatusUnauthorized, JsonResponse{
						Success: false,
						Message: "missing authorization header",
						Data:    nil,
					})
				}

				var apiKeyAndEnvModel ApiKeyAndEnvironmentModel

				// select flag.identifier, value.value, value.updated
				app.DB().Select("*").From("api_key").Where(dbx.HashExp{"key": key}).LeftJoin("environment", dbx.NewExp("environment.id=api_key.environment")).One(&apiKeyAndEnvModel)

				return c.JSON(http.StatusOK, JsonResponse{
					Success: true,
					Message: "Success",
					Data:    nil,
				})
			},
			Middlewares: []echo.MiddlewareFunc{
				//apis.RequireAdminOrUserAuth(),
			},
		})

		e.Router.AddRoute(echo.Route{
			Method: http.MethodOptions,
			Path:   "/api/v1/get_config",
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

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
