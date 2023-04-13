package main

import "github.com/pocketbase/pocketbase/tools/types"

type BaseDBRecord struct {
	ID      string         `db:"id"`
	Created types.DateTime `db:"created"`
	Updated types.DateTime `db:"updated"`
}

type ConfigKeyValueInfo struct {
	Updated types.DateTime `db:"updated"`
	Value   types.JsonRaw  `db:"value"`
	FlagID  string         `db:"identifier"`
}

type ApiKeyRecord struct {
	BaseDBRecord
	Name        string `db:"name"`
	Key         string `db:"key"`
	Environment string `db:"environment"`
}
