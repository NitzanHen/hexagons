package internal

import (
	"math"
)

type LatLng struct {
	Lat, Lng float64
}

type Polygon struct {
	Latlngs []LatLng
}

func PolarOffset(origin LatLng, distance float64, bearing float64) LatLng {
	return origin.PolarOffset(distance, bearing)
}

func (origin LatLng) PolarOffset(distance float64, bearing float64) LatLng {
	return LatLng{
		origin.Lat + distance*math.Cos(bearing),
		origin.Lng + distance*math.Sin(float64(bearing)),
	}
}
