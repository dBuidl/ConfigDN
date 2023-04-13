package main

import (
	"encoding/json"
	"github.com/pocketbase/pocketbase/tools/types"
)

type GetConfigResponseJson struct {
	Value types.JsonRaw `json:"v"`
}

func ConfigValuesToPublicJson(cKVIs []ConfigKeyValueInfo) (map[string]interface{}, error) {
	var publicJson = make(map[string]interface{})

	for _, cKVI := range cKVIs {
		var value interface{}
		err := json.Unmarshal(cKVI.Value, &value)
		if err != nil {
			return nil, err
		}

		publicJson[cKVI.FlagID] = GetConfigResponseJson{
			Value: cKVI.Value,
		}
	}

	return publicJson, nil
}
