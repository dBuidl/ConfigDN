package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("ogmpxvmqq1fd0o1")
		if err != nil {
			return err
		}

		edit_identifier := &core.TextField{
			Id:       "pch8wgin",
			Name:     "identifier",
			Required: true,
			Max:      60,
			Pattern:  "^[A-z0-9_-]{1,32}$",
		}
		collection.Fields.Add(edit_identifier)

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("ogmpxvmqq1fd0o1")
		if err != nil {
			return err
		}

		edit_identifier := &core.TextField{
			Id:       "pch8wgin",
			Name:     "identifier",
			Required: true,
			Max:      32,
			Pattern:  "^[A-z0-9_-]{1,32}$",
		}
		collection.Fields.Add(edit_identifier)

		return app.Save(collection)
	})
}
