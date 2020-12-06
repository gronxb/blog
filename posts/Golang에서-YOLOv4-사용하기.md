---
date: 2020-11-15 20:01:30
tags: ["Golang","OpenCV"]
thumb: "./images/Golang에서-YOLOv4-사용하기.png"
title: Golang에서 YOLOv4 사용하기
---
# 소개

 YOLOv4 모델은 실시간 환경에서 객체 탐지를 이루기 최적화 된 머신러닝 모델입니다. 

백엔드에서 영상을 실시간으로 읽어 객체 탐지한 데이터를 필요로 한다면 처음으로 생각한건 Node.js에서 **opencv4nodejs**  모듈을 사용하는 것이었습니다. 하지만 Node.js 환경에서 진행한다면 **"과연 실시간으로 처리할 퍼포먼스가 나올까?"** 의문이 들었습니다.

Golang은 바이너리로 컴파일 되기 때문에 퍼포먼스면으로 얻을 수 있는게 많습니다. 더 나아가 동시성을 지원하기 때문에 HTTP서버를 구동하면서 영상 처리를 할 수 있는 언어라고 생각이 들었습니다. 

# 설치

Go언어에서 YOLOv4 모델을 사용하기 위해 OpenCV DNN 모듈을 사용하겠습니다.

Go언어로 바인딩 된 OpenCV 모듈인 [**GoCV**](https://gocv.io)를 설치하셔야합니다.

테스트 환경은 우분투에서 진행하였습니다.

```bash
> go get -u -d gocv.io/x/gocv
> cd $GOPATH/src/gocv.io/x/gocv
> make install
```

OpenCV를 컴파일하기 때문에 30분 가량의 시간이 소모될 수 있습니다.

# YOLOv4 모델 사용

## ReadCOCO()

 먼저 탐지될 클래스들이 모여있는 [**coco.names**](https://github.com/pjreddie/darknet/blob/master/data/coco.names)를 다운 받고 파일 입출력으로 읽겠습니다.

```go
func ReadCOCO() []string {
	var classes []string
	read, _ := os.Open("./assets/coco.names")
	defer read.Close()
	for {
		var t string
		_, err := fmt.Fscan(read, &t)
		if err != nil {
			break
		}
		classes = append(classes, t)
	}
	return classes
}
```

## ReadNet()

다음으론 [**yolov4.weights**](https://github.com/AlexeyAB/darknet/releases/download/darknet_yolo_v3_optimal/yolov4.weights)와 [**yolov4.cfg**](https://github.com/Tianxiaomo/pytorch-YOLOv4/blob/master/cfg/yolov4.cfg)를 다운 받아 OpenCV DNN 모듈로 읽어내야합니다.

```bash
> mkdir -p assets
> wget -O assets/yolov4.weights https://github.com/AlexeyAB/darknet/releases/download/darknet_yolo_v3_optimal/yolov4.weights
> wget -O assets/yolov4.cfg https://github.com/Tianxiaomo/pytorch-YOLOv4/blob/master/cfg/yolov4.cfg
```

본문에선 assets 폴더 내에 파일들을 넣어뒀습니다.

```go
net := gocv.ReadNet("./assets/yolov4.weights", "./assets/yolov4.cfg")
defer net.Close()
net.SetPreferableBackend(gocv.NetBackendType(gocv.NetBackendDefault))
net.SetPreferableTarget(gocv.NetTargetType(gocv.NetTargetCPU))
```

SetPreferableBackend, SetPreferableTarget로 백엔드 방식과 타겟을 설정할 수 있습니다.

저는 현 상황에서 GPU를 사용하지 못하여 기본으로 설정 후 CPU를 선택했습니다.

각자 환경에 맞춰 설정하면 되겠습니다.

 설정 상수는 다음과 같습니다. 

```go
// SetPreferableBackend
const (
    // NetBackendDefault is the default backend.
    NetBackendDefault NetBackendType = 0

    // NetBackendHalide is the Halide backend.
    NetBackendHalide NetBackendType = 1

    // NetBackendOpenVINO is the OpenVINO backend.
    NetBackendOpenVINO NetBackendType = 2

    // NetBackendOpenCV is the OpenCV backend.
    NetBackendOpenCV NetBackendType = 3

    // NetBackendVKCOM is the Vulkan backend.
    NetBackendVKCOM NetBackendType = 4

    // NetBackendCUDA is the Cuda backend.
    NetBackendCUDA NetBackendType = 5
)
```

```go
// SetPreferableTarget
const (
    // NetTargetCPU is the default CPU device target.
    NetTargetCPU NetTargetType = 0

    // NetTargetFP32 is the 32-bit OpenCL target.
    NetTargetFP32 NetTargetType = 1

    // NetTargetFP16 is the 16-bit OpenCL target.
    NetTargetFP16 NetTargetType = 2

    // NetTargetVPU is the Movidius VPU target.
    NetTargetVPU NetTargetType = 3

    // NetTargetVulkan is the NVIDIA Vulkan target.
    NetTargetVulkan NetTargetType = 4

    // NetTargetFPGA is the FPGA target.
    NetTargetFPGA NetTargetType = 5

    // NetTargetCUDA is the CUDA target.
    NetTargetCUDA NetTargetType = 6

    // NetTargetCUDAFP16 is the CUDA target.
    NetTargetCUDAFP16 NetTargetType = 7
)
```

## GetUnconnectedOutLayers로 출력 레이어 가져오기

```go
func getOutputsNames(net *gocv.Net) []string {
	var outputLayers []string
	for _, i := range net.GetUnconnectedOutLayers() {
		layer := net.GetLayer(i)
		layerName := layer.GetName()
		if layerName != "_input" {
			outputLayers = append(outputLayers, layerName)
		}
	}
	return outputLayers
}
```

## Detect()

```go
// PostProcess : All Detect Box
func PostProcess(frame gocv.Mat, outs *[]gocv.Mat) ([]image.Rectangle, []float32, []int) {
	var classIds []int
	var confidences []float32
	var boxes []image.Rectangle
	for _, out := range *outs {

		data, _ := out.DataPtrFloat32()
		for i := 0; i < out.Rows(); i, data = i+1, data[out.Cols():] {

			scoresCol := out.RowRange(i, i+1)

			scores := scoresCol.ColRange(5, out.Cols())
			_, confidence, _, classIDPoint := gocv.MinMaxLoc(scores)
			if confidence > 0.5 {

				centerX := int(data[0] * float32(frame.Cols()))
				centerY := int(data[1] * float32(frame.Rows()))
				width := int(data[2] * float32(frame.Cols()))
				height := int(data[3] * float32(frame.Rows()))

				left := centerX - width/2
				top := centerY - height/2
				classIds = append(classIds, classIDPoint.X)
				confidences = append(confidences, float32(confidence))
				boxes = append(boxes, image.Rect(left, top, width, height))
			}
		}
	}
	return boxes, confidences, classIds
}

// drawRect : Detect Class to Draw Rect
func drawRect(img gocv.Mat, boxes []image.Rectangle, classes []string, classIds []int, indices []int) (gocv.Mat, []string) {
	var detectClass []string
	for _, idx := range indices {
		if idx == 0 {
			continue
		}
		gocv.Rectangle(&img, image.Rect(boxes[idx].Max.X, boxes[idx].Max.Y, boxes[idx].Max.X+boxes[idx].Min.X, boxes[idx].Max.Y+boxes[idx].Min.Y), color.RGBA{255, 0, 0, 0}, 2)
		gocv.PutText(&img, classes[classIds[idx]], image.Point{boxes[idx].Max.X, boxes[idx].Max.Y + 30}, gocv.FontHersheyPlain, 10, color.RGBA{0, 0, 255, 0}, 3)
		detectClass = append(detectClass, classes[classIds[idx]])
	}
	return img, detectClass
}

func Detect(net *gocv.Net, src gocv.Mat, scoreThreshold float32, nmsThreshold float32, OutputNames []string, classes []string) (gocv.Mat, []string) {
	img := src.Clone()
	img.ConvertTo(&img, gocv.MatTypeCV32F)
	blob := gocv.BlobFromImage(img, 1/255.0, image.Pt(416, 416), gocv.NewScalar(0, 0, 0, 0), true, false)
	net.SetInput(blob, "")
	probs := net.ForwardLayers(OutputNames)
	boxes, confidences, classIds := PostProcess(img, &probs)

	indices := make([]int, 100)
	if len(boxes) == 0 { // No Classes
		return src, []string{}
	}
	gocv.NMSBoxes(boxes, confidences, scoreThreshold, nmsThreshold, indices)

	return drawRect(src, boxes, classes, classIds, indices)
}
```

**gocv.IMRead**나 **gocv.OpenVideoCapture**로 **Mat**을 구한 뒤 이 함수에 넘겨줄겁니다.

YOLOv4 인식을 위해 8U인 Mat을 32F로 바꿔줍니다.

그 다음 모델에 데이터를 입력하기 위해 YOLOv4 입력 사이즈인 (416,416)으로 변환해줍니다.

그 값으로 네트워크 입력을 설정한 뒤 네트워크를 순방향으로 실행합니다.

그렇게 나온 정보들을 **PostProcess** 함수에서 box 좌표, 정확도, 클래스 아이디를 반환한 뒤

NMXBoxes로 겹쳐있는 박스를 제거합니다.

마지막으로 나온 box좌표와 정확도, 클래스 아이디 정보들을 Mat에 그려줍니다.

# 전체 소스

```go
package main

import (
	"fmt"
	"image"
	"image/color"
	"os"

	"gocv.io/x/gocv"
)

// getOutputsNames : YOLO Layer
func getOutputsNames(net *gocv.Net) []string {
	var outputLayers []string
	for _, i := range net.GetUnconnectedOutLayers() {
		layer := net.GetLayer(i)
		layerName := layer.GetName()
		if layerName != "_input" {
			outputLayers = append(outputLayers, layerName)
		}
	}
	return outputLayers
}

// PostProcess : All Detect Box
func PostProcess(frame gocv.Mat, outs *[]gocv.Mat) ([]image.Rectangle, []float32, []int) {
	var classIds []int
	var confidences []float32
	var boxes []image.Rectangle
	for _, out := range *outs {

		data, _ := out.DataPtrFloat32()
		for i := 0; i < out.Rows(); i, data = i+1, data[out.Cols():] {

			scoresCol := out.RowRange(i, i+1)

			scores := scoresCol.ColRange(5, out.Cols())
			_, confidence, _, classIDPoint := gocv.MinMaxLoc(scores)
			if confidence > 0.5 {

				centerX := int(data[0] * float32(frame.Cols()))
				centerY := int(data[1] * float32(frame.Rows()))
				width := int(data[2] * float32(frame.Cols()))
				height := int(data[3] * float32(frame.Rows()))

				left := centerX - width/2
				top := centerY - height/2
				classIds = append(classIds, classIDPoint.X)
				confidences = append(confidences, float32(confidence))
				boxes = append(boxes, image.Rect(left, top, width, height))
			}
		}
	}
	return boxes, confidences, classIds
}

// ReadCOCO : Read coco.names
func ReadCOCO() []string {
	var classes []string
	read, _ := os.Open("./assets/coco.names")
	defer read.Close()
	for {
		var t string
		_, err := fmt.Fscan(read, &t)
		if err != nil {
			break
		}
		classes = append(classes, t)
	}
	return classes
}

// drawRect : Detect Class to Draw Rect
func drawRect(img gocv.Mat, boxes []image.Rectangle, classes []string, classIds []int, indices []int) (gocv.Mat, []string) {
	var detectClass []string
	for _, idx := range indices {
		if idx == 0 {
			continue
		}
		gocv.Rectangle(&img, image.Rect(boxes[idx].Max.X, boxes[idx].Max.Y, boxes[idx].Max.X+boxes[idx].Min.X, boxes[idx].Max.Y+boxes[idx].Min.Y), color.RGBA{255, 0, 0, 0}, 2)
		gocv.PutText(&img, classes[classIds[idx]], image.Point{boxes[idx].Max.X, boxes[idx].Max.Y + 30}, gocv.FontHersheyPlain, 10, color.RGBA{0, 0, 255, 0}, 3)
		detectClass = append(detectClass, classes[classIds[idx]])
	}
	return img, detectClass
}

// Detect : Run YOLOv4 Process
func Detect(net *gocv.Net, src gocv.Mat, scoreThreshold float32, nmsThreshold float32, OutputNames []string, classes []string) (gocv.Mat, []string) {
	img := src.Clone()
	img.ConvertTo(&img, gocv.MatTypeCV32F)
	blob := gocv.BlobFromImage(img, 1/255.0, image.Pt(416, 416), gocv.NewScalar(0, 0, 0, 0), true, false)
	net.SetInput(blob, "")
	probs := net.ForwardLayers(OutputNames)
	boxes, confidences, classIds := PostProcess(img, &probs)

	indices := make([]int, 100)
	if len(boxes) == 0 { // No Classes
		return src, []string{}
	}
	gocv.NMSBoxes(boxes, confidences, scoreThreshold, nmsThreshold, indices)

	return drawRect(src, boxes, classes, classIds, indices)
}

// GetFrame : Read Frame and Process
func GetFrame(cap *gocv.VideoCapture) {
	// Init
	classes := ReadCOCO()

	net := gocv.ReadNet("./assets/yolov4.weights", "./assets/yolov4.cfg")
	defer net.Close()
	net.SetPreferableBackend(gocv.NetBackendType(gocv.NetBackendDefault))
	net.SetPreferableTarget(gocv.NetTargetType(gocv.NetTargetCPU))

	img := gocv.NewMat()
	defer img.Close()

	OutputNames := getOutputsNames(&net)

	window := gocv.NewWindow("yolo")
	for {
		if ok := cap.Read(&img); !ok {
			fmt.Printf("Device closed\n")
			return
		}
		if img.Empty() {
			continue
		}
		detectImg, detectClass := Detect(&net, img.Clone(), 0.45, 0.5, OutputNames, classes)
		fmt.Printf("Dectect Class : %v\n", detectClass)
		window.IMShow(detectImg)
		gocv.WaitKey(1)
		
		detectImg.Close()
	}
}

func main() {
	fmt.Println(os.Args[1])
	cap, err := gocv.OpenVideoCapture(os.Args[1])
	if err != nil {
		fmt.Printf("Error opening capture device")
		return
	}
	defer cap.Close()

	go GetFrame(cap)

	// Time Out
	select {}
}
```

## 결과

![https://user-images.githubusercontent.com/41789633/99181680-4e1a4980-2773-11eb-8522-e3765cc9425c.gif](https://user-images.githubusercontent.com/41789633/99181680-4e1a4980-2773-11eb-8522-e3765cc9425c.gif)

VideoCapture로 영상 프레임을 읽은 뒤 YOLOv4 모델을 처리한 전체 소스입니다.

현재 테스트 환경엔 GPU가 없어서 많이 느리지만 정상 작동 하는 것을 알 수 있습니다.
사용하실 때 GPU를 사용한다면 보다 빠른 속도를 기대할 수 있습니다.

[gron1gh1/gocv-yolov4](https://github.com/gron1gh1/gocv-yolov4)
