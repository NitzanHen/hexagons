package main

import (
	"context"
	"fmt"
	"strings"

	"github.com/go-redis/redis/v8"
)

var ctx = context.Background()

const FIRE_QUEUE_KEY = "fire-queue"
const GROUP_KEY = "fire-algorithm"

func main() {
	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	if err := rdb.XGroupCreateMkStream(ctx, FIRE_QUEUE_KEY, GROUP_KEY, "$").Err(); err != nil {
		if !strings.HasPrefix(err.Error(), "BUSYGROUP") {
			panic(err)
		}
	}

	for {
		entry, err := rdb.XReadGroup(ctx, &redis.XReadGroupArgs{
			Group:    GROUP_KEY,
			Consumer: "main",
			Streams:  []string{FIRE_QUEUE_KEY, ">"},
			Count:    1,
			Block:    10e9,
		}).Result()

		if err != redis.Nil && err != nil {
			panic(err)
		}

		if len(entry) > 0 {
			fmt.Println(entry[0].Messages[0])

		}
	}
}
