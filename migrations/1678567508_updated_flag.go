package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models/schema"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db)

		collection, err := dao.FindCollectionByNameOrId("ogmpxvmqq1fd0o1")
		if err != nil {
			return err
		}

		// update
		edit_identifier := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "pch8wgin",
			"name": "identifier",
			"type": "text",
			"required": true,
			"unique": false,
			"options": {
				"min": 1,
				"max": 60,
				"pattern": "^[A-z0-9_-]*$"
			}
		}`), edit_identifier)
		collection.Schema.AddField(edit_identifier)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db)

		collection, err := dao.FindCollectionByNameOrId("ogmpxvmqq1fd0o1")
		if err != nil {
			return err
		}

		// update
		edit_identifier := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "pch8wgin",
			"name": "identifier",
			"type": "text",
			"required": true,
			"unique": false,
			"options": {
				"min": 1,
				"max": 60,
				"pattern": "^[A-z0-9_-]{1,32}$"
			}
		}`), edit_identifier)
		collection.Schema.AddField(edit_identifier)

		return dao.SaveCollection(collection)
	})
}
