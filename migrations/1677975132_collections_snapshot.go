package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		jsonData := `[
			{
				"id": "s4mq1ee1hnznlfz",
				"created": "2022-11-19 19:53:16.492Z",
				"updated": "2023-03-05 00:03:37.397Z",
				"name": "team",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "5ut2zdg2",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "1pwx8mps",
						"name": "owner",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"collectionId": "systemprofiles0",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "o5pijlvl",
						"name": "admins",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"collectionId": "systemprofiles0",
							"cascadeDelete": false,
							"minSelect": null,
							"maxSelect": 99,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "h6jvon7p",
						"name": "editors",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"collectionId": "systemprofiles0",
							"cascadeDelete": false,
							"minSelect": null,
							"maxSelect": 99,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "87fdpy3v",
						"name": "viewers",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"collectionId": "systemprofiles0",
							"cascadeDelete": false,
							"minSelect": null,
							"maxSelect": 999,
							"displayFields": null
						}
					}
				],
				"listRule": "@request.auth.id = owner.id || @request.auth.id ?= admins.id || @request.auth.id ?= editors.id || @request.auth.id ?= viewers.id",
				"viewRule": "@request.auth.id = owner.id || @request.auth.id ?= admins.id || @request.auth.id ?= editors.id || @request.auth.id ?= viewers.id",
				"createRule": "@request.auth.id = owner.id",
				"updateRule": "@request.auth.id = owner.id",
				"deleteRule": "@request.auth.id = owner.id",
				"options": {}
			},
			{
				"id": "t3c6e6hc22l769v",
				"created": "2022-11-19 19:53:16.492Z",
				"updated": "2023-03-05 00:03:37.398Z",
				"name": "project",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "kkb2ta8p",
						"name": "team",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"collectionId": "s4mq1ee1hnznlfz",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "h5n8a4hp",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					}
				],
				"listRule": "@request.auth.id = team.owner.id || @request.auth.id ?= team.admins.id || @request.auth.id ?= team.editors.id || @request.auth.id ?= team.viewers.id",
				"viewRule": "@request.auth.id = team.owner.id || @request.auth.id ?= team.admins.id || @request.auth.id ?= team.editors.id || @request.auth.id ?= team.viewers.id",
				"createRule": "@request.auth.id = team.owner.id || @request.auth.id ?= team.admins.id",
				"updateRule": "@request.auth.id = team.owner.id || @request.auth.id ?= team.admins.id",
				"deleteRule": "@request.auth.id = team.owner.id || @request.auth.id ?= team.admins.id",
				"options": {}
			},
			{
				"id": "mixx87ealfdmjua",
				"created": "2022-11-19 19:53:16.492Z",
				"updated": "2023-03-05 00:03:37.398Z",
				"name": "config",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "aiijq9xl",
						"name": "project",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"collectionId": "t3c6e6hc22l769v",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "aptdehdc",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					}
				],
				"listRule": "@request.auth.id = project.team.owner.id || @request.auth.id ?= project.team.admins.id || @request.auth.id ?= project.team.editors.id || @request.auth.id ?= project.team.viewers.id",
				"viewRule": "@request.auth.id = project.team.owner.id || @request.auth.id ?= project.team.admins.id || @request.auth.id ?= project.team.editors.id || @request.auth.id ?= project.team.viewers.id",
				"createRule": "@request.auth.id = project.team.owner.id || @request.auth.id ?= project.team.admins.id || @request.auth.id ?= project.team.editors.id",
				"updateRule": "@request.auth.id = project.team.owner.id || @request.auth.id ?= project.team.admins.id || @request.auth.id ?= project.team.editors.id",
				"deleteRule": "@request.auth.id = project.team.owner.id || @request.auth.id ?= project.team.admins.id",
				"options": {}
			},
			{
				"id": "ogmpxvmqq1fd0o1",
				"created": "2022-11-19 19:53:16.492Z",
				"updated": "2023-03-05 00:03:37.398Z",
				"name": "flag",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "qvlwubta",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "pch8wgin",
						"name": "identifier",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": 1,
							"max": 32,
							"pattern": "^[A-z0-9_-]{1,32}$"
						}
					},
					{
						"system": false,
						"id": "kjcecrmv",
						"name": "config",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"collectionId": "mixx87ealfdmjua",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "j1uthccm",
						"name": "type",
						"type": "select",
						"required": true,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"values": [
								"number",
								"string",
								"array",
								"json",
								"boolean"
							]
						}
					},
					{
						"system": false,
						"id": "amjepurg",
						"name": "valuesSource",
						"type": "url",
						"required": false,
						"unique": false,
						"options": {
							"exceptDomains": [],
							"onlyDomains": []
						}
					},
					{
						"system": false,
						"id": "2wbjlklh",
						"name": "valuesFilter",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "ic6u2qoj",
						"name": "allowedValues",
						"type": "json",
						"required": false,
						"unique": false,
						"options": {}
					}
				],
				"listRule": "@request.auth.id = config.project.team.owner.id || @request.auth.id ?= config.project.team.admins.id || @request.auth.id ?= config.project.team.editors.id || @request.auth.id ?= config.project.team.viewers.id",
				"viewRule": "@request.auth.id = config.project.team.owner.id || @request.auth.id ?= config.project.team.admins.id || @request.auth.id ?= config.project.team.editors.id || @request.auth.id ?= config.project.team.viewers.id",
				"createRule": "@request.auth.id = config.project.team.owner.id || @request.auth.id ?= config.project.team.admins.id || @request.auth.id ?= config.project.team.editors.id",
				"updateRule": "@request.auth.id = config.project.team.owner.id || @request.auth.id ?= config.project.team.admins.id || @request.auth.id ?= config.project.team.editors.id",
				"deleteRule": "@request.auth.id = config.project.team.owner.id || @request.auth.id ?= config.project.team.admins.id || @request.auth.id ?= config.project.team.editors.id",
				"options": {}
			},
			{
				"id": "u1yctvaahukq2r1",
				"created": "2022-11-19 19:53:16.492Z",
				"updated": "2023-03-05 00:03:37.398Z",
				"name": "environment",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "k0zpheqn",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "8uthdhnu",
						"name": "project",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"collectionId": "t3c6e6hc22l769v",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					}
				],
				"listRule": "@request.auth.id = project.team.owner.id || @request.auth.id ?= project.team.admins.id || @request.auth.id ?= project.team.editors.id || @request.auth.id ?= project.team.viewers.id",
				"viewRule": "@request.auth.id = project.team.owner.id || @request.auth.id ?= project.team.admins.id || @request.auth.id ?= project.team.editors.id || @request.auth.id ?= project.team.viewers.id",
				"createRule": "@request.auth.id = project.team.owner.id || @request.auth.id ?= project.team.admins.id || @request.auth.id ?= project.team.editors.id",
				"updateRule": "@request.auth.id = project.team.owner.id || @request.auth.id ?= project.team.admins.id || @request.auth.id ?= project.team.editors.id",
				"deleteRule": "@request.auth.id = project.team.owner.id || @request.auth.id ?= project.team.admins.id",
				"options": {}
			},
			{
				"id": "9ak6v6n8zekgaty",
				"created": "2022-11-19 19:53:16.492Z",
				"updated": "2023-03-05 00:03:37.398Z",
				"name": "value",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "9lgepcz5",
						"name": "flag",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"collectionId": "ogmpxvmqq1fd0o1",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "d92qej4i",
						"name": "environment",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"collectionId": "u1yctvaahukq2r1",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "97dltbqv",
						"name": "value",
						"type": "json",
						"required": false,
						"unique": false,
						"options": {}
					}
				],
				"listRule": "@request.auth.id = environment.project.team.owner.id || @request.auth.id ?= environment.project.team.admins.id || @request.auth.id ?= environment.project.team.editors.id ||\n@request.auth.id ?= environment.project.team.viewers.id",
				"viewRule": "@request.auth.id = environment.project.team.owner.id || @request.auth.id ?= environment.project.team.admins.id || @request.auth.id ?= environment.project.team.editors.id ||\n@request.auth.id ?= environment.project.team.viewers.id",
				"createRule": "@request.auth.id = environment.project.team.owner.id || @request.auth.id ?= environment.project.team.admins.id || @request.auth.id ?= environment.project.team.editors.id",
				"updateRule": "@request.auth.id = environment.project.team.owner.id || @request.auth.id ?= environment.project.team.admins.id || @request.auth.id ?= environment.project.team.editors.id",
				"deleteRule": "@request.auth.id = environment.project.team.owner.id || @request.auth.id ?= environment.project.team.admins.id || @request.auth.id ?= environment.project.team.editors.id",
				"options": {}
			},
			{
				"id": "ap3812wer1q474e",
				"created": "2022-11-19 19:53:16.493Z",
				"updated": "2023-03-05 00:03:37.398Z",
				"name": "api_key",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "uo5c3qea",
						"name": "environment",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"collectionId": "u1yctvaahukq2r1",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "hf1kvswr",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "4idswkaf",
						"name": "key",
						"type": "text",
						"required": true,
						"unique": true,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "blkpcjnp",
						"name": "config",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"collectionId": "mixx87ealfdmjua",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					}
				],
				"listRule": "@request.auth.id = config.project.team.owner.id || @request.auth.id ?= config.project.team.admins.id || @request.auth.id ?= config.project.team.editors.id",
				"viewRule": "@request.auth.id = config.project.team.owner.id || @request.auth.id ?= config.project.team.admins.id || @request.auth.id ?= config.project.team.editors.id",
				"createRule": "@request.auth.id = config.project.team.owner.id || @request.auth.id ?= config.project.team.admins.id || @request.auth.id ?= config.project.team.editors.id",
				"updateRule": "@request.auth.id = config.project.team.owner.id || @request.auth.id ?= config.project.team.admins.id || @request.auth.id ?= config.project.team.editors.id",
				"deleteRule": "@request.auth.id = config.project.team.owner.id || @request.auth.id ?= config.project.team.admins.id || @request.auth.id ?= config.project.team.editors.id",
				"options": {}
			},
			{
				"id": "systemprofiles0",
				"created": "2022-12-04 20:45:57.458Z",
				"updated": "2023-03-05 00:03:37.398Z",
				"name": "users",
				"type": "auth",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "pbfieldname",
						"name": "name",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "pbfieldavatar",
						"name": "avatar",
						"type": "file",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"maxSize": 5242880,
							"mimeTypes": [
								"image/jpg",
								"image/jpeg",
								"image/png",
								"image/svg+xml",
								"image/gif"
							],
							"thumbs": null
						}
					}
				],
				"listRule": "",
				"viewRule": "",
				"createRule": "",
				"updateRule": "id = @request.auth.id",
				"deleteRule": null,
				"options": {
					"allowEmailAuth": true,
					"allowOAuth2Auth": true,
					"allowUsernameAuth": true,
					"exceptEmailDomains": null,
					"manageRule": null,
					"minPasswordLength": 8,
					"onlyEmailDomains": null,
					"requireEmail": true
				}
			}
		]`

		collections := []*models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collections); err != nil {
			return err
		}

		return daos.New(db).ImportCollections(collections, true, nil)
	}, func(db dbx.Builder) error {
		return nil
	})
}
