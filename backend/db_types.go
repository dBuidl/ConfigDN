package main

import "github.com/pocketbase/pocketbase/tools/types"

type ConfigKeyValueInfo struct {
	Updated types.DateTime `db:"updated"`
	Value   types.JsonRaw  `db:"value"`
	FlagID  string         `db:"identifier"`
}
