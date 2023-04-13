package main

import "encoding/json"

type JsonSuccessResponse struct {
	Success bool            `json:"s"`
	Data    json.RawMessage `json:"d"`
}

type JsonErrorResponse struct {
	Success bool            `json:"s"`
	Error   string          `json:"e"`
	Data    json.RawMessage `json:"d"`
}
